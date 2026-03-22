"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  FolderKanban,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminEnterpriseIdentity } from "@/components/admin-enterprise-identity"

type DashboardData = {
  balance: number
  total_income: number
  total_expense: number
  month_income: number
  month_expense: number
  month_net: number
  last_month_income: number
  last_month_expense: number
  last_month_net: number
  projects: {
    total: number
    by_status: Record<string, number>
    at_risk_projects: Array<{ id: number; name: string; status: string; lastUpdateAt: string | null }>
  }
  debts: {
    total_owed: number
    overdue_count: number
    overdue_total: number
    top_overdue: Array<{ id: number; debtorName: string; amount: number; paidAmount: number; dueDate: string }>
  }
  services: {
    monthly_recurring_total: number
    next_payments: Array<{ service: { name: string; cost: number }; next_date: string; amount: number }>
  }
  latest_transactions: Array<{ type: "income" | "expense"; date: string; description: string; amount: number; id: number }>
  latest_project_updates: Array<{ id: number; projectId: number; note: string; createdAt: string; projectName: string }>
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n)
}
function fmtDate(d: string | null | undefined) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const STATUS_COLORS: Record<string, string> = {
  in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  delayed: "bg-red-500/10 text-red-400 border-red-500/20",
  stopped: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
}

export default function ControlDashboard() {
  const getAccessToken = useAccessToken()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const d = await authenticatedFetch("/api/admin/control/dashboard", getAccessToken)
      setData(d)
    } catch {
      setError("Could not load dashboard data.")
    } finally {
      setLoading(false)
    }
  }, [getAccessToken])

  useEffect(() => { load() }, [load])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="h-6 w-6 text-slate-500 animate-spin" />
    </div>
  )

  if (error || !data) return (
    <div className="p-8 text-red-400">{error ?? "Failed to load"}</div>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm">Financial & project overview</p>
        </div>
        <Button variant="ghost" size="sm" onClick={load} className="text-slate-400 hover:text-white">
          <RefreshCw className="h-4 w-4 mr-1.5" />Refresh
        </Button>
      </div>

      <AdminEnterpriseIdentity variant="banner" />

      {/* ── Financial summary cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${data.balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {fmt(data.balance)}
            </p>
            <p className="text-slate-500 text-xs mt-1">All-time income − expense</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />This month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${data.month_net >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {fmt(data.month_net)}
            </p>
            <div className="flex gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-0.5 text-emerald-500"><ArrowUpRight className="h-3 w-3" />{fmt(data.month_income)}</span>
              <span className="flex items-center gap-0.5 text-red-500"><ArrowDownRight className="h-3 w-3" />{fmt(data.month_expense)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5" />Last month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${data.last_month_net >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {fmt(data.last_month_net)}
            </p>
            <div className="flex gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-0.5 text-emerald-500"><ArrowUpRight className="h-3 w-3" />{fmt(data.last_month_income)}</span>
              <span className="flex items-center gap-0.5 text-red-500"><ArrowDownRight className="h-3 w-3" />{fmt(data.last_month_expense)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <FolderKanban className="h-3.5 w-3.5" />Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{data.projects.total}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              {Object.entries(data.projects.by_status).map(([s, c]) => (
                <span key={s} className="text-xs text-slate-500">{s.replace("_", " ")}: <span className="text-slate-300">{c}</span></span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />Overdue debts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-400">{data.debts.overdue_count}</p>
            <p className="text-slate-500 text-xs mt-1">Total owed: {fmt(data.debts.total_owed)}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />Monthly recurring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{fmt(data.services.monthly_recurring_total)}</p>
            <p className="text-slate-500 text-xs mt-1">Active services / month</p>
          </CardContent>
        </Card>
      </div>

      {/* ── At-risk projects ────────────────────────────────────────── */}
      {data.projects.at_risk_projects.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />Projects at risk
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-400 font-medium pb-2">Project</th>
                  <th className="text-left text-slate-400 font-medium pb-2">Status</th>
                  <th className="text-left text-slate-400 font-medium pb-2">Last update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.projects.at_risk_projects.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 text-white">{p.name}</td>
                    <td className="py-2">
                      <Badge className={STATUS_COLORS[p.status] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20"}>
                        {p.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-2 text-slate-400">{fmtDate(p.lastUpdateAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── Latest transactions ────────────────────────────────────── */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm text-white">Latest transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.latest_transactions.length === 0 && (
              <p className="text-slate-500 text-sm">No transactions yet.</p>
            )}
            {data.latest_transactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm text-white">{t.description}</p>
                  <p className="text-xs text-slate-500">{fmtDate(t.date)}</p>
                </div>
                <span className={`text-sm font-medium ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                  {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── Latest project updates ─────────────────────────────────── */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm text-white">Latest project updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.latest_project_updates.length === 0 && (
              <p className="text-slate-500 text-sm">No updates yet.</p>
            )}
            {data.latest_project_updates.map((u) => (
              <div key={u.id} className="py-1.5 border-b border-slate-800/60 last:border-0">
                <p className="text-xs text-slate-400 mb-0.5">{u.projectName}</p>
                <p className="text-sm text-white">{u.note}</p>
                <p className="text-xs text-slate-600 mt-0.5">{fmtDate(u.createdAt)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
