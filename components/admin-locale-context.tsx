"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  adminTranslations,
  normalizeAdminLocale,
  type AdminLocaleCode,
  type AdminStrings,
} from "@/lib/admin-i18n"

type AdminLocaleContextValue = {
  locale: AdminLocaleCode
  t: AdminStrings
  refresh: () => Promise<void>
}

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null)

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<AdminLocaleCode>("en")

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/locale", { cache: "no-store" })
      if (r.ok) {
        const body = (await r.json()) as { locale?: string }
        setLocale(normalizeAdminLocale(body.locale))
      }
    } catch {
      /* keep current */
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      locale,
      t: adminTranslations[locale],
      refresh,
    }),
    [locale, refresh]
  )

  return <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>
}

export function useAdminLocale(): AdminLocaleContextValue {
  const ctx = useContext(AdminLocaleContext)
  if (!ctx) {
    throw new Error("useAdminLocale must be used within AdminLocaleProvider")
  }
  return ctx
}
