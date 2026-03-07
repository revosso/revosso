import nodemailer from "nodemailer"
import type { Lead } from "./schema"

type Locale = "en" | "fr" | "pt-BR" | "es"

const emailTranslations: Record<
  Locale,
  {
    subject: string
    heading: string
    greeting: (name: string) => string
    body: string
    interestPrefix: string
    closing: string
    productInterestLabels: Record<string, string>
  }
> = {
  en: {
    subject: "We received your message - Revosso",
    heading: "We Received Your Message",
    greeting: (name) => `Hello ${name},`,
    body: "Thank you for contacting Revosso. We have received your inquiry and will respond within 24 hours.",
    interestPrefix: "We noted your interest in",
    closing: "Best regards,<br>The Revosso Team",
    productInterestLabels: {
      NEW_PLATFORM: "New Platform Development",
      PLATFORM_TAKEOVER: "Platform Takeover & Optimization",
      PLATFORM_MAINTENANCE: "Platform Maintenance",
      INFRASTRUCTURE_HOSTING: "Infrastructure & Hosting",
      PARTNERSHIP: "Partnership",
      GENERAL_INQUIRY: "General Inquiry",
    },
  },
  fr: {
    subject: "Nous avons bien reçu votre message - Revosso",
    heading: "Nous Avons Reçu Votre Message",
    greeting: (name) => `Bonjour ${name},`,
    body: "Merci de nous avoir contactés. Nous avons bien reçu votre demande et vous répondrons dans les 24 heures.",
    interestPrefix: "Nous avons noté votre intérêt pour",
    closing: "Cordialement,<br>L'équipe Revosso",
    productInterestLabels: {
      NEW_PLATFORM: "Développement de Nouvelle Plateforme",
      PLATFORM_TAKEOVER: "Reprise & Optimisation de Plateforme",
      PLATFORM_MAINTENANCE: "Maintenance de Plateforme",
      INFRASTRUCTURE_HOSTING: "Infrastructure & Hébergement",
      PARTNERSHIP: "Partenariat",
      GENERAL_INQUIRY: "Demande Générale",
    },
  },
  "pt-BR": {
    subject: "Recebemos sua mensagem - Revosso",
    heading: "Recebemos Sua Mensagem",
    greeting: (name) => `Olá ${name},`,
    body: "Obrigado por entrar em contato com a Revosso. Recebemos sua solicitação e responderemos em até 24 horas.",
    interestPrefix: "Notamos seu interesse em",
    closing: "Atenciosamente,<br>A Equipe Revosso",
    productInterestLabels: {
      NEW_PLATFORM: "Desenvolvimento de Nova Plataforma",
      PLATFORM_TAKEOVER: "Assunção & Otimização de Plataforma",
      PLATFORM_MAINTENANCE: "Manutenção de Plataforma",
      INFRASTRUCTURE_HOSTING: "Infraestrutura & Hospedagem",
      PARTNERSHIP: "Parceria",
      GENERAL_INQUIRY: "Consulta Geral",
    },
  },
  es: {
    subject: "Recibimos su mensaje - Revosso",
    heading: "Recibimos Su Mensaje",
    greeting: (name) => `Hola ${name},`,
    body: "Gracias por contactar a Revosso. Hemos recibido su consulta y responderemos en 24 horas.",
    interestPrefix: "Notamos su interés en",
    closing: "Saludos,<br>El Equipo Revosso",
    productInterestLabels: {
      NEW_PLATFORM: "Desarrollo de Nueva Plataforma",
      PLATFORM_TAKEOVER: "Asunción y Optimización de Plataforma",
      PLATFORM_MAINTENANCE: "Mantenimiento de Plataforma",
      INFRASTRUCTURE_HOSTING: "Infraestructura y Alojamiento",
      PARTNERSHIP: "Asociación",
      GENERAL_INQUIRY: "Consulta General",
    },
  },
}

function getLocale(userLanguage: string | null | undefined): Locale {
  if (!userLanguage) return "en"
  const lang = userLanguage.toLowerCase()
  if (lang.startsWith("fr")) return "fr"
  if (lang.startsWith("pt")) return "pt-BR"
  if (lang.startsWith("es")) return "es"
  return "en"
}

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

