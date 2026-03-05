import { nanoid } from "nanoid"
import { visitorsRepository } from "../repositories/visitors-repository"
import type { NewVisitor, Visitor } from "../schema"
import type { VisitorTrackingInput } from "../validation"

/**
 * Visitors Service
 * 
 * Handles anonymous visitor tracking for basic analytics
 * Helps understand which pages attract business inquiries
 */

export interface TrackVisitorParams {
  data: VisitorTrackingInput
  ipAddress?: string
  userAgent?: string
}

export interface TrackVisitorResult {
  success: boolean
  visitorRecordId?: string
  error?: string
}

export class VisitorsService {
  /**
   * Track a page visit
   * 
   * This is lightweight analytics - failures should not impact user experience
   */
  async trackVisit(params: TrackVisitorParams): Promise<TrackVisitorResult> {
    const { data, ipAddress, userAgent } = params

    const newVisitor: NewVisitor = {
      id: nanoid(),
      visitorId: data.visitorId,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      pagePath: data.pagePath,
      language: data.language || null,
      referrer: data.referrer || null,
    }

    try {
      const visitor = await visitorsRepository.create(newVisitor)
      return {
        success: true,
        visitorRecordId: visitor.id,
      }
    } catch (error) {
      console.error("Failed to track visitor:", error)
      // Don't throw - visitor tracking failure shouldn't break user experience
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Get all visitor records (for analytics)
   */
  async getAllVisitors(limit: number = 1000): Promise<Visitor[]> {
    return await visitorsRepository.getAll(limit)
  }

  /**
   * Get visit history for a specific visitor
   */
  async getVisitorHistory(visitorId: string): Promise<Visitor[]> {
    return await visitorsRepository.getByVisitorId(visitorId)
  }
}

// Singleton instance
export const visitorsService = new VisitorsService()
