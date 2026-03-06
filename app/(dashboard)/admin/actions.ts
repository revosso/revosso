"use server"

import { requireAuth } from "@/lib/auth"
import { leadsService } from "@/lib/services/leads-service"
import type { Lead } from "@/lib/schema"

/**
 * Server Actions for Admin Lead Management
 * 
 * These actions allow admin pages to interact with the lead system
 * without direct database access. All actions require authentication
 * and validate the Auth0 audience.
 * 
 * Architecture: UI -> Server Actions -> Service Layer -> Repository -> Database
 */

export async function getLeadsAction(): Promise<Lead[]> {
  try {
    // Require authentication with audience validation
    await requireAuth()
    return await leadsService.getAllLeads()
  } catch (error) {
    console.error("Failed to fetch leads:", error)
    throw new Error("Failed to fetch leads")
  }
}

export async function getLeadByIdAction(id: string): Promise<Lead | undefined> {
  try {
    await requireAuth()
    return await leadsService.getLeadById(id)
  } catch (error) {
    console.error(`Failed to fetch lead ${id}:`, error)
    throw new Error("Failed to fetch lead")
  }
}

export async function updateLeadStatusAction(
  id: string,
  status: "new" | "contacted" | "qualified" | "closed"
): Promise<void> {
  try {
    await requireAuth()
    await leadsService.updateLeadStatus(id, status)
  } catch (error) {
    console.error(`Failed to update lead ${id} status:`, error)
    throw new Error("Failed to update lead status")
  }
}

export async function getLeadsByStatusAction(status: string): Promise<Lead[]> {
  try {
    await requireAuth()
    return await leadsService.getLeadsByStatus(status)
  } catch (error) {
    console.error(`Failed to fetch leads by status:`, error)
    throw new Error("Failed to fetch leads by status")
  }
}

export async function getLeadsByProductAction(productInterest: string): Promise<Lead[]> {
  try {
    await requireAuth()
    return await leadsService.getLeadsByProduct(productInterest)
  } catch (error) {
    console.error(`Failed to fetch leads by product:`, error)
    throw new Error("Failed to fetch leads by product")
  }
}
