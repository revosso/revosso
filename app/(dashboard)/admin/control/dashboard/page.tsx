"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  AlertTriangle,
  FolderKanban,
  RefreshCw,
  Lightbulb,
  CalendarClock,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminEnterpriseIdentity } from "@/components/admin-enterprise-identity"

type ProjectDashRow = {
  id: number
  name: string
  status: string
  expectedEndDate: string | null
  lastUpdateAt: string | null
  progressPercent: number | null
  priority: string | null
  budget: number | null
}

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
  ytd_income: number
  ytd_expense: number
  ytd_net: number
  projects: {
    total: number
    delayed_count: number
    schedule_overdue_count: number
    by_status: Record<string, number>
    at_risk_projects: ProjectDashRow[]
    delayed_projects: ProjectDashRow[]
    schedule_overdue_projects: ProjectDashRow[]
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

const MONEY_VISIBILITY_KEY = "revosso-control-dashboard-show-money"

/** Plain currency (for insights text when visible). */
function formatCurrencyValue(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n)
}

/** Dashboard amounts — masked when privacy mode is on. */
function formatMoney(n: number, showMoney: boolean) {
  if (!showMoney) return "••••••"
  return formatCurrencyValue(n)
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

const PRIORITY_COLORS: Record<string, string> = {
  high: "text-red-400",
  medium: "text-amber-400",
  low: "text-slate-400",
}

function incomeExpenseBarPct(totalIncome: number, totalExpense: number) {
  const sum = totalIncome + totalExpense
  if (sum <= 0) return { incomePct: 50, expensePct: 50 }
  return {
    incomePct: Math.round((totalIncome / sum) * 1000) / 10,
    expensePct: Math.round((totalExpense / sum) * 1000) / 10,
  }
}

function buildDecisionInsights(d: DashboardData, showMoney: boolean): string[] {
  const hints: string[] = []
  const { balance, month_net, last_month_net, projects, debts, ytd_net } = d

  if (balance < 0) {
    hints.push("All-time expenses exceed income — tighten burn or plan recovery inflows.")
  } else if (balance < d.total_expense * 0.1 && d.total_expense > 0) {
    hints.push("Cash cushion is thin relative to historical spending — monitor monthly net closely.")
  }

  if (month_net < last_month_net && last_month_net > 0) {
    hints.push("This month’s net is below last month — review timing of income vs. expenses.")
  } else if (month_net < 0 && last_month_net >= 0) {
    hints.push("This month is negative while last month was not — check one-off costs or delayed receipts.")
  }

  if (ytd_net < 0) {
    hints.push("Year-to-date net is negative — prioritize margin and collections for the rest of the year.")
  }

  if (projects.delayed_count > 0) {
    hints.push(
      `${projects.delayed_count} project(s) marked delayed — renegotiate dates or reallocate capacity.`,
    )
  }
  if (projects.schedule_overdue_count > 0) {
    hints.push(
      `${projects.schedule_overdue_count} project(s) past expected end date — update plans or status.`,
    )
  }
  if (projects.at_risk_projects.length > 0 && projects.delayed_count === 0) {
    hints.push("Some active projects have stale updates — post progress to reduce delivery risk.")
  }

  if (debts.overdue_count > 0) {
    const amt = showMoney ? ` (${formatCurrencyValue(debts.overdue_total)})` : ""
    hints.push(`${debts.overdue_count} overdue receivable(s)${amt} — follow up on collection.`)
  }

  if (hints.length === 0) {
    hints.push("No critical alerts — keep logging transactions and project updates for visibility.")
  }
  return hints
}

function ProjectTable({
  rows,
  empty,
  showExpectedEnd,
}: {
  rows: ProjectDashRow[]
  empty: string
  showExpectedEnd: boolean
}) {
  if (rows.length === 0) {
    return <p className="text-slate-500 text-sm py-4">{empty}</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left text-slate-400 font-medium pb-2">Project</th>
            <th className="text-left text-slate-400 font-medium pb-2">Status</th>
            {showExpectedEnd && (
              <th className="text-left text-slate-400 font-medium pb-2">Expected end</th>
            )}
            <th className="text-left text-slate-400 font-medium pb-2">Progress</th>
            <th className="text-left text-slate-400 font-medium pb-2">Last update</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {rows.map((p) => (
            <tr key={p.id}>
              <td className="py-2 text-white font-medium">{p.name}</td>
              <td className="py-2">
                <Badge
                  className={STATUS_COLORS[p.status] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20"}
                >
                  {p.status.replace("_", " ")}
                </Badge>
              </td>
              {showExpectedEnd && (
                <td className="py-2 text-slate-400">{fmtDate(p.expectedEndDate)}</td>
              )}
              <td className="py-2 text-slate-400">
                {p.progressPercent != null ? `${p.progressPercent}%` : "—"}
                {p.priority ? (
                  <span className={`ml-2 text-xs ${PRIORITY_COLORS[p.priority] ?? "text-slate-500"}`}>
                    ({p.priority})
                  </span>
                ) : null}
              </td>
              <td className="py-2 text-slate-400">{fmtDate(p.lastUpdateAt)}</td>
              <td className="py-2">
                <Link
                  href={`/admin/control/projects/${p.id}/edit`}
                  className="text-blue-400 hover:text-blue-300 inline-flex"
                  title="Open project"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ControlDashboard() {
  const getAccessToken = useAccessToken()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMoney, setShowMoney] = useState(true)

  useEffect(() => {
    try {
      const v = localStorage.getItem(MONEY_VISIBILITY_KEY)
      if (v === "false") setShowMoney(false)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleShowMoney = useCallback(() => {
    setShowMoney((prev) => {
      const next = !prev
      try {
        localStorage.setItem(MONEY_VISIBILITY_KEY, String(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

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

  useEffect(() => {
    load()
  }, [load])

  const insights = useMemo(
    () => (data ? buildDecisionInsights(data, showMoney) : []),
    [data, showMoney],
  )
  const bar = data ? incomeExpenseBarPct(data.total_income, data.total_expense) : null

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 text-slate-500 animate-spin" />
      </div>
    )

  if (error || !data) return <div className="p-8 text-red-400">{error ?? "Failed to load"}</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm">Balances, flows, and signals for decisions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="border-slate-700 text-slate-300">
            <Link href="/admin/control/projects">All projects</Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-white shrink-0"
            onClick={toggleShowMoney}
            title={showMoney ? "Hide amounts" : "Show amounts"}
            aria-label={showMoney ? "Hide monetary amounts" : "Show monetary amounts"}
            aria-pressed={showMoney}
          >
            {showMoney ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={load} className="text-slate-400 hover:text-white">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      <AdminEnterpriseIdentity variant="banner" />

      {/* ── Financial position (actual balance + totals) ───────────────── */}
      <Card className="bg-slate-900 border-slate-800 overflow-hidden">
        <CardHeader className="pb-2 border-b border-slate-800/80">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            Financial position
          </CardTitle>
          <p className="text-xs text-slate-500 font-normal">
            Actual balance = all-time income minus all-time expenses
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Actual balance</p>
              <p
                className={`text-3xl font-bold tabular-nums select-none ${
                  showMoney
                    ? data.balance >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                    : "text-slate-400"
                }`}
              >
                {formatMoney(data.balance, showMoney)}
              </p>
              <p className="text-slate-500 text-xs mt-2 tabular-nums select-none">
                Income {formatMoney(data.total_income, showMoney)} − Expenses{" "}
                {formatMoney(data.total_expense, showMoney)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">All-time income</p>
              <p
                className={`text-2xl font-semibold tabular-nums select-none ${
                  showMoney ? "text-emerald-400" : "text-slate-400"
                }`}
              >
                {formatMoney(data.total_income, showMoney)}
              </p>
              <p className="text-slate-500 text-xs mt-2">Total recorded inflows</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">All-time expenses</p>
              <p
                className={`text-2xl font-semibold tabular-nums select-none ${
                  showMoney ? "text-red-400" : "text-slate-400"
                }`}
              >
                {formatMoney(data.total_expense, showMoney)}
              </p>
              <p className="text-slate-500 text-xs mt-2">Total recorded outflows</p>
            </div>
          </div>

          {bar && showMoney && (
            <div>
              <p className="text-xs text-slate-500 mb-1.5">Income vs expense mix (all-time totals)</p>
              <div className="h-3 rounded-full bg-slate-800 flex overflow-hidden">
                <div
                  className="h-full bg-emerald-500/80 transition-all"
                  style={{ width: `${bar.incomePct}%` }}
                  title={`Income ${bar.incomePct}%`}
                />
                <div
                  className="h-full bg-red-500/80 transition-all"
                  style={{ width: `${bar.expensePct}%` }}
                  title={`Expenses ${bar.expensePct}%`}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span className="text-emerald-500/90">{bar.incomePct}% income</span>
                <span className="text-red-500/90">{bar.expensePct}% expenses</span>
              </div>
            </div>
          )}
          {bar && !showMoney && (
            <p className="text-xs text-slate-500 py-2 rounded-lg bg-slate-800/40 px-3">
              Income / expense mix is hidden while amounts are hidden.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
            <div className="rounded-lg bg-slate-950/50 border border-slate-800 p-3">
              <p className="text-slate-500 text-xs mb-1">This month net</p>
              <p
                className={`text-lg font-semibold tabular-nums select-none ${
                  showMoney
                    ? data.month_net >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                    : "text-slate-400"
                }`}
              >
                {formatMoney(data.month_net, showMoney)}
              </p>
              <div className="flex gap-2 mt-1 text-xs tabular-nums select-none">
                <span className={showMoney ? "text-emerald-500" : "text-slate-500"}>
                  +{formatMoney(data.month_income, showMoney)}
                </span>
                <span className={showMoney ? "text-red-500" : "text-slate-500"}>
                  −{formatMoney(data.month_expense, showMoney)}
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-slate-950/50 border border-slate-800 p-3">
              <p className="text-slate-500 text-xs mb-1">Last month net</p>
              <p
                className={`text-lg font-semibold tabular-nums select-none ${
                  showMoney
                    ? data.last_month_net >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                    : "text-slate-400"
                }`}
              >
                {formatMoney(data.last_month_net, showMoney)}
              </p>
              <div className="flex gap-2 mt-1 text-xs tabular-nums select-none">
                <span className={showMoney ? "text-emerald-500" : "text-slate-500"}>
                  +{formatMoney(data.last_month_income, showMoney)}
                </span>
                <span className={showMoney ? "text-red-500" : "text-slate-500"}>
                  −{formatMoney(data.last_month_expense, showMoney)}
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-slate-950/50 border border-slate-800 p-3">
              <p className="text-slate-500 text-xs mb-1">Year-to-date net</p>
              <p
                className={`text-lg font-semibold tabular-nums select-none ${
                  showMoney ? (data.ytd_net >= 0 ? "text-emerald-400" : "text-red-400") : "text-slate-400"
                }`}
              >
                {formatMoney(data.ytd_net, showMoney)}
              </p>
              <div className="flex gap-2 mt-1 text-xs tabular-nums select-none">
                <span className={showMoney ? "text-emerald-500" : "text-slate-500"}>
                  +{formatMoney(data.ytd_income, showMoney)}
                </span>
                <span className={showMoney ? "text-red-500" : "text-slate-500"}>
                  −{formatMoney(data.ytd_expense, showMoney)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Decision insights ─────────────────────────────────────────── */}
      <Card className="bg-slate-900 border-slate-800 border-amber-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            Signals for decisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
            {insights.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* ── KPI cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-slate-400 text-xs font-medium flex items-center gap-1">
              <FolderKanban className="h-3.5 w-3.5" />
              Active pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-xl font-bold text-white">
              {(data.projects.by_status.in_progress ?? 0) + (data.projects.by_status.delayed ?? 0)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              in progress + delayed / {data.projects.total} total
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-red-950/50 border">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-red-400/90 text-xs font-medium">Delayed (status)</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-xl font-bold text-red-400">{data.projects.delayed_count}</p>
            <p className="text-xs text-slate-500 mt-0.5">Marked delayed</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-orange-950/40 border">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-orange-400/90 text-xs font-medium flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" />
              Past expected end
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-xl font-bold text-orange-400">{data.projects.schedule_overdue_count}</p>
            <p className="text-xs text-slate-500 mt-0.5">Not completed, deadline passed</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-slate-400 text-xs font-medium flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              Stale / at risk
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-xl font-bold text-amber-400">{data.projects.at_risk_projects.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Shown in list below (sample)</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Delayed projects ──────────────────────────────────────────── */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <span className="text-red-400">●</span> Delayed projects
          </CardTitle>
          <Link href="/admin/control/projects" className="text-xs text-blue-400 hover:text-blue-300">
            Manage projects →
          </Link>
        </CardHeader>
        <CardContent>
          <ProjectTable
            rows={data.projects.delayed_projects}
            empty="No projects with status “delayed”."
            showExpectedEnd
          />
        </CardContent>
      </Card>

      {/* ── Schedule overdue ─────────────────────────────────────────── */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-orange-400" />
            Past expected end date (not completed)
          </CardTitle>
          <p className="text-xs text-slate-500 font-normal">
            Helps spot slipped timelines even if status wasn’t updated to “delayed”.
          </p>
        </CardHeader>
        <CardContent>
          <ProjectTable
            rows={data.projects.schedule_overdue_projects}
            empty="No projects past their expected end date."
            showExpectedEnd
          />
        </CardContent>
      </Card>

      {/* ── At-risk projects ──────────────────────────────────────────── */}
      {data.projects.at_risk_projects.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Projects at risk (stale updates or delayed)
            </CardTitle>
            <p className="text-xs text-slate-500 font-normal">
              Non-completed projects with delayed status, no recent update, or no update in 14+ days.
            </p>
          </CardHeader>
          <CardContent>
            <ProjectTable rows={data.projects.at_risk_projects} empty="" showExpectedEnd />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── Overdue debts ───────────────────────────────────────────── */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Overdue receivables
            </CardTitle>
            <Link href="/admin/control/debts" className="text-xs text-blue-400 hover:text-blue-300">
              Debts →
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-slate-400">
                Overdue: <span className="text-amber-400 font-semibold">{data.debts.overdue_count}</span>
              </span>
              <span className="text-slate-400">
                Amount overdue:{" "}
                <span
                  className={`font-semibold tabular-nums select-none ${showMoney ? "text-amber-400" : "text-slate-400"}`}
                >
                  {formatMoney(data.debts.overdue_total, showMoney)}
                </span>
              </span>
              <span className="text-slate-400">
                Total still owed:{" "}
                <span className={`font-medium tabular-nums select-none ${showMoney ? "text-white" : "text-slate-400"}`}>
                  {formatMoney(data.debts.total_owed, showMoney)}
                </span>
              </span>
            </div>
            {data.debts.top_overdue.length === 0 ? (
              <p className="text-slate-500 text-sm">No overdue items in the top list.</p>
            ) : (
              <ul className="space-y-2 text-sm border-t border-slate-800 pt-3">
                {data.debts.top_overdue.map((d) => (
                  <li key={d.id} className="flex justify-between gap-2 items-start">
                    <div>
                      <p className="text-white">{d.debtorName}</p>
                      <p className="text-xs text-slate-500">Due {fmtDate(d.dueDate)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`font-medium tabular-nums select-none ${showMoney ? "text-amber-400" : "text-slate-400"}`}
                      >
                        {formatMoney(d.amount - d.paidAmount, showMoney)}
                      </p>
                      <Link
                        href={`/admin/control/debts/${d.id}/edit`}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Open
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* ── Upcoming service payments ───────────────────────────────── */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white">Upcoming recurring costs</CardTitle>
            <p className="text-xs text-slate-500 font-normal tabular-nums select-none">
              Monthly run-rate: {formatMoney(data.services.monthly_recurring_total, showMoney)}
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.services.next_payments.length === 0 ? (
              <p className="text-slate-500 text-sm">No upcoming billed dates for active services.</p>
            ) : (
              data.services.next_payments.slice(0, 8).map((p, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-slate-800/60 last:border-0">
                  <div>
                    <p className="text-sm text-white">{p.service.name}</p>
                    <p className="text-xs text-slate-500">{fmtDate(p.next_date)}</p>
                  </div>
                  <span className="text-sm text-slate-300 tabular-nums select-none">
                    {formatMoney(p.amount, showMoney)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                <span
                  className={`text-sm font-medium tabular-nums select-none ${
                    showMoney ? (t.type === "income" ? "text-emerald-400" : "text-red-400") : "text-slate-400"
                  }`}
                >
                  {showMoney ? (t.type === "income" ? "+" : "−") : ""}
                  {formatMoney(t.amount, showMoney)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

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
