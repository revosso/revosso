import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import type { LibSQLDatabase } from "drizzle-orm/libsql"
import * as schema from "./schema"

let _db: LibSQLDatabase<typeof schema> | null = null

function initializeDb() {
  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error("TURSO_DATABASE_URL environment variable is required")
  }

  if (!process.env.TURSO_AUTH_TOKEN) {
    throw new Error("TURSO_AUTH_TOKEN environment variable is required")
  }

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  return drizzle(client, { schema })
}

export const db = new Proxy({} as LibSQLDatabase<typeof schema>, {
  get(_, prop) {
    if (!_db) {
      _db = initializeDb()
    }
    return _db[prop as keyof typeof _db]
  }
})

