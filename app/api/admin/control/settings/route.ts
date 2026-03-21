import { withAdminAuth } from "@/lib/api-auth"
import { settingsService } from "@/lib/services/control-settings"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export const GET = withAdminAuth(async () => {
  const locale = await settingsService.getLocale()
  return NextResponse.json({ locale })
})

export const PUT = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json()
  const parsed = z.object({ locale: z.enum(["fr", "en", "pt"]) }).safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  await settingsService.setLocale(parsed.data.locale)
  return NextResponse.json({ locale: parsed.data.locale })
})
