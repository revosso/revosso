import { controlDb } from "@/lib/control-db"
import { platforms, type Platform, type NewPlatform } from "@/lib/control-schema"
import { eq, like, and, desc, sql, or, asc } from "drizzle-orm"

export class PlatformsRepository {
  async paginate(page = 1, perPage = 15, search?: string, category?: string) {
    const offset = (page - 1) * perPage
    const conditions = []
    if (search) {
      conditions.push(
        or(like(platforms.name, `%${search}%`), like(platforms.url, `%${search}%`)),
      )
    }
    if (category) conditions.push(eq(platforms.category, category))

    const where = conditions.length ? and(...conditions) : undefined

    const rows = await controlDb
      .select()
      .from(platforms)
      .where(where)
      .orderBy(asc(platforms.sortOrder), desc(platforms.updatedAt))
      .limit(perPage)
      .offset(offset)

    const [{ count }] = await controlDb
      .select({ count: sql<number>`count(*)` })
      .from(platforms)
      .where(where)

    return { data: rows, total: Number(count), page, perPage, lastPage: Math.ceil(Number(count) / perPage) }
  }

  async findById(id: number): Promise<Platform | undefined> {
    const [row] = await controlDb.select().from(platforms).where(eq(platforms.id, id))
    return row
  }

  async create(data: NewPlatform): Promise<Platform> {
    const result = await controlDb.insert(platforms).values(data).returning()
    return result[0]
  }

  async update(id: number, data: Partial<NewPlatform>): Promise<Platform> {
    const result = await controlDb
      .update(platforms)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(platforms.id, id))
      .returning()
    return result[0]
  }

  async delete(id: number): Promise<void> {
    await controlDb.delete(platforms).where(eq(platforms.id, id))
  }
}

export const platformsRepository = new PlatformsRepository()
