import { withAdminAuth } from "@/lib/api-auth"
import { clientsService } from "@/lib/services/control-clients"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(255).trim().optional(),
  email: z.union([z.string().email(), z.literal(""), z.null()]).optional(),
  phone: z.string().max(80).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
})

type Ctx = { params: Promise<{ id: string }> }

export const GET = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const row = await clientsService.findById(Number(id))
  if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json(row)
})

export const PATCH = withAdminAuth(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  const payload: Record<string, unknown> = { ...d }
  if (d.email === "") payload.email = null
  const row = await clientsService.update(Number(id), payload as never)
  return NextResponse.json(row)
})

export const DELETE = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  try {
    await clientsService.delete(Number(id))
    return NextResponse.json({ message: "Deleted" })
  } catch {
    return NextResponse.json({ message: "Cannot delete: in use." }, { status: 409 })
  }
})
