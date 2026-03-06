"use server"

import { requireAuth } from "@/lib/auth"
import { leadsService } from "@/lib/services/leads-service"
import type { Lead } from "@/lib/schema"

/**
 * Server Actions for Admin Lead Management
 *
 * Architecture: UI → Server Actions → Service Layer → Repository → Database
 * All actions require admin authentication.
 */

export async function getLeadsAction(): Promise<Lead[]> {
  await requireAuth()
  return await leadsService.getAllLeads()
}

export async function getLeadByIdAction(id: string): Promise<Lead | undefined> {
  await requireAuth()
  return await leadsService.getLeadById(id)
}

export async function updateLeadStatusAction(
  id: string,
  status: "new" | "contacted" | "qualified" | "closed" | "converted"
): Promise<void> {
  await requireAuth()
  await leadsService.updateLeadStatus(id, status)
}

export async function updateLeadNotesAction(id: string, notes: string | null): Promise<void> {
  await requireAuth()
  await leadsService.updateLeadNotes(id, notes)
}

export async function deleteLeadAction(id: string): Promise<void> {
  await requireAuth()
  await leadsService.deleteLead(id)
}

export async function getLeadsByStatusAction(status: string): Promise<Lead[]> {
  await requireAuth()
  return await leadsService.getLeadsByStatus(status)
}
