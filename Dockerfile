# -----------------------------------------------------------------------------
# Stage 1: Install dependencies
# -----------------------------------------------------------------------------
FROM node:20-slim AS deps
WORKDIR /app

# Install dependencies based on the lockfile
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# -----------------------------------------------------------------------------
# Stage 2: Build the Next.js application
# -----------------------------------------------------------------------------
FROM node:20-slim AS builder
WORKDIR /app

# Copy cached dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Limit Node memory to avoid OOM on low-resource EC2 instances (1GB RAM)
ENV NODE_OPTIONS="--max-old-space-size=768"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Provide a safe build-time placeholder for Prisma schema validation
# Real secrets MUST NOT be baked into the image and are passed at runtime
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

# Optional public key for client-side static compilation
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Generate Prisma Client and build Next.js standalone bundle
RUN npx prisma generate
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Minimal production runner
# -----------------------------------------------------------------------------
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root system user for container security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs nextjs

# Copy standalone server and static assets with non-root ownership
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Run as non-root user
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]