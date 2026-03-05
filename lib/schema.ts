import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  productInterest: text("product_interest"),
  source: text("source"),
  status: text("status").notNull().default("NEW"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
})

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert

