import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { BarChart, Bell, Home, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"

import { Button } from "@/components/ui/button"
import { AuthNav } from "@/components/auth-buttons"

// Update the title and description
export const metadata: Metadata = {
  title: "Tableau de Bord Admin Ekonomi | Revosso",
  description: "Tableau de bord administrateur pour Ekonomi - Plateforme de Gestion Financière par Revosso",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          {/* Update the header branding */}
          <div className="flex items-center gap-2">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="inline-block font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                EKONOMI
              </span>
              <span className="text-sm text-muted-foreground">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <AuthNav />
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <div className="flex h-full flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              {/* Update the sidebar navigation */}
              <nav className="grid items-start px-2 text-sm font-medium">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Tableau de Bord
                </Link>
                <Link
                  href="/admin/messages"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <MessageSquare className="h-4 w-4" />
                  Messages de Contact
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Users className="h-4 w-4" />
                  Utilisateurs
                </Link>
                <Link
                  href="/admin/transactions"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M2 17h2.4a2 2 0 0 0 1.4-.6l7.2-7.2a2 2 0 0 1 2.8 0L21 14.4"></path>
                    <path d="M16 7h6"></path>
                    <path d="M19 4v6"></path>
                  </svg>
                  Transactions
                </Link>
                <Link
                  href="/admin/reports"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <BarChart className="h-4 w-4" />
                  Rapports
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Home className="h-4 w-4" />
                  Retour au Site
                </Link>
              </nav>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
