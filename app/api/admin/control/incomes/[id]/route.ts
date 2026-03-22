import { withAdminAuth } from "@/lib/api-auth"
import { incomesService } from "@/lib/services/control-incomes"
import { resolveIncomeWrite } from "@/lib/control-transaction-resolve"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  description: z.string().min(1).optional(),
  amount: z.coerce.number().min(0).optional(),
  receivedFrom: z.string().optional().nullable(),
  clientId: z.union([z.coerce.number().int().positive(), z.null()]).optional(),
  categoryId: z.union([z.coerce.number().int().positive(), z.null()]).optional(),
  date: z.string().optional(),
  note: z.string().optional().nullable(),
})

type Ctx = { params: Promise<{ id: string }> }

export const GET = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const income = await incomesService.findById(Number(id))
  if (!income) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json(income)
})

export const PATCH = withAdminAuth(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  const current = await incomesService.findById(Number(id))
  if (!current) return NextResponse.json({ message: "Not found" }, { status: 404 })

  let clientId = current.clientId ?? null
  let categoryId = current.categoryId ?? null
  let receivedFrom: string | null = current.receivedFrom

  if (d.clientId !== undefined) clientId = d.clientId
  if (d.categoryId !== undefined) categoryId = d.categoryId
  if (d.receivedFrom !== undefined) {
    receivedFrom = d.receivedFrom
    if (d.clientId === undefined) clientId = null
  }

  const resolved = await resolveIncomeWrite({ clientId, categoryId, receivedFrom })
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

  const data: Record<string, unknown> = {
    receivedFrom: resolved.receivedFrom,
    clientId: resolved.clientId,
    categoryId: resolved.categoryId,
  }
  if (d.description !== undefined) data.description = d.description
  if (d.amount !== undefined) data.amount = d.amount
  if (d.date) data.date = new Date(d.date)
  if (d.note !== undefined) data.note = d.note

  const income = await incomesService.update(Number(id), data as never)
  return NextResponse.json(income)
})

export const DELETE = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  await incomesService.delete(Number(id))
  return NextResponse.json({ message: "Deleted" })
})
