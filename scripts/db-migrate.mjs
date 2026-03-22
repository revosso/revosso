/**
 * Runs Drizzle migrations against Turso/libSQL before the app serves traffic.
 * Used by `pnpm start` (see package.json).
 *
 * Env: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN (same as drizzle.config.ts).
 * Optional: SKIP_DB_MIGRATE_ON_START=1 to skip (e.g. external migration job).
 * Loads `.env` from cwd when present (override: true), matching drizzle-kit.
 */
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"

const envPath = resolve(process.cwd(), ".env")
if (existsSync(envPath)) {
  const dotenv = await import("dotenv")
  dotenv.config({ path: envPath, override: true })
}

if (process.env.SKIP_DB_MIGRATE_ON_START === "1") {
  console.log("[db-migrate] SKIP_DB_MIGRATE_ON_START=1 — skipping migrations")
  process.exit(0)
}

const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url || !authToken) {
  console.error(
    "[db-migrate] Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN. Set them in the environment or .env before start.",
  )
  process.exit(1)
}

const migrationsFolder = resolve(process.cwd(), "drizzle")
if (!existsSync(migrationsFolder)) {
  console.error(
    `[db-migrate] Migrations folder not found: ${migrationsFolder}. Run pnpm db:generate first.`,
  )
  process.exit(1)
}

const client = createClient({ url, authToken })
const db = drizzle(client)

try {
  await migrate(db, { migrationsFolder })
  console.log("[db-migrate] Migrations applied (or already up to date).")
} catch (err) {
  console.error("[db-migrate] Migration failed:", err)
  process.exit(1)
} finally {
  client.close()
}
