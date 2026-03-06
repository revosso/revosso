import type React from "react"
import type { Metadata } from "next"
import { AdminShell } from "./admin-shell"

export const metadata: Metadata = {
  title: "Admin Dashboard | Revosso",
  description: "Lead management and admin dashboard for Revosso.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
