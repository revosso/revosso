import { categoriesService } from "@/lib/services/control-categories"
import { clientsService } from "@/lib/services/control-clients"
import { suppliersService } from "@/lib/services/control-suppliers"

export async function resolveIncomeWrite(input: {
  clientId?: number | null
  categoryId?: number | null
  receivedFrom?: string | null
}): Promise<
  | { ok: true; receivedFrom: string; clientId: number | null; categoryId: number | null }
  | { ok: false; code: "invalid_client" | "invalid_category" | "received_from_required" }
> {
  let clientId = input.clientId ?? null
  let categoryId = input.categoryId ?? null
  let receivedFrom = (input.receivedFrom ?? "").trim()

  if (clientId != null) {
    const c = await clientsService.findById(clientId)
    if (!c) return { ok: false, code: "invalid_client" }
    receivedFrom = c.name
  }

  if (categoryId != null) {
    const cat = await categoriesService.findById(categoryId)
    if (!cat) return { ok: false, code: "invalid_category" }
  }

  if (!receivedFrom) return { ok: false, code: "received_from_required" }

  return { ok: true, receivedFrom, clientId, categoryId }
}

export async function resolveExpenseWrite(input: {
  supplierId?: number | null
  categoryId?: number | null
  paidTo?: string | null
}): Promise<
  | { ok: true; paidTo: string; supplierId: number | null; categoryId: number | null }
  | { ok: false; code: "invalid_supplier" | "invalid_category" | "paid_to_required" }
> {
  let supplierId = input.supplierId ?? null
  let categoryId = input.categoryId ?? null
  let paidTo = (input.paidTo ?? "").trim()

  if (supplierId != null) {
    const s = await suppliersService.findById(supplierId)
    if (!s) return { ok: false, code: "invalid_supplier" }
    paidTo = s.name
  }

  if (categoryId != null) {
    const cat = await categoriesService.findById(categoryId)
    if (!cat) return { ok: false, code: "invalid_category" }
  }

  if (!paidTo) return { ok: false, code: "paid_to_required" }

  return { ok: true, paidTo, supplierId, categoryId }
}

export async function resolveServiceVendorCategory(input: {
  supplierId?: number | null
  categoryId?: number | null
  vendor?: string | null
  category?: string | null
}): Promise<
  | { ok: true; vendor: string | null; category: string | null; supplierId: number | null; categoryId: number | null }
  | { ok: false; code: "invalid_supplier" | "invalid_category" }
> {
  let supplierId = input.supplierId ?? null
  let categoryId = input.categoryId ?? null
  let vendor = input.vendor ?? null
  let category = input.category ?? null

  if (supplierId != null) {
    const s = await suppliersService.findById(supplierId)
    if (!s) return { ok: false, code: "invalid_supplier" }
    vendor = s.name
  }

  if (categoryId != null) {
    const cat = await categoriesService.findById(categoryId)
    if (!cat) return { ok: false, code: "invalid_category" }
    category = cat.name
  }

  return { ok: true, vendor, category, supplierId, categoryId }
}
