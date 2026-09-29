# Architecture

Vaultly is a receipt and warranty tracker: a user uploads a photo of a
receipt, AI reads it, the user reviews and confirms what was extracted, and
Vaultly tracks the resulting product's warranty and reminds the user before
it expires.

This document is the bird's-eye view — what the system is made of and how
the pieces talk to each other. For deploy mechanics and infrastructure
detail, see `docs/deployment.md`. For gotchas specific to working in this
codebase, see `AGENTS.md`.

## System diagram
                     ┌─────────────────────────┐
                     │        Browser          │
                     └────────────┬────────────┘
                                  │ HTTPS
                     ┌────────────▼────────────┐
                     │   nginx (host, EC2)      │  TLS via Certbot
                     └────────────┬────────────┘
                                  │ :30080 (NodePort)
                     ┌────────────▼────────────┐
                     │   minikube (1 node)      │
                     │  ┌────────────────────┐  │
                     │  │  vaulty-web pod    │  │
                     │  │  (Next.js, :3000)  │  │
                     │  └─────────┬──────────┘  │
                     └────────────┼─────────────┘
                                  │
    ┌──────────────┬─────────────┼─────────────┬──────────────┐
    ▼              ▼              ▼             ▼              ▼

┌─────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐
│ Clerk │ │ Supabase │ │ AWS S3 │ │ Gemini │ │ Inngest │
│ (auth) │ │ Postgres │ │(receipts)│ │ (AI) │ │ (cron) │
└─────────┘ └───────────┘ └──────────┘ └──────────┘ └─────┬─────┘
│
┌─────▼─────┐
│ Resend │
│ (email) │
└───────────┘

Sentry watches all of the above: errors, uptime, and the Inngest cron.


## Application layers

**Frontend** — Next.js 16, App Router, TypeScript. A single design system
(colors, spacing, radius, typography) lives as CSS variables in
`src/app/globals.css`, mirrored into `tailwind.config.ts`. Components never
hardcode a value the token system already defines.

**Server logic** — Server Actions and Route Handlers, not a separate API
service. `src/lib/actions/` holds the actions (`products.ts`,
`notifications.ts`, `user-preferences.ts`); `src/app/api/` holds the Route
Handlers that need to be reachable by URL — the presigned-upload endpoint,
the Gemini extraction endpoint, the Inngest webhook, and the health check.

**Data layer** — Prisma 7 with a `PrismaPg` driver adapter, against Supabase
Postgres. Schema changes always go through `prisma migrate dev` locally;
production applies them with `prisma migrate deploy` as a Kubernetes Job
that must succeed before a rollout proceeds.

## The core flow: receipt → product

This is the product's actual value proposition, and the most involved path
in the codebase.

1. **Upload** (`/dashboard/upload`) — the browser requests a presigned S3
   PUT URL from a Route Handler, then uploads the file directly to S3.
   The app server never touches the file bytes; this keeps large uploads
   off the constrained EC2 instance entirely.
2. **Extraction** (`/api/ai/extract`) — the image is sent to Gemini in a
   single multimodal call. There is no separate OCR pass; Gemini reads the
   image directly and returns structured JSON. The extraction distinguishes
   fields it actually read from fields it had to default, and the response
   carries that distinction through to the next step rather than presenting
   a guess as a fact.
3. **Review** (`/dashboard/upload/review`) — every field is rendered
   editable, pre-filled but never locked. Genuinely extracted fields and
   defaulted/uncertain fields are visually distinguished, so the user knows
   what to double-check. This is the "AI suggests, user decides" principle
   the product is built around, not a cosmetic detail.
4. **Save** — confirmed data becomes one or more `Product` rows via the
   same Server Action Products CRUD uses elsewhere; a single receipt can
   yield several products.

## Data model

Three models, one relationship worth naming: `Notification` has
`onDelete: Cascade` on its relation to `Product`, so deleting a product
can't leave orphaned notifications behind.

- **`Product`** — the core entity: name, brand, category, purchase details,
  warranty length, receipt URL. Warranty status (active / expiring /
  expired) is computed from `purchaseDate` + `warrantyMonths` at query
  time, not stored — it can't drift out of date if it's never persisted.
- **`Notification`** — a record of a reminder that was sent or is due,
  tied to a product and a threshold (30/7/1 days).
- **`UserPreferences`** — per-user toggles for which reminder thresholds
  are active; the Inngest reminder function checks this before sending.

## Why each external service, specifically

| Service | Role | Why this one |
|---|---|---|
| Clerk | Auth | Production keys, Google OAuth, session handling — not built in-house |
| Supabase (Postgres) | Primary database | Real relational data with actual joins and cascades; Prisma has no Firestore/NoSQL equivalent that fits this schema |
| AWS S3 | Receipt image storage | Private bucket, presigned URLs only — the app server is never in the file's path |
| Gemini | Receipt data extraction | Multimodal — reads the image directly, no separate OCR step needed |
| Inngest | Scheduled jobs | Daily warranty-threshold check, monitored as a Sentry cron so a silent failure to fire is caught |
| Resend | Transactional email | Verified domain (`reminders@vaulty.site`), templated HTML, not sandbox-only sending |
| Sentry | Observability | One free tier covers error tracking, uptime, and cron monitoring — no separate tool needed for each |

## Infrastructure, in one paragraph

One `t3.small` EC2 instance runs a single-node minikube cluster behind
host-level nginx, which terminates TLS. GitHub Actions builds the Docker
image on its own runner (the instance's 1.9 GB of RAM can't hold a Next.js
build alongside a running cluster), ships the finished image over SSH, and
rolls it out — migrations run as a blocking Job first, and a failed rollout
triggers an automatic rollback. The instance itself is provisioned by
Terraform; everything configured on top of it (swap, nginx, minikube's
memory-tuned systemd service) is codified in Ansible. Full detail,
including the memory-cap failure mode that shaped most of these decisions,
is in `docs/deployment.md`.

## Deliberate tradeoffs

A few decisions here would look different in a well-funded, high-traffic
production system. Worth naming so they read as decisions, not oversights:

- **Single replica, no autoscaling.** The instance has about 600 MB of
  vertical headroom before it needs to grow; horizontal scaling isn't
  meaningful on a one-node cluster anyway.
- **No CDN or edge caching.** Traffic doesn't currently justify one.
- **Cross-region latency** between the app (`us-east-1`) and the database
  (`ap-south-1`) — about 210 ms — is an accepted, known cost, not
  something masked or worked around.
- **Terraform state is local, not remote.** Correct for one operator;
  would need an S3 + DynamoDB backend before this could be run from CI or
  shared with a team.
- **One environment.** There's no separate staging cluster — `main` and
  `Production` both point at the same live infrastructure, distinguished
  only by which branch triggers the deploy workflow.

None of these are wrong for what this project is. They'd be the first
things to revisit if it ever needed to hold real, sustained traffic.