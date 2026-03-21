import { withAdminAuth } from "@/lib/api-auth"
import { debtsService } from "@/lib/services/control-debts"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Statuses from Debt model (not the buggy StoreDebtRequest): open|partial|paid|canceled
const schema = z.object({
  debtorName: z.string().min(1).max(255),
  contact: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  amount: z.coerce.number().min(0),
  paidAmount: z.coerce.number().min(0).optional(),
  currency: z.string().max(10).optional(),
  dueDate: z.string().optional().nullable(),
  status: z.enum(["open", "partial", "paid", "canceled"]),
  notes: z.string().optional().nullable(),
  lastContactedAt: z.string().optional().nullable(),
})

export const GET = withAdminAuth(async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1)
  const search = req.nextUrl.searchParams.get("search") ?? undefined
  const status = req.nextUrl.searchParams.get("status") ?? undefined
  return NextResponse.json(await debtsService.paginate(page, search, status))
})

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  const debt = await debtsService.create({
    debtorName: d.debtorName,
    contact: d.contact ?? null,
    description: d.description ?? null,
    amount: d.amount,
    paidAmount: d.paidAmount ?? 0,
    currency: d.currency ?? "USD",
    dueDate: d.dueDate ? new Date(d.dueDate) : null,
    status: d.status,
    notes: d.notes ?? null,
    lastContactedAt: d.lastContactedAt ? new Date(d.lastContactedAt) : null,
  })
  return NextResponse.json(debt, { status: 201 })
})
