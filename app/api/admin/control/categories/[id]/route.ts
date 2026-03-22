import { withAdminAuth } from "@/lib/api-auth"
import { categoriesService } from "@/lib/services/control-categories"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(120).trim().optional(),
})

type Ctx = { params: Promise<{ id: string }> }

export const GET = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const row = await categoriesService.findById(Number(id))
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json(row)
})

export const PATCH = withAdminAuth(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  try {
    const row = await categoriesService.update(Number(id), parsed.data)
    return NextResponse.json(row)
  } catch {
    return NextResponse.json({ message: "Name may already exist." }, { status: 409 })
  }
})

export const DELETE = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  try {
    await categoriesService.delete(Number(id))
    return NextResponse.json({ message: "Deleted" })
  } catch {
    return NextResponse.json({ message: "Cannot delete: in use or not found." }, { status: 409 })
  }
})
