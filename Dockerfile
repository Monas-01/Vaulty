
# -----------------------------------------------------------------------------
# Stage 1: Build the Next.js application
# -----------------------------------------------------------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy application source
COPY . .

# Limit Node memory to avoid OOM on low-resource EC2 instances
ENV NODE_OPTIONS="--max-old-space-size=768"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Safe build-time placeholder for Prisma schema validation
# Real secrets are passed at runtime
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

# prisma.config.ts reads DIRECT_URL first. Prisma's env() helper throws on a
# missing variable rather than returning undefined, so the `|| DATABASE_URL`
# fallback in that file never runs -- both must exist at build time.
ENV DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

# Clerk public key is required during Next.js build
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

ARG NEXT_PUBLIC_CLERK_PROXY_URL
ENV NEXT_PUBLIC_CLERK_PROXY_URL=$NEXT_PUBLIC_CLERK_PROXY_URL

# Next inlines every NEXT_PUBLIC_* at build time -- in server bundles too, not
# just client. Setting this at runtime has no effect, so it must be baked here
# or src/lib/inngest/functions.ts silently falls back to its hardcoded default.
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Generate Prisma Client and build Next.js standalone bundle
RUN npx prisma generate
RUN npm run build


# -----------------------------------------------------------------------------
# Stage 2: Minimal production runner
# -----------------------------------------------------------------------------
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Prisma's query engine links against OpenSSL at runtime, not just at generate
# time. Without this the standalone server can fail to start on a slim base.
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs nextjs

# Migration toolchain, deliberately isolated in its own directory with its own
# node_modules. Installing Prisma into /app would make npm reconcile the tree
# against the standalone package.json and prune the traced bundle.
# The same image therefore serves both the web Deployment and the migrate Job.
WORKDIR /migrate
RUN npm install --no-save --no-fund --no-audit prisma@7.9.1 dotenv@16.4.7 && \
    npm cache clean --force
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
RUN chown -R nextjs:nodejs /migrate

WORKDIR /app

# Copy only production files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Next's dependency tracing does not reliably pull the generated Prisma client
# into the standalone output. Copying it explicitly is cheap insurance.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
