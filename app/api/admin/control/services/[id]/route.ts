import { withAdminAuth } from "@/lib/api-auth"
import { contractedService } from "@/lib/services/control-contracted"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(255).optional(),
  vendor: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  cost: z.coerce.number().min(0).optional(),
  currency: z.string().max(10).optional(),
  billingCycle: z.enum(["weekly", "monthly", "quarterly", "yearly", "one_time"]).optional(),
  billingDay: z.coerce.number().min(1).max(31).optional().nullable(),
  renewalDate: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  status: z.enum(["active", "paused", "canceled"]).optional(),
  notes: z.string().optional().nullable(),
})

type Ctx = { params: Promise<{ id: string }> }

export const GET = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const service = await contractedService.findById(Number(id))
  if (!service) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json(service)
})

export const PATCH = withAdminAuth(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  const data: Record<string, unknown> = { ...d }
  if (d.renewalDate !== undefined) data.renewalDate = d.renewalDate ? new Date(d.renewalDate) : null
  if (d.startDate !== undefined) data.startDate = d.startDate ? new Date(d.startDate) : null
  if (d.endDate !== undefined) data.endDate = d.endDate ? new Date(d.endDate) : null
  const service = await contractedService.update(Number(id), data as never)
  return NextResponse.json(service)
})

export const DELETE = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  await contractedService.delete(Number(id))
  return NextResponse.json({ message: "Deleted" })
})
