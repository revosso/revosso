"use client"

import { useCallback, useEffect, useState } from "react"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"

export type MasterCategory = { id: number; name: string }
export type MasterClient = { id: number; name: string; email: string | null; phone: string | null }
export type MasterSupplier = { id: number; name: string; email: string | null; phone: string | null }

export function useControlMasterLists() {
  const getAccessToken = useAccessToken()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<MasterCategory[]>([])
  const [clients, setClients] = useState<MasterClient[]>([])
  const [suppliers, setSuppliers] = useState<MasterSupplier[]>([])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const d = await authenticatedFetch("/api/admin/control/master-lists", getAccessToken)
      setCategories(d.categories ?? [])
      setClients(d.clients ?? [])
      setSuppliers(d.suppliers ?? [])
    } finally {
      setLoading(false)
    }
  }, [getAccessToken])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { loading, categories, clients, suppliers, refresh }
}
