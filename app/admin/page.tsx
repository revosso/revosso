'use client';

import { AdminProtectedRoute } from "@/components/protected-route"
import { DashboardClient } from "./dashboard-client"

/**
 * Admin Lead Viewing Page
 * 
 * Protected by Auth0 authentication with admin role check.
 * Uses client-side authentication with JWT tokens.
 * 
 * Architecture: UI -> API Routes (with JWT validation) -> Service Layer -> Repository -> Database
 */

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <DashboardClient />
    </AdminProtectedRoute>
  )
}
