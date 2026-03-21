"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, RefreshCw, Search, Layers } from "lucide-react"
import Link from "next/link"

type Service = {
  id: number
  name: string
  vendor: string | null
  category: string | null
  cost: number
  currency: string | null
  billingCycle: string
  status: string
  renewalDate: string | null
}

function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n) }
function fmtDate(d: string | null | undefined) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  canceled: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

const CYCLE_LABELS: Record<string, string> = {
  weekly: "Weekly", monthly: "Monthly", quarterly: "Quarterly",
  yearly: "Yearly", one_time: "One time",
}

export default function ServicesPage() {
  const getAccessToken = useAccessToken()
  const [result, setResult] = useState<{ data: Service[]; total: number; page: number; lastPage: number } | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)

  const load = useCallback(async (p = 1, s = search, st = statusFilter) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p) })
      if (s) params.set("search", s)
      if (st) params.set("status", st)
      const data = await authenticatedFetch(`/api/admin/control/services?${params}`, getAccessToken)
      setResult(data)
    } finally { setLoading(false) }
  }, [getAccessToken, search, statusFilter])

  useEffect(() => { load() }, [load])

  function applyFilters() { setPage(1); load(1, search, statusFilter) }

  async function handleDelete() {
    if (!deleteTarget) return
    await authenticatedFetch(`/api/admin/control/services/${deleteTarget.id}`, getAccessToken, { method: "DELETE" })
    setDeleteTarget(null)
    load()
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-purple-400" />
          <h1 className="text-xl font-bold text-white">Services</h1>
          {result && <span className="text-slate-500 text-sm">({result.total})</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => load()} className="text-slate-400"><RefreshCw className="h-4 w-4" /></Button>
          <Button size="sm" asChild className="bg-purple-700 hover:bg-purple-800 text-white">
            <Link href="/admin/control/services/new"><Plus className="h-4 w-4 mr-1" />Add service</Link>
          </Button>
        </div>
      </div>

      {/* Filters — mirrors ServiceController::index() search by name OR vendor, filter by status */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search by name or vendor…"
            className="bg-slate-900 border-slate-700 text-white pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); load(1, search, v === "all" ? "" : v) }}>
          <SelectTrigger className="bg-slate-900 border-slate-700 text-white w-40"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-slate-400">All statuses</SelectItem>
            <SelectItem value="active" className="text-white">Active</SelectItem>
            <SelectItem value="paused" className="text-white">Paused</SelectItem>
            <SelectItem value="canceled" className="text-white">Canceled</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={applyFilters} className="bg-slate-700 hover:bg-slate-600 text-white">Filter</Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32"><RefreshCw className="h-5 w-5 text-slate-500 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Vendor</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Cycle</TableHead>
                  <TableHead className="text-slate-400">Renewal</TableHead>
                  <TableHead className="text-slate-400 text-right">Cost</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.data.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-slate-500 py-10">No services found.</TableCell></TableRow>
                )}
                {result?.data.map((s) => (
                  <TableRow key={s.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="text-white font-medium">{s.name}</TableCell>
                    <TableCell className="text-slate-400">{s.vendor ?? "—"}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[s.status] ?? ""}>{s.status}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">{CYCLE_LABELS[s.billingCycle] ?? s.billingCycle}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{fmtDate(s.renewalDate)}</TableCell>
                    <TableCell className="text-right text-white font-medium">{fmt(s.cost)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="h-7 w-7 text-slate-400 hover:text-white">
                          <Link href={`/admin/control/services/${s.id}/edit`}><Pencil className="h-3.5 w-3.5" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-400" onClick={() => setDeleteTarget(s)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {result && result.lastPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="sm" disabled={page <= 1} className="text-slate-400" onClick={() => { setPage(page - 1); load(page - 1) }}>Previous</Button>
          <span className="text-slate-500 text-sm">Page {page} of {result.lastPage}</span>
          <Button variant="ghost" size="sm" disabled={page >= result.lastPage} className="text-slate-400" onClick={() => { setPage(page + 1); load(page + 1) }}>Next</Button>
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete service?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">&quot;{deleteTarget?.name}&quot; will be permanently deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-300">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
