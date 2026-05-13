/**
 * CORS Headers – Revosso Public API
 *
 * Centralises all CORS header construction so every public route handler uses
 * identical, auditable header logic.
 *
 * SECURITY:
 *  - Access-Control-Allow-Origin is NEVER "*".
 *  - Only explicit, allow-listed origins are reflected.
 *  - Credentials are not exposed to cross-origin callers.
 */

import { resolveAllowedOrigin } from "./allowed-origins"

/** Methods accepted on the public ingestion endpoint. */
const ALLOWED_METHODS = "POST, OPTIONS"

/** Headers the client is allowed to send. */
const ALLOWED_HEADERS = "Content-Type, Accept"

/** How long (seconds) the browser may cache the preflight response. */
const PREFLIGHT_MAX_AGE = "600" // 10 minutes

export interface CorsOptions {
  /** The `Origin` header value from the incoming request. */
  origin: string | null | undefined
}

/**
 * Build the CORS headers object for a given request origin.
 *
 * When the origin is authorised the reflected `Access-Control-Allow-Origin`
 * header is included; otherwise it is omitted so the browser rejects the
 * response automatically.
 */
export function buildCorsHeaders(options: CorsOptions): Record<string, string> {
  const { origin } = options
  const allowedOrigin = resolveAllowedOrigin(origin)

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Max-Age": PREFLIGHT_MAX_AGE,
    // Explicitly disallow credentials to prevent cookie/session abuse
    "Access-Control-Allow-Credentials": "false",
    // Prevent caching of responses with varying origin
    Vary: "Origin",
  }

  if (allowedOrigin) {
    headers["Access-Control-Allow-Origin"] = allowedOrigin
  }

  return headers
}

/**
 * Build the subset of CORS headers required for a preflight (OPTIONS) response.
 */
export function buildPreflightHeaders(options: CorsOptions): Record<string, string> {
  return buildCorsHeaders(options)
}

