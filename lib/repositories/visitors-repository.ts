import { db } from "../db"
import { visitors, type NewVisitor, type Visitor } from "../schema"
import { desc, eq } from "drizzle-orm"

/**
 * Visitors Repository
 * 
 * This is the ONLY layer allowed to interact with the visitors database table.
 * All database queries for visitor tracking must be defined here.
 */

export class VisitorsRepository {
  /**
   * Record a page visit
   * Lightweight analytics for understanding traffic patterns
   */
  async create(visitor: NewVisitor): Promise<Visitor> {
    try {
      const [inserted] = await db.insert(visitors).values(visitor).returning()
      return inserted
    } catch (error) {
      console.error("Database error inserting visitor:", error)
      // Don't throw - visitor tracking failure shouldn't break user experience
      throw new Error("Failed to record visitor")
    }
  }

  /**
   * Get all visitor events
   */
  async getAll(limit: number = 1000): Promise<Visitor[]> {
    try {
      return await db
        .select()
        .from(visitors)
        .orderBy(desc(visitors.createdAt))
        .limit(limit)
    } catch (error) {
      console.error("Database error fetching visitors:", error)
      throw new Error("Failed to fetch visitors")
    }
  }

  /**
   * Get visits by a specific visitor ID
   * Helps identify repeat visitors
   */
  async getByVisitorId(visitorId: string): Promise<Visitor[]> {
    try {
      return await db
        .select()
        .from(visitors)
        .where(eq(visitors.visitorId, visitorId))
        .orderBy(desc(visitors.createdAt))
    } catch (error) {
      console.error("Database error fetching visitor history:", error)
      throw new Error("Failed to fetch visitor history")
    }
  }
}

// Singleton instance
export const visitorsRepository = new VisitorsRepository()
