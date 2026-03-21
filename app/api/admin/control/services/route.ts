import { withAdminAuth } from "@/lib/api-auth"
import { contractedService } from "@/lib/services/control-contracted"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(255),
  vendor: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  cost: z.coerce.number().min(0),
  currency: z.string().max(10).optional(),
  billingCycle: z.enum(["weekly", "monthly", "quarterly", "yearly", "one_time"]),
  billingDay: z.coerce.number().min(1).max(31).optional().nullable(),
  renewalDate: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  status: z.enum(["active", "paused", "canceled"]),
  notes: z.string().optional().nullable(),
})

export const GET = withAdminAuth(async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1)
  const search = req.nextUrl.searchParams.get("search") ?? undefined
  const status = req.nextUrl.searchParams.get("status") ?? undefined
  return NextResponse.json(await contractedService.paginate(page, search, status))
})

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  const service = await contractedService.create({
    name: d.name,
    vendor: d.vendor ?? null,
    category: d.category ?? null,
    description: d.description ?? null,
    cost: d.cost,
    currency: d.currency ?? "USD",
    billingCycle: d.billingCycle,
    billingDay: d.billingDay ?? null,
    renewalDate: d.renewalDate ? new Date(d.renewalDate) : null,
    startDate: d.startDate ? new Date(d.startDate) : null,
    endDate: d.endDate ? new Date(d.endDate) : null,
    status: d.status,
    notes: d.notes ?? null,
  })
  return NextResponse.json(service, { status: 201 })
})
