import { withAdminAuth } from "@/lib/api-auth"
import { projectsService } from "@/lib/services/control-projects"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  budget: z.coerce.number().min(0).optional().nullable(),
  status: z.enum(["stopped", "in_progress", "delayed", "completed"]).optional(),
  startDate: z.string().optional(),
  expectedEndDate: z.string().optional().nullable(),
  actualEndDate: z.string().optional().nullable(),
  progressPercent: z.coerce.number().min(0).max(100).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  owner: z.string().optional().nullable(),
})

type Ctx = { params: Promise<{ id: string }> }

export const GET = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const project = await projectsService.findById(Number(id))
  if (!project) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json(project)
})

export const PATCH = withAdminAuth(async (req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })

  const d = parsed.data
  const data: Record<string, unknown> = { ...d }
  if (d.startDate) data.startDate = new Date(d.startDate)
  if (d.expectedEndDate) data.expectedEndDate = new Date(d.expectedEndDate)
  if (d.actualEndDate) data.actualEndDate = new Date(d.actualEndDate)

  const project = await projectsService.update(Number(id), data as never)
  return NextResponse.json(project)
})

export const DELETE = withAdminAuth(async (_req: NextRequest, ctx: Ctx) => {
  const { id } = await ctx.params
  await projectsService.delete(Number(id))
  return NextResponse.json({ message: "Deleted" })
})
