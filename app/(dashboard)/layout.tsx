import type React from "react"

/**
 * Dashboard Layout
 * 
 * This layout is used for the internal management dashboard.
 * Accessible via: manage.revosso.com and manage.revosso.local
 * 
 * All routes under this layout require authentication.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
