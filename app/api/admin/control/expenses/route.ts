import { withAdminAuth } from "@/lib/api-auth"
import { expensesService } from "@/lib/services/control-expenses"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  description: z.string().min(1),
  amount: z.coerce.number().min(0),
  paidTo: z.string().min(1),
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
  const expense = await expensesService.create({
    description: d.description,
    amount: d.amount,
    paidTo: d.paidTo,
    date: new Date(d.date),
    note: d.note ?? null,
  })
  return NextResponse.json(expense, { status: 201 })
})
