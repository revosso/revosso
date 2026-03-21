import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"

// Ensure `.env` wins over empty/stale vars in the parent process (drizzle-kit
// otherwise logs "injecting env (0)" and Turso gets wrong/missing credentials).
dotenv.config({ override: true })

export default defineConfig({
  schema: ["./lib/schema.ts", "./lib/control-schema.ts"],
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
})

