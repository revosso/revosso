import { NextRequest, NextResponse } from "next/server"
import { visitorTrackingSchema } from "@/lib/validation"
import { visitorsService } from "@/lib/services/visitors-service"

/**
 * Visitor Tracking API Endpoint
 * 
 * Lightweight anonymous analytics to understand traffic patterns
 * 
 * Architecture: API Layer -> Service Layer -> Repository Layer -> Database
 */

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  return forwarded?.split(",")[0] || "unknown"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = visitorTrackingSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Capture request metadata
    const ip = getClientIP(request)
    const userAgent = request.headers.get("user-agent") || undefined

    // Track visit through service layer
    const result = await visitorsService.trackVisit({
      data,
      ipAddress: ip,
      userAgent,
    })

    if (!result.success) {
      // Log but don't fail user experience
      console.error("Failed to track visitor:", result.error)
    }

    // Always return success
    // Visitor tracking failure should not impact user experience
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error in visitor tracking:", error)
    // Return success anyway - don't break user experience
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
