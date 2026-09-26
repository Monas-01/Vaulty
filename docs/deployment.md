# Deployment

Vaultly runs on a single EC2 instance in a one-node minikube cluster, behind
nginx. GitHub Actions builds the image and ships it to that box on every push
to `Production`. Server-level configuration (swap, nginx, minikube, kubectl)
is codified in Ansible, not applied by hand.

This document covers what the pipeline does, why it's shaped the way it is, and
what still needs doing.

## Why it's built this way

The instance is a `t3.small`: 2 vCPU and 1.9 GB of RAM. That single fact drove
most of the design.

A Next.js production build will not fit on that box alongside a running
cluster, so the image is built on a GitHub runner instead. The instance only
ever loads a finished image. Nothing compiles there.

## How a deploy works

Pushing to `Production` runs `.github/workflows/deploy.yml`. Three things
happen, in order.

On the runner, Docker Buildx builds the image with layer caching, then writes it
to a tarball instead of pushing to a registry. The Clerk publishable key and the
app URL are passed as build args, because Next inlines every `NEXT_PUBLIC_*`
variable at build time and setting them later has no effect.

Onto the box, the workflow gzips that tarball, copies it over SSH, and runs
`minikube image load`. Runtime secrets travel separately as a `0600` file and
are written into a Kubernetes Secret, then shredded on both ends. They never
appear in a command line or in the repository.

In the cluster, a Job runs `prisma migrate deploy` and must finish before
anything else proceeds. If it fails, its logs are printed and the deploy stops
without touching the running pod. Once migrations are clean, the manifests apply
and the rollout starts. A failed rollout triggers `kubectl rollout undo`.

Each image is tagged with the commit SHA. That matters more than it looks: the
image is side-loaded rather than pulled, so reusing a tag like `latest` produces
a rollout that reports success while changing nothing.

## What changed in the image

The `Dockerfile` needed four fixes before it could serve this pipeline.

`NEXT_PUBLIC_APP_URL` is now a build arg. Next inlines `NEXT_PUBLIC_*`
variables into server bundles as well as client ones, so setting it at runtime
did nothing and `src/lib/inngest/functions.ts` always fell back to its
hardcoded default.

The runner stage installs `openssl`, because Prisma links against it at runtime
and not only when generating the client.

The runner also copies `node_modules/.prisma` explicitly. Next's dependency
tracing does not reliably pull the generated Prisma client into the standalone
output, and the copy is cheap insurance against that.

Last, the image carries a migration toolchain in `/migrate`. The standalone
runner shipped no Prisma CLI and no schema, so the three existing migrations
had no way to apply. This is what lets one image serve both the web Deployment
and the migrate Job.

## What's in the cluster

Everything lives in the `vaulty` namespace.

`k8s/deployment.yaml` runs one replica with `imagePullPolicy: Never`. Any other
policy makes the kubelet try to pull from a registry that doesn't have the
image, and the pod fails with `ErrImagePull`. The pod requests 256 Mi and is
limited to 512 Mi. A startup probe absorbs Next's slow cold start so the
liveness probe can stay aggressive without killing a pod that is merely
booting. All three probes call `/api/health`, added in
`src/app/api/health/route.ts`. That endpoint does no database work on purpose:
probes run every few seconds and the database is 210 ms away, so a query per
probe would cost more than it reports.

`k8s/service.yaml` exposes the pod on a fixed NodePort, `30080`, so the nginx
config on the host can hardcode it.

`k8s/jobs/migrate.yaml` runs the same image with a different command, working
out of `/migrate`. That directory carries its own `node_modules` and a copy of
`prisma.config.ts`, kept separate from the standalone bundle in `/app`.
Installing Prisma into `/app` would make npm reconcile the tree against the
standalone `package.json` and prune files that Next traced into the bundle.

After a deploy you'll see two pods. One is the app. The other is the finished
migration Job, which exits immediately and deletes itself after ten minutes.

## Traffic

internet :443 -> nginx (host, TLS via Certbot) -> 192.168.49.2:30080 -> Service -> pod :3000


nginx stays on the host rather than running as an ingress controller inside the
cluster. On 1.9 GB of RAM, an ingress controller costs memory the app needs
more. TLS is terminated by nginx using a Certbot-issued certificate for
`vaulty.site` and `www.vaulty.site`; port 80 only exists to redirect to 443.

## Memory

This is the part most likely to bite you later, so it's worth understanding.

minikube's kubelet calculates how much memory it can hand out by reading the
host's `/proc/meminfo`. It does not read its own cgroup limit. Cap the minikube
container at 1 GB and the scheduler will still believe it has 1.9 GB available,
then place pods that cannot fit. Worse, exceeding a cgroup limit is a kernel OOM
kill rather than a graceful eviction, and the process it kills is usually the
largest one in the cgroup, which tends to be etcd. You lose the cluster, not
just a pod.

