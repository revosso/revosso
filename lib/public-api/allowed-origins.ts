/**
 * Allowed Origins – Revosso Ecosystem Public API
 *
 * This file is the single source of truth for all authorised domains that may
 * submit requests to the public lead-ingestion endpoint.
 *
 * SECURITY:
 *  - Never add wildcards or untrusted entries here.
 *  - Every new Revosso product domain must be explicitly listed.
 *  - Localhost entries are ONLY active in non-production environments.
 */

// ── Production allow-list ─────────────────────────────────────────────────────
// Each entry is either an exact origin or a wildcard-subdomain pattern stored
// as a suffix string (e.g. ".revosso.com" matches "app.revosso.com").

const PRODUCTION_ALLOWED_EXACT_ORIGINS: ReadonlySet<string> = new Set([
  "https://revosso.com",
  "https://revofin.com",
  "https://revomaket.com",
])

/**
 * Allowed base domains for subdomain matching.
 * A request origin of "https://app.revosso.com" is valid because it ends with
 * ".revosso.com".
 */
const PRODUCTION_ALLOWED_SUBDOMAIN_SUFFIXES: readonly string[] = [
  ".revosso.com",
  ".revofin.com",
  ".revomaket.com",
]

// ── Development allow-list ────────────────────────────────────────────────────
// ONLY active when NODE_ENV !== "production".
const DEVELOPMENT_ALLOWED_ORIGINS: ReadonlySet<string> = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
])

// ── Public validation helper ──────────────────────────────────────────────────

/**
 * Determine whether the supplied `origin` string belongs to an authorised
 * Revosso ecosystem domain.
 *
 * Rules (in order):
 *  1. Exact match against production allow-list.
 *  2. Subdomain match against production suffix list (HTTPS only).
 *  3. In non-production environments: exact match against the dev allow-list.
 */
export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return false

  // Exact production match
  if (PRODUCTION_ALLOWED_EXACT_ORIGINS.has(origin)) return true

  // Subdomain production match (must be HTTPS)
  if (origin.startsWith("https://")) {
    const withoutScheme = origin.slice("https://".length)
    for (const suffix of PRODUCTION_ALLOWED_SUBDOMAIN_SUFFIXES) {
      if (withoutScheme.endsWith(suffix)) return true
    }
  }

  // Dev environments only
  if (process.env.NODE_ENV !== "production") {
    if (DEVELOPMENT_ALLOWED_ORIGINS.has(origin)) return true
  }

  return false
}

/**
 * Return the best CORS `Access-Control-Allow-Origin` value for a given request
 * origin, or `null` when the origin is not authorised.
 *
 * SECURITY: Never return "*".
 */
export function resolveAllowedOrigin(origin: string | null | undefined): string | null {
  if (isAllowedOrigin(origin)) return origin as string
  return null
}

