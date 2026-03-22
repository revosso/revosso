import { withAdminAuth } from "@/lib/api-auth"
import { categoriesService } from "@/lib/services/control-categories"
import { clientsService } from "@/lib/services/control-clients"
import { suppliersService } from "@/lib/services/control-suppliers"
import { NextResponse } from "next/server"

export const GET = withAdminAuth(async () => {
  const [categories, clients, suppliers] = await Promise.all([
    categoriesService.listAll(),
    clientsService.listAll(),
    suppliersService.listAll(),
  ])
  return NextResponse.json({ categories, clients, suppliers })
})
