import { controlDb } from "@/lib/control-db"
import { services, type Service, type NewService } from "@/lib/control-schema"
import { eq, like, and, desc, sql, or } from "drizzle-orm"

export class ServicesRepository {
  /**
   * Search by name OR vendor LIKE, filter by status, ordered by updatedAt desc.
   * Mirrors ServiceController::index()
   */
  async paginate(page = 1, perPage = 15, search?: string, status?: string) {
    const offset = (page - 1) * perPage
    const conditions = []
    if (search) {
      conditions.push(or(like(services.name, `%${search}%`), like(services.vendor, `%${search}%`)))
    }
    if (status) conditions.push(eq(services.status, status))

    const where = conditions.length ? and(...conditions) : undefined

    const rows = await controlDb
      .select()
      .from(services)
      .where(where)
      .orderBy(desc(services.updatedAt))
      .limit(perPage)
      .offset(offset)

    const [{ count }] = await controlDb
      .select({ count: sql<number>`count(*)` })
      .from(services)
      .where(where)

    return { data: rows, total: Number(count), page, perPage, lastPage: Math.ceil(Number(count) / perPage) }
  }

  async findById(id: number): Promise<Service | undefined> {
    const [row] = await controlDb.select().from(services).where(eq(services.id, id))
    return row
  }

  async create(data: NewService): Promise<Service> {
    const result = await controlDb.insert(services).values(data).returning()
    return result[0]
  }

  async update(id: number, data: Partial<NewService>): Promise<Service> {
    const result = await controlDb
      .update(services)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning()
    return result[0]
  }

  async delete(id: number): Promise<void> {
    await controlDb.delete(services).where(eq(services.id, id))
  }

  /** All active services (for dashboard monthly recurring total) */
  async findActive(): Promise<Service[]> {
    return controlDb.select().from(services).where(eq(services.status, "active"))
  }
}

export const servicesRepository = new ServicesRepository()
