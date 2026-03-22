import { controlDb } from "@/lib/control-db"
import { suppliers, type Supplier, type NewSupplier } from "@/lib/control-schema"
import { eq, asc } from "drizzle-orm"

export class SuppliersRepository {
  async listAll(): Promise<Supplier[]> {
    return controlDb.select().from(suppliers).orderBy(asc(suppliers.name))
  }

  async findById(id: number): Promise<Supplier | undefined> {
    const [row] = await controlDb.select().from(suppliers).where(eq(suppliers.id, id))
    return row
  }

  async create(data: NewSupplier): Promise<Supplier> {
    const [row] = await controlDb.insert(suppliers).values(data).returning()
    return row
  }

  async update(id: number, data: Partial<NewSupplier>): Promise<Supplier> {
    const [row] = await controlDb
      .update(suppliers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(suppliers.id, id))
      .returning()
    return row
  }

  async delete(id: number): Promise<void> {
    await controlDb.delete(suppliers).where(eq(suppliers.id, id))
  }
}

export const suppliersRepository = new SuppliersRepository()
