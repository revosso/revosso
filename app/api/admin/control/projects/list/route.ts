import { withAdminAuth } from "@/lib/api-auth"
import { projectsService } from "@/lib/services/control-projects"
import { NextResponse } from "next/server"

/** Returns minimal project list for dropdowns in income/expense forms */
export const GET = withAdminAuth(async () => {
  const projects = await projectsService.getProjects()
  return NextResponse.json(projects)
})
