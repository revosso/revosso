import { withAdminAuth } from "@/lib/api-auth"
import { projectsService } from "@/lib/services/control-projects"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const createSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  budget: z.coerce.number().min(0).optional(),
  status: z.enum(["stopped", "in_progress", "delayed", "completed"]),
  startDate: z.string().min(1),
  expectedEndDate: z.string().min(1),
  actualEndDate: z.string().optional(),
  progressPercent: z.coerce.number().min(0).max(100).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  owner: z.string().optional(),
})

export const GET = withAdminAuth(async (req: NextRequest) => {
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1)
  const result = await projectsService.paginate(page)
  return NextResponse.json(result)
})

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 })

  const d = parsed.data
  const project = await projectsService.create({
    name: d.name,
    description: d.description ?? null,
    budget: d.budget ?? null,
    status: d.status,
    startDate: new Date(d.startDate),
    expectedEndDate: d.expectedEndDate ? new Date(d.expectedEndDate) : null,
    actualEndDate: d.actualEndDate ? new Date(d.actualEndDate) : null,
    progressPercent: d.progressPercent ?? 0,
    priority: d.priority ?? "medium",
    owner: d.owner ?? null,
  })
  return NextResponse.json(project, { status: 201 })
})
