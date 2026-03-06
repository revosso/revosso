import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Revosso Admin",
  robots: { index: false, follow: false },
}

/**
 * Dashboard Layout
 *
 * Accessible via: manage.revosso.com / manage.revosso.local
 * All routes under this layout require admin authentication.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning prevents false-positive warnings from browser
  // security extensions (e.g. Bitdefender, Kaspersky) that inject attributes
  // like `bis_skin_checked` into div elements after server-side rendering.
  return (
    <div className="min-h-screen bg-slate-950" suppressHydrationWarning>
      {children}
    </div>
  );
}
