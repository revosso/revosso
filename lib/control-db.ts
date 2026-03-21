import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import type { LibSQLDatabase } from "drizzle-orm/libsql"
import * as controlSchema from "./control-schema"

let _db: LibSQLDatabase<typeof controlSchema> | null = null

function initializeDb() {
  if (!process.env.TURSO_DATABASE_URL) throw new Error("TURSO_DATABASE_URL is required")
  if (!process.env.TURSO_AUTH_TOKEN) throw new Error("TURSO_AUTH_TOKEN is required")

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  return drizzle(client, { schema: controlSchema })
}

export const controlDb = new Proxy({} as LibSQLDatabase<typeof controlSchema>, {
  get(_, prop) {
    if (!_db) _db = initializeDb()
    return _db[prop as keyof typeof _db]
  },
})
