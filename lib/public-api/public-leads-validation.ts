/**
 * Public Lead Ingestion – Validation Schema & DTOs
 *
 * Defines the strict input contract for POST /api/public/leads.
 * All validation is performed server-side; client-side checks are advisory only.
 */

import { z } from "zod"

// ── Allowed products ──────────────────────────────────────────────────────────
// Extend this enum as new Revosso ecosystem products are launched.
export const ALLOWED_PRODUCTS = [
  "REVOSSO",
  "REVOFIN",
  "REVOMAKET",
] as const

export type AllowedProduct = (typeof ALLOWED_PRODUCTS)[number]

// ── Allowed interest tags ─────────────────────────────────────────────────────
// Kept deliberately open (max-length check only) to avoid blocking future tags
// before the allow-list is updated.  A stricter enum can be introduced later.
const MAX_INTERESTS = 20
const MAX_INTEREST_LENGTH = 100

// ── Zod schema ────────────────────────────────────────────────────────────────

export const publicLeadSchema = z.object({
  /** Which Revosso product is collecting this lead. */
  product: z.enum(ALLOWED_PRODUCTS, {
    errorMap: () => ({
      message: `product must be one of: ${ALLOWED_PRODUCTS.join(", ")}`,
    }),
  }),

  /**
   * The domain/page that submitted the lead (e.g. "revofin.com").
   * Stored for attribution; the real origin guard is done via the Origin header.
   */
  source: z
    .string()
    .min(1, "source is required")
    .max(253, "source is too long")
    .regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9\-\.]{0,251}[a-zA-Z0-9])?$/,
      "source must be a valid domain"
    ),

  /** Full name of the person submitting the lead. */
  name: z
    .string()
    .min(2, "name must be at least 2 characters")
    .max(120, "name is too long")
    .transform((v) => v.trim()),

  /** Email address. */
  email: z
    .string()
    .email("invalid email address")
    .max(320, "email is too long")
    .transform((v) => v.trim().toLowerCase()),

  /** Type of business (e.g. "Restaurant", "Retail"). */
  businessType: z
    .string()
    .min(1, "businessType is required")
    .max(120, "businessType is too long")
    .transform((v) => v.trim()),

  /** Areas of interest selected by the lead. */
  interests: z
    .array(
      z.string().min(1).max(MAX_INTEREST_LENGTH).transform((v) => v.trim())
    )
    .min(1, "at least one interest is required")
    .max(MAX_INTERESTS, `no more than ${MAX_INTERESTS} interests allowed`),

  // ── Optional Turnstile token ─────────────────────────────────────────────
  // When NEXT_PUBLIC_TURNSTILE_SITE_KEY is configured on the client, the token
  // is sent here and verified server-side.  Field is ignored when not present.
  turnstileToken: z.string().max(2048).optional(),
})

export type PublicLeadInput = z.infer<typeof publicLeadSchema>

// ── Response DTOs ─────────────────────────────────────────────────────────────

export interface PublicLeadSuccessResponse {
  success: true
}

export interface PublicLeadErrorResponse {
  success: false
  message: string
}

export type PublicLeadResponse = PublicLeadSuccessResponse | PublicLeadErrorResponse

