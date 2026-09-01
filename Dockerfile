# -----------------------------------------------------------------------------
# Stage 1: Build the Next.js application
# -----------------------------------------------------------------------------
FROM node:20-slim AS builder

WORKDIR /app

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

# Clerk public key is required during Next.js build
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

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

# Create non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs nextjs

# Copy only production files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]