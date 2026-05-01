# syntax=docker/dockerfile:1
#
# Default build target is `runner` (production).
# Development: docker build --target development -t revosso:dev .
#
# Lockfile: this repo uses pnpm. `pnpm install --frozen-lockfile` is the
# pnpm equivalent of `npm ci` (reproducible installs from the lockfile).

# --- Development (hot reload via bind mount in docker-compose.dev.yml) ---
FROM node:20-alpine AS development
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["pnpm", "dev", "--hostname", "0.0.0.0", "--port", "3000"]

# --- Install all dependencies (incl. dev) for next build ---
FROM node:20-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- Build Next.js app ---
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm build

# --- Production dependencies only ---
FROM node:20-alpine AS prod-deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# --- Production runtime ---
FROM node:20-alpine AS runner

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/',(r)=>process.exit(r.statusCode!==undefined&&r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

# Matches package.json "start": migrate then next start (Turso env required unless SKIP_DB_MIGRATE_ON_START=1)
CMD ["sh", "-c", "node scripts/db-migrate.mjs && exec ./node_modules/.bin/next start"]
