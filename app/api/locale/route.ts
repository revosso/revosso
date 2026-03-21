import { NextResponse } from "next/server"
import { settingsService } from "@/lib/services/control-settings"

/**
 * Public default site language (Control → Settings → `app.locale`).
 * Used by the marketing site when the visitor has not chosen a language in the UI.
 */
export async function GET() {
  try {
    const locale = await settingsService.getLocale()
    return NextResponse.json({ locale: locale ?? "en" })
  } catch {
    return NextResponse.json({ locale: "en" })
  }
}
