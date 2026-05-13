import { db } from "../db"
import { leads, type NewLead, type Lead } from "../schema"
import { desc, eq } from "drizzle-orm"


/**
 * Leads Repository
 * 
 * This is the ONLY layer allowed to interact with the leads database table.
 * All database queries for leads must be defined here.
 */

export class LeadsRepository {
  /**
   * Insert a new lead into the database
   * Critical: This must succeed before any email attempts
   */
  async create(lead: NewLead): Promise<Lead> {
    try {
      const [inserted] = await db.insert(leads).values(lead).returning()
      return inserted
    } catch (error) {
      console.error("Database error inserting lead:", error)
      throw new Error("Failed to store lead in database")
    }
  }

  /**
   * Update email status for a lead
   * Called after email sending attempts
   */
  async updateEmailStatus(id: string, status: "sent" | "failed"): Promise<void> {
    try {
      await db
        .update(leads)
        .set({ emailStatus: status })
        .where(eq(leads.id, id))
    } catch (error) {
      console.error("Database error updating email status:", error)
      // Don't throw - email status update failure shouldn't break the flow
    }
  }

  /**
   * Update lead status (for internal management)
   */
  async updateLeadStatus(
    id: string,
    status: "new" | "contacted" | "qualified" | "closed" | "converted"
  ): Promise<void> {
    try {
      await db
        .update(leads)
        .set({ leadStatus: status })
        .where(eq(leads.id, id))
    } catch (error) {
      console.error("Database error updating lead status:", error)
      throw new Error("Failed to update lead status")
    }
  }

  /**
   * Get all leads, ordered by newest first
   * Used by admin interface
   */
  async getAll(): Promise<Lead[]> {
    try {
      return await db
        .select()
        .from(leads)
        .orderBy(desc(leads.createdAt))
    } catch (error) {
      console.error("Database error fetching leads:", error)
      throw new Error("Failed to fetch leads")
    }
  }

  /**
   * Get a single lead by ID
   */
  async getById(id: string): Promise<Lead | undefined> {
    try {
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1)
      return lead
    } catch (error) {
      console.error("Database error fetching lead:", error)
      throw new Error("Failed to fetch lead")
    }
  }

  /**
   * Get leads by status (for filtering)
   */
  async getByStatus(status: string): Promise<Lead[]> {
    try {
      return await db
        .select()
        .from(leads)
        .where(eq(leads.leadStatus, status))
        .orderBy(desc(leads.createdAt))
    } catch (error) {
      console.error("Database error fetching leads by status:", error)
      throw new Error("Failed to fetch leads by status")
    }
  }

  /**
   * Get leads by product interest (for filtering)
   */
  async getByProductInterest(productInterest: string): Promise<Lead[]> {
    try {
      return await db
        .select()
        .from(leads)
        .where(eq(leads.productInterest, productInterest))
        .orderBy(desc(leads.createdAt))
    } catch (error) {
      console.error("Database error fetching leads by product:", error)
      throw new Error("Failed to fetch leads by product")
    }
  }

  /**
   * Delete a lead by ID
   */
  async delete(id: string): Promise<void> {
    try {
      await db.delete(leads).where(eq(leads.id, id))
    } catch (error) {
      console.error("Database error deleting lead:", error)
      throw new Error("Failed to delete lead")
    }
  }

  /**
   * Update internal notes for a lead
   */
  async updateNotes(id: string, notes: string | null): Promise<void> {
    try {
      await db.update(leads).set({ notes }).where(eq(leads.id, id))
    } catch (error) {
      console.error("Database error updating lead notes:", error)
      throw new Error("Failed to update lead notes")
    }
  }

  /**
   * Check whether a lead with the given email already exists within the
   * duplicate-detection window (default: 24 hours).
   *
   * Used by the public ingestion endpoint to prevent trivial spam.
   */
  async existsByEmailSince(email: string, sinceMs: number): Promise<boolean> {
    try {
      const sinceDate = new Date(Date.now() - sinceMs)
      const [row] = await db
        .select({ id: leads.id })
        .from(leads)
        .where(and(eq(leads.email, email), gt(leads.createdAt, sinceDate)))
        .limit(1)
      return Boolean(row)
    } catch (error) {
      console.error("Database error checking duplicate email:", error)
      // Fail open: don't block the request if the check itself errors
      return false
    }
  }
}

// Singleton instance
export const leadsRepository = new LeadsRepository()
