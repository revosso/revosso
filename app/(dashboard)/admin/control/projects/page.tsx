"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Eye, RefreshCw, FolderKanban } from "lucide-react"
import Link from "next/link"

type Project = {
  id: number
  name: string
  status: string
  priority: string
  progressPercent: number | null
  owner: string | null
  startDate: string
  expectedEndDate: string | null
  updatedAt: string
}

type Page<T> = { data: T[]; total: number; page: number; lastPage: number }

const STATUS_COLORS: Record<string, string> = {
  in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  delayed: "bg-red-500/10 text-red-400 border-red-500/20",
  stopped: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
}
const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
}

function fmtDate(d: string | null | undefined) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function ProjectsPage() {
  const getAccessToken = useAccessToken()
  const [result, setResult] = useState<Page<Project> | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const load = useCallback(async (p = page) => {
    setLoading(true)
    try {
      const data = await authenticatedFetch(`/api/admin/control/projects?page=${p}`, getAccessToken)
      setResult(data)
    } finally {
      setLoading(false)
    }
  }, [getAccessToken, page])

  useEffect(() => { load() }, [load])

  async function handleDelete() {
    if (!deleteTarget) return
    await authenticatedFetch(`/api/admin/control/projects/${deleteTarget.id}`, getAccessToken, { method: "DELETE" })
    setDeleteTarget(null)
    load()
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-slate-400" />
          <h1 className="text-xl font-bold text-white">Projects</h1>
          {result && <span className="text-slate-500 text-sm">({result.total})</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => load()} className="text-slate-400 hover:text-white">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/admin/control/projects/new"><Plus className="h-4 w-4 mr-1" />Add project</Link>
          </Button>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-5 w-5 text-slate-500 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Priority</TableHead>
                  <TableHead className="text-slate-400">Progress</TableHead>
                  <TableHead className="text-slate-400">Owner</TableHead>
                  <TableHead className="text-slate-400">Start date</TableHead>
                  <TableHead className="text-slate-400">Expected end</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-slate-500 py-10">No projects yet.</TableCell>
                  </TableRow>
                )}
                {result?.data.map((p) => (
                  <TableRow key={p.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="text-white font-medium">{p.name}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[p.status] ?? ""}>
                        {p.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={PRIORITY_COLORS[p.priority] ?? ""}>{p.priority}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{p.progressPercent ?? 0}%</TableCell>
                    <TableCell className="text-slate-400">{p.owner ?? "—"}</TableCell>
                    <TableCell className="text-slate-400">{fmtDate(p.startDate)}</TableCell>
                    <TableCell className="text-slate-400">{fmtDate(p.expectedEndDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="h-7 w-7 text-slate-400 hover:text-white">
                          <Link href={`/admin/control/projects/${p.id}`}><Eye className="h-3.5 w-3.5" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild className="h-7 w-7 text-slate-400 hover:text-white">
                          <Link href={`/admin/control/projects/${p.id}/edit`}><Pencil className="h-3.5 w-3.5" /></Link>
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="h-7 w-7 text-slate-500 hover:text-red-400"
                          onClick={() => setDeleteTarget(p)}
                        >
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

      {/* Pagination */}
      {result && result.lastPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost" size="sm" disabled={page <= 1} className="text-slate-400"
            onClick={() => { setPage(page - 1); load(page - 1) }}
          >Previous</Button>
          <span className="text-slate-500 text-sm">Page {page} of {result.lastPage}</span>
          <Button
            variant="ghost" size="sm" disabled={page >= result.lastPage} className="text-slate-400"
            onClick={() => { setPage(page + 1); load(page + 1) }}
          >Next</Button>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete project?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              &quot;{deleteTarget?.name}&quot; will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-300">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
