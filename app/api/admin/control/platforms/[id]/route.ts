import { withAdminAuth } from "@/lib/api-auth"
import { enterprisePlatformsService } from "@/lib/services/control-platforms"
import { normalizePlatformUrl } from "@/lib/normalize-platform-url"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(255).optional(),
  url: z.string().min(1).max(2048).optional(),
  category: z.string().max(120).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
})

type Ctx = { params: Promise<{ id: string }> }

export const GET = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const row = await enterprisePlatformsService.findById(Number(id))
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json(row)
})

export const PATCH = withAdminAuth(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  const data: Record<string, unknown> = { ...d }
  if (d.url !== undefined) {
    try {
      data.url = normalizePlatformUrl(d.url)
    } catch {
      return NextResponse.json(
        { errors: { fieldErrors: { url: ["Enter a valid URL (e.g. https://app.example.com)"] } } },
        { status: 422 },
      )
    }
  }
  const platform = await enterprisePlatformsService.update(Number(id), data as never)
  return NextResponse.json(platform)
})

export const DELETE = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  await enterprisePlatformsService.delete(Number(id))
  return NextResponse.json({ message: "Deleted" })
})
