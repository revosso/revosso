import { withAdminAuth } from "@/lib/api-auth"
import { suppliersService } from "@/lib/services/control-suppliers"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(255).trim(),
  email: z.union([z.string().email(), z.literal(""), z.null()]).optional(),
  phone: z.string().max(80).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
})

export const GET = withAdminAuth(async () => {
  const data = await suppliersService.listAll()
  return NextResponse.json({ data })
})

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  const row = await suppliersService.create({
    name: d.name,
    email: d.email && typeof d.email === "string" && d.email.length > 0 ? d.email : null,
    phone: d.phone ?? null,
    notes: d.notes ?? null,
  })
  return NextResponse.json(row, { status: 201 })
})
