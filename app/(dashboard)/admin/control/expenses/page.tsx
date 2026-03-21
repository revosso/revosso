"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, RefreshCw, TrendingDown } from "lucide-react"
import Link from "next/link"

type Expense = { id: number; description: string; amount: number; paidTo: string; date: string; note: string | null }

function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n) }
function fmtDate(d: string) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }

export default function ExpensesPage() {
  const getAccessToken = useAccessToken()
  const [result, setResult] = useState<{ data: Expense[]; total: number; page: number; lastPage: number } | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null)

  const load = useCallback(async (p = page) => {
    setLoading(true)
    try {
      const data = await authenticatedFetch(`/api/admin/control/expenses?page=${p}`, getAccessToken)
      setResult(data)
    } finally { setLoading(false) }
  }, [getAccessToken, page])

  useEffect(() => { load() }, [load])

  async function handleDelete() {
    if (!deleteTarget) return
    await authenticatedFetch(`/api/admin/control/expenses/${deleteTarget.id}`, getAccessToken, { method: "DELETE" })
    setDeleteTarget(null)
    load()
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-400" />
          <h1 className="text-xl font-bold text-white">Expenses</h1>
          {result && <span className="text-slate-500 text-sm">({result.total})</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => load()} className="text-slate-400"><RefreshCw className="h-4 w-4" /></Button>
          <Button size="sm" asChild className="bg-red-700 hover:bg-red-800 text-white">
            <Link href="/admin/control/expenses/new"><Plus className="h-4 w-4 mr-1" />Add expense</Link>
          </Button>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32"><RefreshCw className="h-5 w-5 text-slate-500 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Date</TableHead>
                  <TableHead className="text-slate-400">Description</TableHead>
                  <TableHead className="text-slate-400">Paid to</TableHead>
                  <TableHead className="text-slate-400 text-right">Amount</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.data.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-slate-500 py-10">No expenses yet.</TableCell></TableRow>
                )}
                {result?.data.map((e) => (
                  <TableRow key={e.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="text-slate-400 whitespace-nowrap">{fmtDate(e.date)}</TableCell>
                    <TableCell className="text-white">{e.description}</TableCell>
                    <TableCell className="text-slate-400">{e.paidTo}</TableCell>
                    <TableCell className="text-right text-red-400 font-medium">{fmt(e.amount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="h-7 w-7 text-slate-400 hover:text-white">
                          <Link href={`/admin/control/expenses/${e.id}/edit`}><Pencil className="h-3.5 w-3.5" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-400" onClick={() => setDeleteTarget(e)}>
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
            <AlertDialogTitle className="text-white">Delete expense?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">&quot;{deleteTarget?.description}&quot; will be permanently deleted.</AlertDialogDescription>
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
