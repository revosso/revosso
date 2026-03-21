import { controlDb } from "@/lib/control-db"
import { settings, type Setting } from "@/lib/control-schema"
import { eq } from "drizzle-orm"

export class SettingsRepository {
  async get(key: string, defaultValue?: string): Promise<string | undefined> {
    const [row] = await controlDb.select().from(settings).where(eq(settings.key, key))
    return row?.value ?? defaultValue
  }

  async set(key: string, value: string): Promise<void> {
    const existing = await controlDb.select().from(settings).where(eq(settings.key, key))
    if (existing.length > 0) {
      await controlDb
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, key))
    } else {
      await controlDb.insert(settings).values({ key, value })
    }
  }

  async all(): Promise<Setting[]> {
    return controlDb.select().from(settings)
  }
}

export const settingsRepository = new SettingsRepository()
