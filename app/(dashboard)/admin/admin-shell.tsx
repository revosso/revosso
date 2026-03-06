'use client';

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Code, LayoutDashboard, ExternalLink, LogOut, Menu, X } from "lucide-react"
import { AdminProtectedRoute } from "@/components/protected-route"
import { useAuth0 } from "@/components/auth0-provider"
import { Button } from "@/components/ui/button"

const NAV_LINKS = [
  { href: "/admin", label: "Leads", icon: LayoutDashboard },
]

function SidebarNav({
  pathname,
  onLinkClick,
  user,
  logout,
}: {
  pathname: string
  onLinkClick?: () => void
  user: { name?: string | null; email?: string | null; picture?: string | null } | undefined
  logout: () => void
}) {
  const landingUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${
          window.location.hostname.replace(/^manage\./, "")
        }${window.location.port ? `:${window.location.port}` : ""}`
      : "/"

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-slate-800 flex-shrink-0">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-1.5 rounded-md">
          <Code className="h-4 w-4" />
        </div>
        <div>
          <span className="font-bold text-white text-sm">Revosso</span>
          <span className="text-slate-600 text-xs block -mt-0.5">Admin</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_LINKS.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onLinkClick}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === href
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer: back to site + user info */}
      <div className="border-t border-slate-800 px-3 py-3 space-y-1 flex-shrink-0">
        <a
          href={landingUrl}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 text-xs transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
          Back to site
        </a>
        {user && (
          <div className="flex items-center justify-between px-3 py-2 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {user.picture && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.picture}
                  alt={user.name ?? ""}
                  className="h-6 w-6 rounded-full ring-1 ring-slate-700 flex-shrink-0"
                />
              )}
              <span className="text-xs text-slate-500 truncate">{user.name ?? user.email}</span>
            </div>
            <button
              onClick={logout}
              className="text-slate-600 hover:text-red-400 transition-colors p-1 rounded flex-shrink-0"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function AdminShellInner({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth0()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-slate-800 bg-slate-950 fixed top-0 left-0 h-full z-30">
        <SidebarNav
          pathname={pathname}
          user={user}
          logout={logout}
        />
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 z-50 bg-slate-950 border-r border-slate-800 transform transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarNav
          pathname={pathname}
          onLinkClick={() => setMobileOpen(false)}
          user={user}
          logout={logout}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-1.5 rounded-md">
            <Code className="h-4 w-4" />
          </div>
          <span className="font-bold text-white text-sm">Revosso</span>
          <span className="text-slate-700 text-sm">/</span>
          <span className="text-slate-400 text-sm">Admin</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Page content */}
      <div className="flex-1 md:ml-56 pt-14 md:pt-0 min-h-screen">
        {children}
      </div>
    </div>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtectedRoute>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminProtectedRoute>
  )
}