function buildEmailWrapper(bodyContent: string, lang = "en"): string {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1e293b;border-radius:12px 12px 0 0;padding:32px 40px;border-bottom:2px solid #3b82f6;text-align:center;">
              <span style="font-size:22px;font-weight:700;color:#f8fafc;letter-spacing:-0.5px;">Revosso</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#1e293b;padding:36px 40px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0f172a;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#475569;">
                © ${new Date().getFullYear()} Revosso &nbsp;·&nbsp;
                <a href="https://revosso.com" style="color:#3b82f6;text-decoration:none;">revosso.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;color:#94a3b8;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;color:#f1f5f9;font-size:13px;vertical-align:top;">${value}</td>
  </tr>`
}

/**
 * Send internal notification to Revosso team when a new lead is received
 */
export async function sendInternalNotification(lead: Lead): Promise<void> {
  if (!process.env.ADMIN_EMAIL) {
    console.error("ADMIN_EMAIL not configured")
    throw new Error("ADMIN_EMAIL not configured")
  }

  const timestamp = lead.createdAt.toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "UTC",
  }) + " UTC"

  const productInterestLabel = lead.productInterest
    ? (emailTranslations.en.productInterestLabels[lead.productInterest] ?? lead.productInterest)
    : null

  const bodyContent = `
    <h2 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#f8fafc;">New Lead</h2>
    <p style="margin:0 0 28px;font-size:14px;color:#64748b;">Submitted via ${lead.sourcePage ?? "website"}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #334155;margin-bottom:28px;">
      <tbody>
        <tr><td colspan="2" style="padding-top:16px;font-size:0;line-height:0;">&nbsp;</td></tr>
        ${row("Name", lead.name)}
        ${row("Email", `<a href="mailto:${lead.email}" style="color:#3b82f6;text-decoration:none;">${lead.email}</a>`)}
        ${lead.company            ? row("Company",   lead.company)            : ""}
        ${productInterestLabel    ? row("Interest",  productInterestLabel)    : ""}
        ${lead.userLanguage       ? row("Language",  lead.userLanguage)       : ""}
        ${row("Submitted", timestamp)}
      </tbody>
    </table>

    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
    <div style="background-color:#0f172a;border-radius:8px;padding:16px 20px;border-left:3px solid #3b82f6;">
      <p style="margin:0;font-size:14px;color:#cbd5e1;line-height:1.6;">${lead.message.replace(/\n/g, "<br>")}</p>
    </div>

    <p style="margin:24px 0 0;font-size:11px;color:#334155;">
      ID: ${lead.id} &nbsp;·&nbsp; IP: ${lead.ipAddress ?? "unknown"} &nbsp;·&nbsp; UA: ${lead.userAgent ?? "unknown"}
    </p>
  `

  const text = [
    `NEW LEAD — Revosso`,
    ``,
    `Name:      ${lead.name}`,
    `Email:     ${lead.email}`,
    lead.company          ? `Company:   ${lead.company}`           : null,
    productInterestLabel  ? `Interest:  ${productInterestLabel}`   : null,
    lead.userLanguage     ? `Language:  ${lead.userLanguage}`      : null,
    `Submitted: ${timestamp}`,
    ``,
    `Message`,
    `-------`,
    lead.message,
    ``,
    `---`,
    `ID: ${lead.id}  |  IP: ${lead.ipAddress ?? "unknown"}`,
  ].filter((l) => l !== null).join("\n")

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      replyTo: `${lead.name} <${lead.email}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New lead: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
      text,
      html: buildEmailWrapper(bodyContent),
    })
  } catch (error) {
    console.error("Failed to send internal notification:", error)
    throw error
  }
}

/**
 * Send confirmation email to the user who submitted the lead.
 * The email is written in the same language the user had selected on the site.
 */
export async function sendConfirmationEmail(lead: Lead): Promise<void> {
  const locale = getLocale(lead.userLanguage)
  const t = emailTranslations[locale]

  const productInterestLabel = lead.productInterest
    ? t.productInterestLabels[lead.productInterest] ?? lead.productInterest
    : null

  const bodyContent = `
    <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#f8fafc;">${t.heading}</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#cbd5e1;line-height:1.6;">${t.greeting(lead.name)}</p>
    <p style="margin:0 0 16px;font-size:15px;color:#cbd5e1;line-height:1.6;">${t.body}</p>
    ${productInterestLabel ? `
    <div style="background-color:#0f172a;border-radius:8px;padding:14px 20px;border-left:3px solid #3b82f6;margin:0 0 20px;">
      <p style="margin:0;font-size:14px;color:#94a3b8;">${t.interestPrefix} <strong style="color:#f1f5f9;">${productInterestLabel}</strong>.</p>
    </div>` : ""}
    <p style="margin:24px 0 0;font-size:14px;color:#94a3b8;line-height:1.6;border-top:1px solid #334155;padding-top:24px;">${t.closing}</p>
  `

  const text = [
    t.heading,
    ``,
    t.greeting(lead.name),
    ``,
    t.body,
    productInterestLabel ? `${t.interestPrefix} ${productInterestLabel}.` : null,
    ``,
    t.closing.replace(/<br>/g, "\n"),
    ``,
    `---`,
    `© ${new Date().getFullYear()} Revosso — https://revosso.com`,
  ].filter((l) => l !== null).join("\n")

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: lead.email,
      subject: t.subject,
      text,
      html: buildEmailWrapper(bodyContent, locale),
    })
  } catch (error) {
    console.error("Failed to send confirmation email:", error)
    throw error
  }
}

