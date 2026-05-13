import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

// Leads table - stores all lead submissions
// Sources: revosso.com contact form + public ecosystem lead ingestion API
export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),

  // Basic information
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  // Nullable: contact-form leads have a message; public-API leads do not
  message: text("message"),

  // Lead intent fields (flexible strings for future expansion)
  leadType: text("lead_type"), // e.g., custom_software_development, platform_maintenance
  productInterest: text("product_interest"), // e.g., cashlakay, revofin, revosso_ecosystem
  sourcePage: text("source_page"), // e.g., landing, services, contact
  businessStage: text("business_stage"), // e.g., idea, startup, enterprise

  // ── Public ecosystem lead ingestion fields ──────────────────────────────
  // product: REVOFIN | REVOMAKET | REVOSSO | etc.
  product: text("product"),
  // source: the Revosso-ecosystem domain that submitted the lead
  source: text("source"),
  // businessType: e.g. "Restaurant", "Retail", "Freelancer"
  businessType: text("business_type"),
  // interests: JSON-serialised string[] – e.g. '["POS","Accounting"]'
  interests: text("interests"),
  // ────────────────────────────────────────────────────────────────────────

  // System fields
  emailStatus: text("email_status").notNull().default("pending"), // pending, sent, failed
  leadStatus: text("lead_status").notNull().default("new"), // new, contacted, qualified, closed, converted
  notes: text("notes"), // Internal follow-up notes
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userLanguage: text("user_language"),
  // country / language are populated by future analytics enrichment pipelines
  country: text("country"),
  // tags: JSON-serialised string[] for future CRM tagging
  tags: text("tags"),
  // metadata: arbitrary JSON blob for future integrations
  metadata: text("metadata"),

  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
})

// Visitors table - anonymous analytics
export const visitors = sqliteTable("visitors", {
  id: text("id").primaryKey(),
  visitorId: text("visitor_id").notNull(), // Anonymous identifier
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  pagePath: text("page_path").notNull(),
  language: text("language"),
  referrer: text("referrer"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
})

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
export type Visitor = typeof visitors.$inferSelect
export type NewVisitor = typeof visitors.$inferInsert

