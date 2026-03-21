"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Pencil, RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

type ProjectDetail = {
  id: number
  name: string
  description: string | null
  budget: number | null
  status: string
  priority: string
  progressPercent: number | null
  owner: string | null
  startDate: string
  expectedEndDate: string | null
  actualEndDate: string | null
  lastUpdateAt: string | null
  totalIncome: number
  totalExpense: number
  net: number
  updates: Array<{ id: number; note: string; createdAt: string; createdBy: string | null }>
}

const STATUS_COLORS: Record<string, string> = {
  in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  delayed: "bg-red-500/10 text-red-400 border-red-500/20",
  stopped: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}
function fmtDate(d: string | null | undefined) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function ProjectShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const getAccessToken = useAccessToken()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const p = await authenticatedFetch(`/api/admin/control/projects/${id}`, getAccessToken)
      setProject(p)
    } catch {
      setError("Project not found or failed to load")
    } finally {
      setLoading(false)
    }
  }, [id, getAccessToken])

  useEffect(() => { load() }, [load])

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="h-6 w-6 text-slate-500 animate-spin" /></div>
  if (error || !project) return <div className="p-8 text-red-400">{error ?? "Not found"}</div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="text-slate-400">
            <Link href="/admin/control/projects"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
          </Button>
          <h1 className="text-xl font-bold text-white">{project.name}</h1>
          <Badge className={STATUS_COLORS[project.status] ?? ""}>{project.status.replace("_", " ")}</Badge>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-slate-400 hover:text-white">
          <Link href={`/admin/control/projects/${id}/edit`}><Pencil className="h-4 w-4 mr-1" />Edit</Link>
        </Button>
      </div>

      {/* Info grid */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              { label: "Priority", value: project.priority },
              { label: "Progress", value: `${project.progressPercent ?? 0}%` },
              { label: "Owner", value: project.owner ?? "—" },
              { label: "Start date", value: fmtDate(project.startDate) },
              { label: "Expected end", value: fmtDate(project.expectedEndDate) },
              { label: "Actual end", value: fmtDate(project.actualEndDate) },
              { label: "Last update", value: fmtDate(project.lastUpdateAt) },
              { label: "Budget", value: project.budget != null ? fmt(project.budget) : "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-slate-500 text-xs">{label}</p>
                <p className="text-white mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          {project.description && (
            <p className="text-slate-400 text-sm mt-4 pt-4 border-t border-slate-800">{project.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Financial summary — mirrors ProjectController::show() loading incomes + expenses */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-400 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />Total income
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-xl font-bold text-emerald-400">{fmt(project.totalIncome)}</p></CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-400 flex items-center gap-1">
              <TrendingDown className="h-3.5 w-3.5" />Total expense
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-xl font-bold text-red-400">{fmt(project.totalExpense)}</p></CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-400">Net</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-xl font-bold ${project.net >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {fmt(project.net)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project updates */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-white">Project updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {project.updates.length === 0 && <p className="text-slate-500 text-sm">No updates yet.</p>}
          {project.updates.map((u) => (
            <div key={u.id} className="border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
              <p className="text-white text-sm">{u.note}</p>
              <p className="text-slate-600 text-xs mt-1">{fmtDate(u.createdAt)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
