import { withAdminAuth } from "@/lib/api-auth"
import { dashboardService } from "@/lib/services/control-dashboard"
import { NextResponse } from "next/server"

export const GET = withAdminAuth(async () => {
  const data = await dashboardService.getDashboardData()
  return NextResponse.json(data)
})
