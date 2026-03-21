import { controlDb } from "@/lib/control-db"
import { expenses, projects, type Expense, type NewExpense } from "@/lib/control-schema"
import { eq, desc, sql } from "drizzle-orm"

export class ExpensesRepository {
  /** Ordered by date desc, paginated 15 — mirrors ExpenseController::index() */
  async paginate(page = 1, perPage = 15) {
    const offset = (page - 1) * perPage
    const rows = await controlDb
      .select({
        id: expenses.id,
        projectId: expenses.projectId,
        description: expenses.description,
        amount: expenses.amount,
        paidTo: expenses.paidTo,
        date: expenses.date,
        note: expenses.note,
        createdAt: expenses.createdAt,
        updatedAt: expenses.updatedAt,
        projectName: projects.name,
      })
      .from(expenses)
      .leftJoin(projects, eq(expenses.projectId, projects.id))
      .orderBy(desc(expenses.date))
      .limit(perPage)
      .offset(offset)

    const [{ count }] = await controlDb.select({ count: sql<number>`count(*)` }).from(expenses)
    return {
      data: rows.map((r) => ({ ...r, projectName: r.projectName ?? null })),
      total: Number(count),
      page,
      perPage,
      lastPage: Math.ceil(Number(count) / perPage),
    }
  }

  async findById(id: number): Promise<Expense | undefined> {
    const [row] = await controlDb.select().from(expenses).where(eq(expenses.id, id))
    return row
  }

  async create(data: NewExpense): Promise<Expense> {
    const result = await controlDb.insert(expenses).values(data).returning()
    return result[0]
  }

  async update(id: number, data: Partial<NewExpense>): Promise<Expense> {
    const result = await controlDb
      .update(expenses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(expenses.id, id))
      .returning()
    return result[0]
  }

  async delete(id: number): Promise<void> {
    await controlDb.delete(expenses).where(eq(expenses.id, id))
  }

  async sumAll(): Promise<number> {
    const [{ total }] = await controlDb
      .select({ total: sql<number>`coalesce(sum(amount), 0)` })
      .from(expenses)
    return Number(total)
  }

  async sumBetween(from: Date, to: Date): Promise<number> {
    const [{ total }] = await controlDb
      .select({ total: sql<number>`coalesce(sum(amount), 0)` })
      .from(expenses)
      .where(sql`${expenses.date} >= ${from} AND ${expenses.date} <= ${to}`)
    return Number(total)
  }

  async latest(limit = 10): Promise<(Expense & { projectName: string | null })[]> {
    const rows = await controlDb
      .select({
        id: expenses.id,
        projectId: expenses.projectId,
        description: expenses.description,
        amount: expenses.amount,
        paidTo: expenses.paidTo,
        date: expenses.date,
        note: expenses.note,
        createdAt: expenses.createdAt,
        updatedAt: expenses.updatedAt,
        projectName: projects.name,
      })
      .from(expenses)
      .leftJoin(projects, eq(expenses.projectId, projects.id))
      .orderBy(desc(expenses.date))
      .limit(limit)
    return rows.map((r) => ({ ...r, projectName: r.projectName ?? null }))
  }
}

export const expensesRepository = new ExpensesRepository()
