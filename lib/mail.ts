import nodemailer from "nodemailer"
import type { ContactInput } from "./validation"

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error("SMTP configuration missing")
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendInternalNotification(data: ContactInput & { id: string; source?: string }): Promise<void> {
  if (!process.env.ADMIN_EMAIL) {
    console.error("ADMIN_EMAIL not configured")
    return
  }

  const sourceParts = data.source?.split("|") || []
  const environment = sourceParts[1] || "unknown"
  const referrer = sourceParts[2] || "direct"
  const timestamp = new Date().toISOString()
  
  const interestLabels: Record<string, string> = {
    NEW_PLATFORM: "New Platform Development",
    PLATFORM_TAKEOVER: "Platform Takeover & Optimization",
    PLATFORM_MAINTENANCE: "Platform Maintenance",
    INFRASTRUCTURE_HOSTING: "Infrastructure & Hosting",
    PARTNERSHIP: "Partnership",
    GENERAL_INQUIRY: "General Inquiry",
  }
  
  const html = `
    <h2>New Revosso Lead</h2>
    <p><strong>ID:</strong> ${data.id}</p>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
    ${data.productInterest ? `<p><strong>Lead Type:</strong> ${interestLabels[data.productInterest] || data.productInterest}</p>` : ""}
    <p><strong>Source:</strong> ${sourceParts[0] || "homepage"}</p>
    <p><strong>Environment:</strong> ${environment}</p>
    <p><strong>Referrer:</strong> ${referrer}</p>
    <p><strong>Timestamp:</strong> ${timestamp}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, "<br>")}</p>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Revosso Lead",
      html,
    })
  } catch (error) {
    console.error("Failed to send internal notification:", error)
    throw error
  }
}

export async function sendConfirmationEmail(data: ContactInput): Promise<void> {
  const interestLabels: Record<string, string> = {
    NEW_PLATFORM: "New Platform Development",
    PLATFORM_TAKEOVER: "Platform Takeover & Optimization",
    PLATFORM_MAINTENANCE: "Platform Maintenance",
    INFRASTRUCTURE_HOSTING: "Infrastructure & Hosting",
    PARTNERSHIP: "Partnership",
    GENERAL_INQUIRY: "General Inquiry",
  }
  
  const html = `
    <h2>We Received Your Message</h2>
    <p>Hello ${data.name},</p>
    <p>Thank you for contacting Revosso. We have received your inquiry${data.productInterest ? ` regarding ${interestLabels[data.productInterest] || data.productInterest}` : ""} and will respond within 24 hours.</p>
    <p>Best regards,<br>The Revosso Team</p>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: data.email,
      subject: "We received your message",
      html,
    })
  } catch (error) {
    console.error("Failed to send confirmation email:", error)
    throw error
  }
}

