import { withAdminAuth } from "@/lib/api-auth"
import { incomesService } from "@/lib/services/control-incomes"
import { resolveIncomeWrite } from "@/lib/control-transaction-resolve"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  description: z.string().min(1),
  amount: z.coerce.number().min(0),
  receivedFrom: z.string().optional().nullable(),
  clientId: z.union([z.coerce.number().int().positive(), z.null()]).optional(),
  categoryId: z.union([z.coerce.number().int().positive(), z.null()]).optional(),
  date: z.string().min(1),
  note: z.string().optional().nullable(),
})

export const GET = withAdminAuth(async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1)
  return NextResponse.json(await incomesService.paginate(page))
})

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  const resolved = await resolveIncomeWrite({
    clientId: d.clientId ?? null,
    categoryId: d.categoryId ?? null,
    receivedFrom: d.receivedFrom,
  })
  if (!resolved.ok) {
    const field =
      resolved.code === "invalid_client"
        ? "clientId"
        : resolved.code === "invalid_category"
          ? "categoryId"
          : "receivedFrom"
    return NextResponse.json(
      { errors: { fieldErrors: { [field]: ["Invalid or missing value"] } } },
      { status: 422 },
    )
  }
  const income = await incomesService.create({
    description: d.description,
    amount: d.amount,
    receivedFrom: resolved.receivedFrom,
    clientId: resolved.clientId,
    categoryId: resolved.categoryId,
    date: new Date(d.date),
    note: d.note ?? null,
  })
  return NextResponse.json(income, { status: 201 })
})
