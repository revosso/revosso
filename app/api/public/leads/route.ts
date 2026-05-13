/**
 * Public Lead Ingestion Endpoint
 * POST /api/public/leads
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * Security controls (outermost → innermost):
 *
 *  1. CORS / Origin validation   – only Revosso ecosystem domains are allowed
 *  2. Rate limiting              – 5 requests / 15 min per IP
 *  3. Payload size guard         – reject bodies > 8 KB before JSON parsing
 *  4. Schema validation          – strict Zod schema with sanitising transforms
 *  5. Honeypot                   – silent pass for bots filling hidden fields
 *  6. Duplicate email detection  – 24-hour dedup window
 *  7. Optional Turnstile verify  – server-side token check when configured
 *
 * Architecture: Route Handler → Service → Repository → DB
 * Business logic lives exclusively in the service layer.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server"
import { isAllowedOrigin } from "@/lib/public-api/allowed-origins"
import { buildCorsHeaders, buildPreflightHeaders } from "@/lib/public-api/cors-headers"
import { checkPublicLeadRateLimit } from "@/lib/public-api/public-rate-limiter"
import { publicLeadSchema, type PublicLeadResponse } from "@/lib/public-api/public-leads-validation"
import { publicLeadsService } from "@/lib/services/public-leads-service"

// ── Constants ─────────────────────────────────────────────────────────────────

/** Maximum accepted request body size in bytes (8 KB). */
const MAX_BODY_BYTES = 8 * 1_024

// ── Helpers ───────────────────────────────────────────────────────────────────

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  )
}

/**
 * Derive the effective request origin.
 *
 * Priority: Origin header → Referer header (scheme + host only) → null.
 * Never trust a synthesised value – only strip to origin.
 */
function resolveRequestOrigin(request: NextRequest): string | null {
  const origin = request.headers.get("origin")
  if (origin) return origin

  // Some browsers omit Origin on same-origin Referer navigations; parse Referer
  const referer = request.headers.get("referer")
  if (referer) {
    try {
      const url = new URL(referer)
      return url.origin // e.g. "https://revofin.com"
    } catch {
      // Malformed Referer – ignore
    }
  }

  return null
}

function errorResponse(
  message: string,
  status: number,
  corsHeaders: Record<string, string>
): NextResponse<PublicLeadResponse> {
  return NextResponse.json<PublicLeadResponse>({ success: false, message }, { status, headers: corsHeaders })
}

// ── OPTIONS – preflight handler ───────────────────────────────────────────────

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const origin = resolveRequestOrigin(request)
  const headers = buildPreflightHeaders({ origin })

  if (!isAllowedOrigin(origin)) {
    // Return 204 without ACAO header so the browser blocks the preflight
    return new NextResponse(null, { status: 204, headers })
  }

  return new NextResponse(null, { status: 204, headers })
}

// ── POST – lead ingestion ─────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse<PublicLeadResponse>> {
  const origin = resolveRequestOrigin(request)
  const corsHeaders = buildCorsHeaders({ origin })
  const ip = getClientIp(request)

  // ── 1. Origin guard ───────────────────────────────────────────────────────
  if (!isAllowedOrigin(origin)) {
    console.warn(
      `[PublicLeads] Blocked unauthorized origin="${origin ?? "missing"}" ip=${ip}`
    )
    return errorResponse("Unauthorized origin", 403, corsHeaders)
  }

  // ── 2. Rate limiting ──────────────────────────────────────────────────────
  const rateLimit = checkPublicLeadRateLimit(ip)
  if (!rateLimit.allowed) {
    console.warn(`[PublicLeads] Rate limit exceeded – ip=${ip} origin=${origin}`)
    return NextResponse.json<PublicLeadResponse>(
      { success: false, message: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1_000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    )
  }

  // ── 3. Payload size guard ─────────────────────────────────────────────────
  const contentLength = request.headers.get("content-length")
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    console.warn(`[PublicLeads] Payload too large – ip=${ip} size=${contentLength}`)
    return errorResponse("Payload too large", 413, corsHeaders)
  }

  // ── 4. Parse body ─────────────────────────────────────────────────────────
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return errorResponse("Invalid JSON body", 400, corsHeaders)
  }

  // ── 5. Honeypot ───────────────────────────────────────────────────────────
  // Bots that fill every field will hit a hidden `hp` property.
  // Return a silent 200 so they cannot fingerprint the guard.
  if (
    rawBody !== null &&
    typeof rawBody === "object" &&
    "hp" in rawBody &&
    typeof (rawBody as Record<string, unknown>).hp === "string" &&
    ((rawBody as Record<string, unknown>).hp as string).length > 0
  ) {
    console.log(`[PublicLeads] Honeypot triggered – ip=${ip}`)
    return NextResponse.json<PublicLeadResponse>({ success: true }, { status: 200, headers: corsHeaders })
  }

  // ── 6. Schema validation ──────────────────────────────────────────────────
  const parsed = publicLeadSchema.safeParse(rawBody)
  if (!parsed.success) {
    console.warn(
      `[PublicLeads] Validation failed – ip=${ip} errors=${JSON.stringify(parsed.error.flatten().fieldErrors)}`
    )
    return errorResponse("Validation failed", 400, corsHeaders)
  }

  const data = parsed.data

  // ── 7. Service layer ──────────────────────────────────────────────────────
  const userAgent = request.headers.get("user-agent") ?? undefined
  const result = await publicLeadsService.createPublicLead({ data, ipAddress: ip, userAgent })

  if (!result.success) {
    switch (result.rejectionReason) {
      case "DUPLICATE_EMAIL":
        // Return a generic success to prevent email enumeration
        return NextResponse.json<PublicLeadResponse>(
          { success: true },
          { status: 200, headers: corsHeaders }
        )

      case "TURNSTILE_FAILED":
        return errorResponse("Bot protection check failed", 403, corsHeaders)

      case "DATABASE_ERROR":
      default:
        return errorResponse("Unable to process your request", 500, corsHeaders)
    }
  }

  return NextResponse.json<PublicLeadResponse>(
    { success: true },
    { status: 200, headers: corsHeaders }
  )
}

