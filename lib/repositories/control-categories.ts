import { controlDb } from "@/lib/control-db"
import { categories, type Category, type NewCategory } from "@/lib/control-schema"
import { eq, asc } from "drizzle-orm"

export class CategoriesRepository {
  async listAll(): Promise<Category[]> {
    return controlDb.select().from(categories).orderBy(asc(categories.name))
  }

  async findById(id: number): Promise<Category | undefined> {
    const [row] = await controlDb.select().from(categories).where(eq(categories.id, id))
    return row
  }

  async create(data: NewCategory): Promise<Category> {
    const [row] = await controlDb.insert(categories).values(data).returning()
    return row
  }

  async update(id: number, data: Partial<NewCategory>): Promise<Category> {
    const [row] = await controlDb
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning()
    return row
  }

  async delete(id: number): Promise<void> {
    await controlDb.delete(categories).where(eq(categories.id, id))
  }
}

export const categoriesRepository = new CategoriesRepository()
