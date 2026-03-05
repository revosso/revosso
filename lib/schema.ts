import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

// Leads table - stores all lead submissions
export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  // Basic information
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  
  // Lead intent fields (flexible strings for future expansion)
  leadType: text("lead_type"), // e.g., custom_software_development, platform_maintenance
  productInterest: text("product_interest"), // e.g., cashlakay, revofin, revosso_ecosystem
  sourcePage: text("source_page"), // e.g., landing, services, contact
  businessStage: text("business_stage"), // e.g., idea, startup, enterprise
  
  // System fields
  emailStatus: text("email_status").notNull().default("pending"), // pending, sent, failed
  leadStatus: text("lead_status").notNull().default("new"), // new, contacted, qualified, closed
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userLanguage: text("user_language"),
  
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

