import { controlDb } from "@/lib/control-db"
import { debts, type Debt, type NewDebt } from "@/lib/control-schema"
import { eq, like, and, desc, sql, or, inArray } from "drizzle-orm"

export class DebtsRepository {
  /**
   * Search by debtor_name LIKE, filter by status, ordered by updatedAt desc, paginated 15.
   * Mirrors DebtController::index()
   */
  async paginate(page = 1, perPage = 15, search?: string, status?: string) {
    const offset = (page - 1) * perPage
    const conditions = []
    if (search) conditions.push(like(debts.debtorName, `%${search}%`))
    if (status) conditions.push(eq(debts.status, status))

    const where = conditions.length ? and(...conditions) : undefined

    const rows = await controlDb
      .select()
      .from(debts)
      .where(where)
      .orderBy(desc(debts.updatedAt))
      .limit(perPage)
      .offset(offset)

    const [{ count }] = await controlDb
      .select({ count: sql<number>`count(*)` })
      .from(debts)
      .where(where)

    return { data: rows, total: Number(count), page, perPage, lastPage: Math.ceil(Number(count) / perPage) }
  }

  async findById(id: number): Promise<Debt | undefined> {
    const [row] = await controlDb.select().from(debts).where(eq(debts.id, id))
    return row
  }

  async create(data: NewDebt): Promise<Debt> {
    const result = await controlDb.insert(debts).values(data).returning()
    return result[0]
  }

  async update(id: number, data: Partial<NewDebt>): Promise<Debt> {
    const result = await controlDb
      .update(debts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(debts.id, id))
      .returning()
    return result[0]
  }

  async delete(id: number): Promise<void> {
    await controlDb.delete(debts).where(eq(debts.id, id))
  }

  /** Overdue = open/partial AND due_date < now — mirrors Debt::scopeOverdue() */
  async findOverdue(limit = 5): Promise<Debt[]> {
    return controlDb
      .select()
      .from(debts)
      .where(
        and(
          inArray(debts.status, ["open", "partial"]),
          sql`${debts.dueDate} IS NOT NULL AND ${debts.dueDate} < ${new Date()}`
        )
      )
      .orderBy(debts.dueDate)
      .limit(limit)
  }

  /** Total remaining amount for open+partial debts */
  async totalOwed(): Promise<number> {
    const [{ total }] = await controlDb
      .select({ total: sql<number>`coalesce(sum(amount - coalesce(paid_amount, 0)), 0)` })
      .from(debts)
      .where(inArray(debts.status, ["open", "partial"]))
    return Number(total)
  }

  /** Count of overdue debts */
  async overdueCount(): Promise<number> {
    const [{ count }] = await controlDb
      .select({ count: sql<number>`count(*)` })
      .from(debts)
      .where(
        and(
          inArray(debts.status, ["open", "partial"]),
          sql`${debts.dueDate} IS NOT NULL AND ${debts.dueDate} < ${new Date()}`
        )
      )
    return Number(count)
  }

  /** Total remaining amount of overdue debts */
  async overdueTotal(): Promise<number> {
    const [{ total }] = await controlDb
      .select({ total: sql<number>`coalesce(sum(amount - coalesce(paid_amount, 0)), 0)` })
      .from(debts)
      .where(
        and(
          inArray(debts.status, ["open", "partial"]),
          sql`${debts.dueDate} IS NOT NULL AND ${debts.dueDate} < ${new Date()}`
        )
      )
    return Number(total)
  }
}

export const debtsRepository = new DebtsRepository()