The cluster is configured to avoid this:

minikube container cgroup 1400 MB
kubelet system-reserved 600 Mi
kubelet kube-reserved 100 Mi
kubelet eviction-hard 150 Mi
node Allocatable 1055 Mi (down from 1905)


The host also has 2 GB of swap with `vm.swappiness=10`. Swap is not there for
performance. It's there so a memory spike degrades instead of killing something.

For reference, a deploy peaks around 772 MB of the 1400 MB ceiling, with swap
barely touched.

These values are not just documentation — they're enforced. See "Server
configuration" below: the memory cap and kubelet reservations are baked
directly into the systemd unit that starts minikube, not dependent on a
saved profile surviving.

## Secrets

Seventeen repository secrets are set, and the workflow references an eighteenth
that is deliberately left empty. They fall into three groups, and the difference
between the groups matters.

Build-time secrets are compiled into the JavaScript bundle and cannot be changed
without a rebuild: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL`,
and `NEXT_PUBLIC_CLERK_PROXY_URL`.

Runtime secrets become the `vaulty-secrets` Kubernetes Secret and are re-synced
on every deploy: the two database URLs, `CLERK_SECRET_KEY`, the AWS credentials,
`GEMINI_API_KEY`, the Resend keys, and the Inngest keys.

Connection secrets are used only by the workflow itself: `EC2_HOST`, `EC2_USER`,
and `EC2_SSH_PRIVATE_KEY`. That last one is a dedicated ed25519 keypair
generated on the instance, separate from any personal key.

`NEXT_PUBLIC_CLERK_PROXY_URL` is the one left unset. Clerk authenticates through
the `clerk.vaulty.site` CNAME instead, and setting both would break sign-in.

## Server configuration

This used to be undocumented live state on the instance — the gap this
section previously warned about. It's now codified in
`ansible/setup-vaulty-ec2.yml`, dry-run tested with `--check --diff` before
being applied for real, and verified against the live host afterward.

The playbook covers:

- the 2 GB swapfile, `/etc/fstab` entry, and `vm.swappiness=10`
- the `kubectl` binary and the `k` / `kn` shell aliases
- the nginx site at `/etc/nginx/sites-available/vaulty`, templated from
  `ansible/templates/nginx-vaulty.conf.j2`
- `minikube.service`, templated from `ansible/templates/minikube.service.j2`
- confirming the CI deploy keypair at `~/.ssh/github_deploy` exists (checked
  for presence, not rotated or regenerated)

The one that actually mattered: `minikube.service` previously ran bare
`minikube start`, which only preserved the memory cap and kubelet
reservations because a saved profile in `~/.minikube` happened to still
exist. The playbook bakes `--memory=1400mb` and all three `--extra-config`
kubelet flags directly into `ExecStart`, so the correct configuration
survives even if that profile is lost.

`ansible/inventory.yml` holds the real host IP and key path and is
gitignored. `ansible/inventory.yml.example` is committed in its place —
copy it locally and fill in real values.

Rebuild a lost instance's configuration with:

```bash
cd ansible
ansible-playbook -i inventory.yml setup-vaulty-ec2.yml --check --diff
ansible-playbook -i inventory.yml setup-vaulty-ec2.yml --diff
```

The playbook does not provision the EC2 instance itself, install Docker, or
run Certbot for the first time — it assumes a host with Docker already
present and a certificate already issued, and manages everything layered on
top of that.

## Operating it

Deploy by pushing to `Production`. Manual runs are available from the Actions
tab because the workflow also exists on `main`, which GitHub requires before
`workflow_dispatch` will appear.

On the box, `kubectl` is aliased to `k`, and `kn` is `kubectl -n vaulty`:

```bash
kn get pods                            # what's running
kn logs deploy/vaulty-web -f           # app logs
kn logs job/vaulty-migrate             # last migration run
kn rollout undo deployment/vaulty-web  # roll back one revision
kn describe pod <name>                 # why a pod won't start
```

To check the cluster's memory headroom:

```bash
docker stats minikube --no-stream
kubectl describe node minikube | grep -A5 Allocatable
```

## Known gaps

The Supabase project is in `ap-south-1` while the instance is in `us-east-1`,
about 210 ms apart. A page making several sequential queries spends most of
its time waiting on the network. Moving either side to match the other would
fix it.

`prisma.config.ts` reads `env("DIRECT_URL") || env("DATABASE_URL")`, but
Prisma's `env()` throws on a missing variable rather than returning
`undefined`, so the fallback is unreachable. The Dockerfile works around this
with a throwaway `DIRECT_URL` placeholder at build time. Switching that
config to `process.env.DIRECT_URL ?? process.env.DATABASE_URL` would let the
placeholder go away.

There is one replica and no HorizontalPodAutoscaler. Vertical headroom is
about 600 MB. Past that, the instance needs to grow.