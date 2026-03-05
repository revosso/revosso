import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { leads } from "@/lib/schema"
import { contactSchema } from "@/lib/validation"
import { checkRateLimit } from "@/lib/rateLimit"
import { sendInternalNotification, sendConfirmationEmail } from "@/lib/mail"
import { nanoid } from "nanoid"

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  return forwarded?.split(",")[0] || realIP || "unknown"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = contactSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation échouée", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check honeypot
    if (data.honeypot && data.honeypot.length > 0) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Rate limiting
    const ip = getClientIP(request)
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez réessayer plus tard." },
        { status: 429 }
      )
    }

    // Insert into database
    const leadId = nanoid()
    const referrer = request.headers.get("referer") || "direct"
    const environment = process.env.NODE_ENV || "production"
    
    const lead = {
      id: leadId,
      name: data.name,
      email: data.email,
      company: data.company || null,
      message: data.message,
      productInterest: data.productInterest || null,
      source: `${data.source || "homepage"}|${environment}|${referrer}`,
      status: "NEW",
      createdAt: new Date(),
    }

    await db.insert(leads).values(lead)

    // Send emails (don't fail if email fails)
    try {
      await sendInternalNotification({ ...data, id: leadId, source: lead.source || undefined })
    } catch (error) {
      console.error("Failed to send internal notification:", error)
    }

    try {
      await sendConfirmationEmail(data)
    } catch (error) {
      console.error("Failed to send confirmation email:", error)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Erreur lors du traitement de votre demande" },
      { status: 500 }
    )
  }
}

