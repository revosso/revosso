import type React from "react"
import type { Metadata } from "next"
import { AdminShell } from "./admin-shell"

export const metadata: Metadata = {
  title: "Tableau de Bord Admin Ekonomi | Revosso",
  description: "Tableau de bord administrateur pour Ekonomi - Plateforme de Gestion Financière par Revosso",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
