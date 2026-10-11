<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-rules -->
[... existing auto-generated block stays exactly as-is ...]
<!-- END:nextjs-agent-rules -->

# Vaulty — project-specific agent notes

Read this before making changes. It exists because several of these mistakes
were made once already in this project and cost real debugging time.

## Stack
Next.js 16 (App Router, Turbopack) + TypeScript, Tailwind CSS v4, Clerk
(production instance — pk_live_/sk_live_ only, never pk_test_ in production
env), Prisma 7 + Supabase Postgres (ap-south-1), AWS S3 (presigned uploads),
Google Gemini (multimodal receipt extraction, no separate OCR step), Inngest
(scheduled jobs), Resend (transactional email, verified domain
reminders@vaulty.site), Sentry (errors, uptime, cron monitoring).

## Design system — do not invent new values
All colors, spacing, radius, and typography are CSS variables in
`src/app/globals.css` and mirrored in `tailwind.config.ts`. Use the existing
tokens (`bg-primary`, `text-ink`, `rounded-xl`, `text-body-md`, etc.) — never
hardcode a hex value or a raw pixel size inline.

**Known Tailwind v4 trap**: custom `spacing` scale keys that match Tailwind's
built-in scale (`sm`, `md`, `lg`, `xl`, `2xl`) silently override utilities
like `max-w-*`/`w-*`/`h-*` project-wide, because they share the same CSS
variable namespace. This caused a real production bug (`max-w-2xl` resolving
to 32px instead of 672px). If you add a custom spacing key, verify it isn't
also a Tailwind default size key first.

## The recurring text-wrap bug
Text has broken into one-word-per-line rendering multiple times, from
different root causes each time (missing typography class, a global
`width: 100%` rule fighting flex children, the Tailwind spacing collision
above). If this happens again: inspect the actual computed width of the
broken element AND every ancestor in DevTools before touching CSS — don't
guess or reapply a previous fix blindly.

## Prisma 7 specifics
- `prisma.config.ts` holds the datasource URL, not `schema.prisma` — that
  file only has `provider = "postgresql"`.
- A `PrismaPg` driver adapter is required (`@prisma/adapter-pg`).
- Client is generated at a custom path (`src/generated/prisma` or similar —
  check the `generator` block) — import from there, not `@prisma/client`,
  unless the generator was changed back.
- Schema changes always go through `npx prisma migrate dev --name X`
  locally, never `db push` — migration history is treated as source of
  truth.
- `DIRECT_URL` is currently unreachable due to a `||`/`env()` interaction
  (see deployment.md "Known gaps") — a placeholder value papers over this
  at Docker build time. Don't remove the placeholder without fixing the
  root cause first.

## NEXT_PUBLIC_* variables
These are compiled into the JS bundle at **build time**, not read at
runtime. In Docker, they must be passed as `--build-arg`, converted to
`ENV` inside the `builder` stage, before `RUN npm run build` — `--env-file`
at `docker run` time has no effect on them.

## Deployment
Single EC2 instance (`t3.small`), one-node minikube cluster, nginx
reverse-proxying to a fixed NodePort. Full architecture and rationale is in
`docs/deployment.md` — read it before changing anything infrastructure-
related. Server configuration (swap, kubectl, nginx, minikube's tuned
memory flags) is codified in `ansible/setup-vaulty-ec2.yml`, not manual
steps — update the playbook, not the live server, when something needs to
change permanently.

## Things that look like bugs but aren't
- `npm warn EBADENGINE` for `@prisma/streams-local` — harmless, ignore.
- `npm audit` reporting 4 high severity vulnerabilities — do NOT run
  `npm audit fix --force`, it has previously reopened resolved Next.js/
  Clerk peer-dependency conflicts.
- Sentry events from `/index.php`, raw IP access, or scanner paths —
  automated bot noise, already mitigated at the nginx layer. Not a real
  app bug unless it's a genuinely new pattern.
