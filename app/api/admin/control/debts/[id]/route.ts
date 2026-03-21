import { withAdminAuth } from "@/lib/api-auth"
import { debtsService } from "@/lib/services/control-debts"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  debtorName: z.string().min(1).max(255).optional(),
  contact: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  amount: z.coerce.number().min(0).optional(),
  paidAmount: z.coerce.number().min(0).optional(),
  currency: z.string().max(10).optional(),
  dueDate: z.string().optional().nullable(),
  status: z.enum(["open", "partial", "paid", "canceled"]).optional(),
  notes: z.string().optional().nullable(),
  lastContactedAt: z.string().optional().nullable(),
})

type Ctx = { params: Promise<{ id: string }> }

export const GET = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const debt = await debtsService.findById(Number(id))
  if (!debt) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json(debt)
})

export const PATCH = withAdminAuth(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  const data: Record<string, unknown> = { ...d }
  if (d.dueDate !== undefined) data.dueDate = d.dueDate ? new Date(d.dueDate) : null
  if (d.lastContactedAt !== undefined) data.lastContactedAt = d.lastContactedAt ? new Date(d.lastContactedAt) : null
  const debt = await debtsService.update(Number(id), data as never)
  return NextResponse.json(debt)
})

export const DELETE = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  await debtsService.delete(Number(id))
  return NextResponse.json({ message: "Deleted" })
})
