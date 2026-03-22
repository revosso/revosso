import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"

// ─── Projects ────────────────────────────────────────────────────────────────
export const projects = sqliteTable("control_projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  budget: real("budget"),
  status: text("status").notNull().default("in_progress"), // stopped|in_progress|delayed|completed
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  expectedEndDate: integer("expected_end_date", { mode: "timestamp" }),
  actualEndDate: integer("actual_end_date", { mode: "timestamp" }),
  progressPercent: integer("progress_percent").default(0),
  priority: text("priority").default("medium"), // low|medium|high
  owner: text("owner"),
  lastUpdateAt: integer("last_update_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

// ─── Project Updates ─────────────────────────────────────────────────────────
export const projectUpdates = sqliteTable("control_project_updates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id),
  note: text("note").notNull(),
  createdBy: text("created_by"), // Auth0 user sub / email
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

// ─── Master data: categories, clients (customers), suppliers (fornecedores) ───
export const categories = sqliteTable("control_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

export const clients = sqliteTable("control_clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

export const suppliers = sqliteTable("control_suppliers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

// ─── Incomes ─────────────────────────────────────────────────────────────────
export const incomes = sqliteTable("control_incomes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").references(() => projects.id),
  clientId: integer("client_id").references(() => clients.id),
  categoryId: integer("category_id").references(() => categories.id),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  receivedFrom: text("received_from").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  note: text("note"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

// ─── Expenses ────────────────────────────────────────────────────────────────
export const expenses = sqliteTable("control_expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").references(() => projects.id),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  categoryId: integer("category_id").references(() => categories.id),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  paidTo: text("paid_to").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  note: text("note"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

// ─── Debts ───────────────────────────────────────────────────────────────────
// Statuses from Laravel Debt model: open | partial | paid | canceled
export const debts = sqliteTable("control_debts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  debtorName: text("debtor_name").notNull(),
  contact: text("contact"),
  description: text("description"),
  amount: real("amount").notNull(),
  paidAmount: real("paid_amount").default(0),
  currency: text("currency").default("USD"),
  dueDate: integer("due_date", { mode: "timestamp" }),
  status: text("status").notNull().default("open"), // open|partial|paid|canceled
  notes: text("notes"),
  lastContactedAt: integer("last_contacted_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

// ─── Services (Contracted) ───────────────────────────────────────────────────
// Billing cycles: weekly|monthly|quarterly|yearly|one_time
// Statuses: active|paused|canceled
export const services = sqliteTable("control_services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  categoryId: integer("category_id").references(() => categories.id),
  vendor: text("vendor"),
  category: text("category"),
  description: text("description"),
  cost: real("cost").notNull(),
  currency: text("currency").default("USD"),
  billingCycle: text("billing_cycle").notNull(), // weekly|monthly|quarterly|yearly|one_time
  billingDay: integer("billing_day"),
  renewalDate: integer("renewal_date", { mode: "timestamp" }),
  startDate: integer("start_date", { mode: "timestamp" }),
  endDate: integer("end_date", { mode: "timestamp" }),
  status: text("status").notNull().default("active"), // active|paused|canceled
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

// ─── Platforms (enterprise tools / URLs registry) ─────────────────────────────
export const platforms = sqliteTable("control_platforms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  category: text("category"),
  notes: text("notes"),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

// ─── Settings ────────────────────────────────────────────────────────────────
export const settings = sqliteTable("control_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
})

// ─── TypeScript types ─────────────────────────────────────────────────────────
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type ProjectUpdate = typeof projectUpdates.$inferSelect
export type NewProjectUpdate = typeof projectUpdates.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Client = typeof clients.$inferSelect
export type NewClient = typeof clients.$inferInsert
export type Supplier = typeof suppliers.$inferSelect
export type NewSupplier = typeof suppliers.$inferInsert
export type Income = typeof incomes.$inferSelect
export type NewIncome = typeof incomes.$inferInsert
export type Expense = typeof expenses.$inferSelect
export type NewExpense = typeof expenses.$inferInsert
export type Debt = typeof debts.$inferSelect
export type NewDebt = typeof debts.$inferInsert
export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert
export type Platform = typeof platforms.$inferSelect
export type NewPlatform = typeof platforms.$inferInsert
export type Setting = typeof settings.$inferSelect

// ─── Domain constants (mirror Laravel model constants) ────────────────────────
export const PROJECT_STATUSES = ["stopped", "in_progress", "delayed", "completed"] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const DEBT_STATUSES = ["open", "partial", "paid", "canceled"] as const
export type DebtStatus = (typeof DEBT_STATUSES)[number]

export const SERVICE_BILLING_CYCLES = ["weekly", "monthly", "quarterly", "yearly", "one_time"] as const
export type BillingCycle = (typeof SERVICE_BILLING_CYCLES)[number]

export const SERVICE_STATUSES = ["active", "paused", "canceled"] as const
export type ServiceStatus = (typeof SERVICE_STATUSES)[number]

// ─── Domain helpers ───────────────────────────────────────────────────────────

/** Monthly cost equivalent — mirrors Laravel Service::getMonthlyCostAttribute() */
export function serviceMonthlyCost(cost: number, billingCycle: BillingCycle): number {
  switch (billingCycle) {
    case "weekly": return cost * 52 / 12
    case "monthly": return cost
    case "quarterly": return cost / 3
    case "yearly": return cost / 12
    case "one_time": return 0
  }
}

/** Remaining debt amount — mirrors Laravel Debt::getRemainingAmountAttribute() */
export function debtRemainingAmount(amount: number, paidAmount: number | null): number {
  return amount - (paidAmount ?? 0)
}

/** Is overdue — mirrors Laravel Debt::getIsOverdueAttribute() */
export function debtIsOverdue(dueDate: Date | null, status: DebtStatus): boolean {
  if (!dueDate) return false
  return dueDate < new Date() && (status === "open" || status === "partial")
}

/** At-risk: not completed AND (delayed OR no update OR update older than 14 days) */
export function isAtRisk(status: ProjectStatus, lastUpdateAt: Date | null): boolean {
  if (status === "completed") return false
  if (status === "delayed") return true
  if (!lastUpdateAt) return true
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  return lastUpdateAt <= fourteenDaysAgo
}
