/**
 * Public Leads Service
 *
 * Orchestrates the secure ingestion of leads submitted through the Revosso
 * ecosystem public API (POST /api/public/leads).
 *
 * Responsibilities:
 *  1. Duplicate-email guard (per configurable window)
 *  2. Optional Cloudflare Turnstile token verification
 *  3. Persist the lead (must succeed before any side-effects)
 *  4. Fire-and-forget internal notification email
 *
 * Critical: leads must NEVER be lost, even when emails fail.
 */

import { nanoid } from "nanoid"
import { leadsRepository } from "../repositories/leads-repository"
import { sendInternalNotification } from "../mail"
import type { NewLead } from "../schema"
import type { PublicLeadInput } from "../public-api/public-leads-validation"

// ── Configuration constants ───────────────────────────────────────────────────

/** Window in which a duplicate email submission is rejected (24 h). */
const DUPLICATE_EMAIL_WINDOW_MS = 24 * 60 * 60 * 1_000

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface CreatePublicLeadParams {
  data: PublicLeadInput
  ipAddress: string
  userAgent?: string
}

export interface CreatePublicLeadResult {
  success: boolean
  /** Populated on success. */
  leadId?: string
  /** Machine-readable rejection reason (not exposed to caller verbatim). */
  rejectionReason?: "DUPLICATE_EMAIL" | "TURNSTILE_FAILED" | "DATABASE_ERROR"
}

// ── Turnstile verification ────────────────────────────────────────────────────

async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    // Turnstile not configured – treat as passed
    return true
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
          remoteip: ip,
        }),
      }
    )
    const json = (await response.json()) as { success: boolean }
    return json.success === true
  } catch (error) {
    console.error("[PublicLeadsService] Turnstile verification failed:", error)
    // Fail open when Cloudflare is unreachable to avoid blocking legitimate traffic.
    // Tighten this to `return false` if you prefer fail-closed behaviour.
    return true
  }
}

// ── Service class ─────────────────────────────────────────────────────────────

export class PublicLeadsService {
  /**
   * Ingest a single lead from the public ecosystem API.
   */
  async createPublicLead(params: CreatePublicLeadParams): Promise<CreatePublicLeadResult> {
    const { data, ipAddress, userAgent } = params

    // ── 1. Turnstile verification (when token is present) ─────────────────
    if (data.turnstileToken) {
      const valid = await verifyTurnstileToken(data.turnstileToken, ipAddress)
      if (!valid) {
        console.warn(
          `[PublicLeadsService] Turnstile failed – ip=${ipAddress} email=${data.email}`
        )
        return { success: false, rejectionReason: "TURNSTILE_FAILED" }
      }
    }

    // ── 2. Duplicate email guard ──────────────────────────────────────────
    const isDuplicate = await leadsRepository.existsByEmailSince(
      data.email,
      DUPLICATE_EMAIL_WINDOW_MS
    )
    if (isDuplicate) {
      console.warn(
        `[PublicLeadsService] Duplicate submission – email=${data.email} ip=${ipAddress}`
      )
      return { success: false, rejectionReason: "DUPLICATE_EMAIL" }
    }

    // ── 3. Persist lead ───────────────────────────────────────────────────
    const leadId = nanoid()

    const newLead: NewLead = {
      id: leadId,
      name: data.name,
      email: data.email,
      company: null,
      message: null, // Public-API leads have no free-text message
      // Legacy intent fields mapped from product/source for backward compat
      leadType: "ecosystem_lead",
      productInterest: data.product.toLowerCase(),
      sourcePage: data.source,
      businessStage: null,
      // New ecosystem-specific fields
      product: data.product,
      source: data.source,
      businessType: data.businessType,
      interests: JSON.stringify(data.interests),
      // System
      emailStatus: "pending",
      leadStatus: "new",
      ipAddress,
      userAgent: userAgent ?? null,
      userLanguage: null,
      country: null,
      tags: null,
      metadata: null,
    }

    let lead
    try {
      lead = await leadsRepository.create(newLead)
      console.log(`[PublicLeadsService] Lead ${leadId} persisted – product=${data.product}`)
    } catch (error) {
      console.error(`[PublicLeadsService] Failed to persist lead:`, error)
      return { success: false, rejectionReason: "DATABASE_ERROR" }
    }

    // ── 4. Fire-and-forget internal notification ──────────────────────────
    // A failed email must NEVER roll back a successfully stored lead.
    sendInternalNotification(lead)
      .then(() => {
        void leadsRepository.updateEmailStatus(leadId, "sent")
        console.log(`[PublicLeadsService] Notification sent for lead ${leadId}`)
      })
      .catch((err) => {
        void leadsRepository.updateEmailStatus(leadId, "failed")
        console.error(`[PublicLeadsService] Notification failed for lead ${leadId}:`, err)
      })

    return { success: true, leadId }
  }
}

// Singleton instance
export const publicLeadsService = new PublicLeadsService()


