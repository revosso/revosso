import { withAdminAuth } from "@/lib/api-auth"
import { expensesService } from "@/lib/services/control-expenses"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  description: z.string().min(1).optional(),
  amount: z.coerce.number().min(0).optional(),
  paidTo: z.string().min(1).optional(),
  date: z.string().optional(),
  note: z.string().optional().nullable(),
})

type Ctx = { params: Promise<{ id: string }> }

export const GET = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const expense = await expensesService.findById(Number(id))
  if (!expense) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json(expense)
})

export const PATCH = withAdminAuth(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  const data: Record<string, unknown> = { ...d }
  if (d.date) data.date = new Date(d.date)
  const expense = await expensesService.update(Number(id), data as never)
  return NextResponse.json(expense)
})

export const DELETE = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  await expensesService.delete(Number(id))
  return NextResponse.json({ message: "Deleted" })
})
