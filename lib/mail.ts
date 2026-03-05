import nodemailer from "nodemailer"
import type { Lead } from "./schema"

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

/**
 * Send internal notification to Revosso team when a new lead is received
 */
export async function sendInternalNotification(lead: Lead): Promise<void> {
  if (!process.env.ADMIN_EMAIL) {
    console.error("ADMIN_EMAIL not configured")
    throw new Error("ADMIN_EMAIL not configured")
  }

  const timestamp = lead.createdAt.toISOString()
  
  const html = `
    <h2>New Revosso Lead</h2>
    <p><strong>ID:</strong> ${lead.id}</p>
    <p><strong>Name:</strong> ${lead.name}</p>
    <p><strong>Email:</strong> ${lead.email}</p>
    ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ""}
    ${lead.leadType ? `<p><strong>Lead Type:</strong> ${lead.leadType}</p>` : ""}
    ${lead.productInterest ? `<p><strong>Product Interest:</strong> ${lead.productInterest}</p>` : ""}
    ${lead.sourcePage ? `<p><strong>Source Page:</strong> ${lead.sourcePage}</p>` : ""}
    ${lead.businessStage ? `<p><strong>Business Stage:</strong> ${lead.businessStage}</p>` : ""}
    ${lead.userLanguage ? `<p><strong>Language:</strong> ${lead.userLanguage}</p>` : ""}
    <p><strong>Timestamp:</strong> ${timestamp}</p>
    <p><strong>Message:</strong></p>
    <p>${lead.message.replace(/\n/g, "<br>")}</p>
    <hr>
    <p style="font-size: 12px; color: #666;">
      IP: ${lead.ipAddress || "unknown"}<br>
      User Agent: ${lead.userAgent || "unknown"}
    </p>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Revosso Lead: ${lead.name}`,
      html,
    })
  } catch (error) {
    console.error("Failed to send internal notification:", error)
    throw error
  }
}

/**
 * Send confirmation email to the user who submitted the lead
 */
export async function sendConfirmationEmail(lead: Lead): Promise<void> {
  const html = `
    <h2>We Received Your Message</h2>
    <p>Hello ${lead.name},</p>
    <p>Thank you for contacting Revosso. We have received your inquiry and will respond within 24 hours.</p>
    ${lead.productInterest ? `<p>We noted your interest in <strong>${lead.productInterest}</strong>.</p>` : ""}
    <p>Best regards,<br>The Revosso Team</p>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: lead.email,
      subject: "We received your message - Revosso",
      html,
    })
  } catch (error) {
    console.error("Failed to send confirmation email:", error)
    throw error
  }
}

