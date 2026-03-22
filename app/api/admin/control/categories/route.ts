import { withAdminAuth } from "@/lib/api-auth"
import { categoriesService } from "@/lib/services/control-categories"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1).max(120).trim(),
})

export const GET = withAdminAuth(async () => {
  const data = await categoriesService.listAll()
  return NextResponse.json({ data })
})

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })
  try {
    const row = await categoriesService.create({ name: parsed.data.name })
    return NextResponse.json(row, { status: 201 })
  } catch {
    return NextResponse.json({ message: "Name may already exist." }, { status: 409 })
  }
})
