/**
 * Public API Rate Limiter
 *
 * A stricter, purpose-built rate limiter for the unauthenticated public lead
 * ingestion endpoint.  It is intentionally kept separate from the internal
 * `lib/rateLimit.ts` so each can evolve independently.
 *
 * Defaults (configurable via environment variables):
 *  - MAX_REQUESTS_PER_WINDOW: 5 submissions per IP per window
 *  - WINDOW_MS: 15 minutes
 *
 * In the future this can be replaced with a Redis-backed implementation for
 * multi-instance deployments without changing the call-sites.
 */

const DEFAULT_MAX_REQUESTS = 5
const DEFAULT_WINDOW_MS = 15 * 60 * 1_000 // 15 minutes

// Lazy-read from environment so tests can override without module reloads
function getMaxRequests(): number {
  const env = process.env.PUBLIC_LEADS_RATE_LIMIT_MAX
  return env ? parseInt(env, 10) : DEFAULT_MAX_REQUESTS
}

function getWindowMs(): number {
  const env = process.env.PUBLIC_LEADS_RATE_LIMIT_WINDOW_MS
  return env ? parseInt(env, 10) : DEFAULT_WINDOW_MS
}

interface RateLimitRecord {
  count: number
  resetAt: number
}

// In-memory store. For serverless/edge deploys, replace with an external store.
const store = new Map<string, RateLimitRecord>()

export interface RateLimitResult {
  allowed: boolean
  /** Remaining allowed requests in the current window. */
  remaining: number
  /** Unix timestamp (ms) when the window resets. */
  resetAt: number
}

/**
 * Evaluate whether the given IP address may proceed.
 *
 * Side-effect: increments the counter for `ip` when allowed.
 */
export function checkPublicLeadRateLimit(ip: string): RateLimitResult {
  const now = Date.now()
  const maxRequests = getMaxRequests()
  const windowMs = getWindowMs()
  const existing = store.get(ip)

  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowMs
    store.set(ip, { count: 1, resetAt })
    return { allowed: true, remaining: maxRequests - 1, resetAt }
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count++
  return {
    allowed: true,
    remaining: maxRequests - existing.count,
    resetAt: existing.resetAt,
  }
}

// Periodic eviction of expired entries to prevent unbounded memory growth.
// The interval is tied to the window so expired entries are cleaned promptly.
setInterval(
  () => {
    const now = Date.now()
    for (const [ip, record] of store.entries()) {
      if (now > record.resetAt) store.delete(ip)
    }
  },
  getWindowMs()
)

