import { withAdminAuth } from "@/lib/api-auth"
import { expensesService } from "@/lib/services/control-expenses"
import { resolveExpenseWrite } from "@/lib/control-transaction-resolve"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  description: z.string().min(1),
  amount: z.coerce.number().min(0),
  paidTo: z.string().optional().nullable(),
  supplierId: z.union([z.coerce.number().int().positive(), z.null()]).optional(),
  categoryId: z.union([z.coerce.number().int().positive(), z.null()]).optional(),
  date: z.string().min(1),
  note: z.string().optional().nullable(),
})

export const GET = withAdminAuth(async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1)
  return NextResponse.json(await expensesService.paginate(page))
})

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  const resolved = await resolveExpenseWrite({
    supplierId: d.supplierId ?? null,
    categoryId: d.categoryId ?? null,
    paidTo: d.paidTo,
  })
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
  const expense = await expensesService.create({
    description: d.description,
    amount: d.amount,
    paidTo: resolved.paidTo,
    supplierId: resolved.supplierId,
    categoryId: resolved.categoryId,
    date: new Date(d.date),
    note: d.note ?? null,
  })
  return NextResponse.json(expense, { status: 201 })
})
