import { controlDb } from "@/lib/control-db"
import { clients, type Client, type NewClient } from "@/lib/control-schema"
import { eq, asc } from "drizzle-orm"

export class ClientsRepository {
  async listAll(): Promise<Client[]> {
    return controlDb.select().from(clients).orderBy(asc(clients.name))
  }

  async findById(id: number): Promise<Client | undefined> {
    const [row] = await controlDb.select().from(clients).where(eq(clients.id, id))
    return row
  }

  async create(data: NewClient): Promise<Client> {
    const [row] = await controlDb.insert(clients).values(data).returning()
    return row
  }

  async update(id: number, data: Partial<NewClient>): Promise<Client> {
    const [row] = await controlDb
      .update(clients)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning()
    return row
  }

  async delete(id: number): Promise<void> {
    await controlDb.delete(clients).where(eq(clients.id, id))
  }
}

export const clientsRepository = new ClientsRepository()
