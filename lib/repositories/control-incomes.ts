import { controlDb } from "@/lib/control-db"
import { incomes, projects, type Income, type NewIncome } from "@/lib/control-schema"
import { eq, desc, sql } from "drizzle-orm"

export class IncomesRepository {
  /** Ordered by date desc, paginated 15 — mirrors IncomeController::index() */
  async paginate(page = 1, perPage = 15) {
    const offset = (page - 1) * perPage
    const rows = await controlDb
      .select({
        id: incomes.id,
        projectId: incomes.projectId,
        description: incomes.description,
        amount: incomes.amount,
        receivedFrom: incomes.receivedFrom,
        date: incomes.date,
        note: incomes.note,
        createdAt: incomes.createdAt,
        updatedAt: incomes.updatedAt,
        projectName: projects.name,
      })
      .from(incomes)
      .leftJoin(projects, eq(incomes.projectId, projects.id))
      .orderBy(desc(incomes.date))
      .limit(perPage)
      .offset(offset)

    const [{ count }] = await controlDb.select({ count: sql<number>`count(*)` }).from(incomes)
    return {
      data: rows.map((r) => ({ ...r, projectName: r.projectName ?? null })),
      total: Number(count),
      page,
      perPage,
      lastPage: Math.ceil(Number(count) / perPage),
    }
  }

  async findById(id: number): Promise<Income | undefined> {
    const [row] = await controlDb.select().from(incomes).where(eq(incomes.id, id))
    return row
  }

  async create(data: NewIncome): Promise<Income> {
    const result = await controlDb.insert(incomes).values(data).returning()
    return result[0]
  }

  async update(id: number, data: Partial<NewIncome>): Promise<Income> {
    const result = await controlDb
      .update(incomes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(incomes.id, id))
      .returning()
    return result[0]
  }

  async delete(id: number): Promise<void> {
    await controlDb.delete(incomes).where(eq(incomes.id, id))
  }

  /** Sum all income for dashboard total */
  async sumAll(): Promise<number> {
    const [{ total }] = await controlDb
      .select({ total: sql<number>`coalesce(sum(amount), 0)` })
      .from(incomes)
    return Number(total)
  }

  /** Sum income in a date range (for monthly totals) */
  async sumBetween(from: Date, to: Date): Promise<number> {
    const [{ total }] = await controlDb
      .select({ total: sql<number>`coalesce(sum(amount), 0)` })
      .from(incomes)
      .where(sql`${incomes.date} >= ${from} AND ${incomes.date} <= ${to}`)
    return Number(total)
  }

  /** Latest N incomes for transaction feed */
  async latest(limit = 10): Promise<(Income & { projectName: string | null })[]> {
    const rows = await controlDb
      .select({
        id: incomes.id,
        projectId: incomes.projectId,
        description: incomes.description,
        amount: incomes.amount,
        receivedFrom: incomes.receivedFrom,
        date: incomes.date,
        note: incomes.note,
        createdAt: incomes.createdAt,
        updatedAt: incomes.updatedAt,
        projectName: projects.name,
      })
      .from(incomes)
      .leftJoin(projects, eq(incomes.projectId, projects.id))
      .orderBy(desc(incomes.date))
      .limit(limit)
    return rows.map((r) => ({ ...r, projectName: r.projectName ?? null }))
  }
}

export const incomesRepository = new IncomesRepository()
