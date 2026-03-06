import { nanoid } from "nanoid"
import { leadsRepository } from "../repositories/leads-repository"
import { sendInternalNotification, sendConfirmationEmail } from "../mail"
import type { NewLead, Lead } from "../schema"
import type { LeadSubmissionInput } from "../validation"

/**
 * Leads Service
 * 
 * Coordinates lead creation workflow:
 * 1. Create lead in database (MUST succeed first)
 * 2. Attempt to send notification email
 * 3. Attempt to send confirmation email
 * 4. Update email status
 * 
 * Critical: Leads must NEVER be lost, even if emails fail
 */

export interface CreateLeadParams {
  data: LeadSubmissionInput
  ipAddress?: string
  userAgent?: string
}

export interface CreateLeadResult {
  success: boolean
  leadId: string
  emailSent: boolean
  confirmationSent: boolean
  error?: string
}

export class LeadsService {
  /**
   * Create a new lead
   * 
   * This method follows the critical reliability rule:
   * 1. Store lead in database FIRST
   * 2. Then attempt emails
   * 3. Never fail if emails fail
   */
  async createLead(params: CreateLeadParams): Promise<CreateLeadResult> {
    const { data, ipAddress, userAgent } = params
    const leadId = nanoid()

    // Prepare lead data
    const newLead: NewLead = {
      id: leadId,
      name: data.name,
      email: data.email,
      company: data.company || null,
      message: data.message,
      leadType: data.leadType || null,
      productInterest: data.productInterest || null,
      sourcePage: data.sourcePage || null,
      businessStage: data.businessStage || null,
      emailStatus: "pending",
      leadStatus: "new",
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      userLanguage: data.userLanguage || null,
    }

    try {
      // CRITICAL: Insert lead into database FIRST
      // This must succeed before any email attempts
      const lead = await leadsRepository.create(newLead)
      console.log(`Lead ${leadId} stored successfully`)

      let emailSent = false
      let confirmationSent = false

      // Attempt to send internal notification
      try {
        await sendInternalNotification(lead)
        console.log(`Internal notification sent for lead ${leadId}`)
        emailSent = true
      } catch (error) {
        console.error(`Failed to send internal notification for lead ${leadId}:`, error)
        // Continue - don't fail the request
      }

      // Attempt to send confirmation email
      try {
        await sendConfirmationEmail(lead)
        console.log(`Confirmation email sent for lead ${leadId}`)
        confirmationSent = true
      } catch (error) {
        console.error(`Failed to send confirmation email for lead ${leadId}:`, error)
        // Continue - don't fail the request
      }

      // Update email status based on results
      const finalEmailStatus = emailSent ? "sent" : "failed"
      await leadsRepository.updateEmailStatus(leadId, finalEmailStatus)

      return {
        success: true,
        leadId,
        emailSent,
        confirmationSent,
      }
    } catch (error) {
      console.error("Failed to create lead:", error)
      return {
        success: false,
        leadId,
        emailSent: false,
        confirmationSent: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Get all leads (for admin)
   */
  async getAllLeads(): Promise<Lead[]> {
    return await leadsRepository.getAll()
  }

  /**
   * Get a single lead by ID
   */
  async getLeadById(id: string): Promise<Lead | undefined> {
    return await leadsRepository.getById(id)
  }

  /**
   * Update lead status (for internal management)
   */
  async updateLeadStatus(
    id: string,
    status: "new" | "contacted" | "qualified" | "closed" | "converted"
  ): Promise<void> {
    await leadsRepository.updateLeadStatus(id, status)
  }

  /**
   * Get leads by status
   */
  async getLeadsByStatus(status: string): Promise<Lead[]> {
    return await leadsRepository.getByStatus(status)
  }

  /**
   * Get leads by product interest
   */
  async getLeadsByProduct(productInterest: string): Promise<Lead[]> {
    return await leadsRepository.getByProductInterest(productInterest)
  }

  /**
   * Delete a lead permanently
   */
  async deleteLead(id: string): Promise<void> {
    await leadsRepository.delete(id)
  }

  /**
   * Update internal notes for a lead (follow-up tracking)
   */
  async updateLeadNotes(id: string, notes: string | null): Promise<void> {
    await leadsRepository.updateNotes(id, notes)
  }
}

// Singleton instance
export const leadsService = new LeadsService()
