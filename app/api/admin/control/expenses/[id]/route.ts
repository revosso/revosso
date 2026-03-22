import { withAdminAuth } from "@/lib/api-auth"
import { expensesService } from "@/lib/services/control-expenses"
import { resolveExpenseWrite } from "@/lib/control-transaction-resolve"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  description: z.string().min(1).optional(),
  amount: z.coerce.number().min(0).optional(),
  paidTo: z.string().optional().nullable(),
  supplierId: z.union([z.coerce.number().int().positive(), z.null()]).optional(),
  categoryId: z.union([z.coerce.number().int().positive(), z.null()]).optional(),
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
  const current = await expensesService.findById(Number(id))
  if (!current) return NextResponse.json({ message: "Not found" }, { status: 404 })

  let supplierId = current.supplierId ?? null
  let categoryId = current.categoryId ?? null
  let paidTo: string | null = current.paidTo

  if (d.supplierId !== undefined) supplierId = d.supplierId
  if (d.categoryId !== undefined) categoryId = d.categoryId
  if (d.paidTo !== undefined) {
    paidTo = d.paidTo
    if (d.supplierId === undefined) supplierId = null
  }

  const resolved = await resolveExpenseWrite({ supplierId, categoryId, paidTo })
  if (!resolved.ok) {
    const field =
      resolved.code === "invalid_supplier"
        ? "supplierId"
        : resolved.code === "invalid_category"
          ? "categoryId"
          : "paidTo"
    return NextResponse.json(
      { errors: { fieldErrors: { [field]: ["Invalid or missing value"] } } },
      { status: 422 },
    )
  }

  const data: Record<string, unknown> = {
    paidTo: resolved.paidTo,
    supplierId: resolved.supplierId,
    categoryId: resolved.categoryId,
  }
  if (d.description !== undefined) data.description = d.description
  if (d.amount !== undefined) data.amount = d.amount
  if (d.date) data.date = new Date(d.date)
  if (d.note !== undefined) data.note = d.note

  const expense = await expensesService.update(Number(id), data as never)
  return NextResponse.json(expense)
})

export const DELETE = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  await expensesService.delete(Number(id))
  return NextResponse.json({ message: "Deleted" })
})
