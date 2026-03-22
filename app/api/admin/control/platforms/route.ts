import { withAdminAuth } from "@/lib/api-auth"
import { enterprisePlatformsService } from "@/lib/services/control-platforms"
import { normalizePlatformUrl } from "@/lib/normalize-platform-url"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().min(1).max(2048),
  category: z.string().max(120).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
})

export const GET = withAdminAuth(async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1)
  const search = req.nextUrl.searchParams.get("search") ?? undefined
  const category = req.nextUrl.searchParams.get("category") ?? undefined
  return NextResponse.json(await enterprisePlatformsService.paginate(page, search, category))
})

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  let url: string
  try {
    url = normalizePlatformUrl(d.url)
  } catch {
    return NextResponse.json(
      { errors: { fieldErrors: { url: ["Enter a valid URL (e.g. https://app.example.com)"] } } },
      { status: 422 },
    )
  }
  const platform = await enterprisePlatformsService.create({
    name: d.name,
    url,
    category: d.category ?? null,
    notes: d.notes ?? null,
    sortOrder: d.sortOrder ?? 0,
  })
  return NextResponse.json(platform, { status: 201 })
})
