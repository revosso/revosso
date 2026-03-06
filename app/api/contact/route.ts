import { NextRequest, NextResponse } from "next/server"
import { leadSubmissionSchema } from "@/lib/validation"
import { checkRateLimit } from "@/lib/rateLimit"
import { leadsService } from "@/lib/services/leads-service"

/**
 * Lead Capture API Endpoint
 * 
 * Architecture: API Layer -> Service Layer -> Repository Layer -> Database
 * 
 * This endpoint MUST NOT contain database queries.
 * All database access goes through the service layer.
 */

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  return forwarded?.split(",")[0] || realIP || "unknown"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check honeypot BEFORE validation so bots always see a silent 200
    if (body.honeypot && typeof body.honeypot === "string" && body.honeypot.length > 0) {
      console.log("Honeypot triggered - potential spam")
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Validate input
    const validationResult = leadSubmissionSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Rate limiting
    const ip = getClientIP(request)
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // Capture request metadata
    const userAgent = request.headers.get("user-agent") || undefined

    // Call service layer to create lead
    // Service handles: database insert, emails, status updates
    const result = await leadsService.createLead({
      data,
      ipAddress: ip,
      userAgent,
    })

    if (!result.success) {
      console.error(`Failed to create lead: ${result.error}`)
      return NextResponse.json(
        { error: "Failed to process your request" },
        { status: 500 }
      )
    }

    console.log(`Lead ${result.leadId} created successfully`)

    // Return success even if emails failed
    // The lead is safely stored in the database
    return NextResponse.json(
      { 
        success: true,
        leadId: result.leadId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing lead submission:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

