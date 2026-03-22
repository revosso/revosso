"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, RefreshCw, Tags } from "lucide-react"
import Link from "next/link"

type Row = { id: number; name: string }

export default function CategoriesPage() {
  const getAccessToken = useAccessToken()
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState("")
  const [adding, setAdding] = useState(false)
  const [del, setDel] = useState<Row | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await authenticatedFetch("/api/admin/control/categories", getAccessToken)
      setRows(r.data ?? [])
    } finally {
      setLoading(false)
    }
  }, [getAccessToken])

  useEffect(() => {
    load()
  }, [load])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    try {
      const res = await authenticatedFetch("/api/admin/control/categories", getAccessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
        raw: true,
      })
      if (res.ok) {
        setNewName("")
        load()
      }
    } finally {
      setAdding(false)
    }
  }

  async function remove() {
    if (!del) return
    await authenticatedFetch(`/api/admin/control/categories/${del.id}`, getAccessToken, { method: "DELETE" })
    setDel(null)
    load()
  }

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tags className="h-5 w-5 text-amber-400" />
          <h1 className="text-xl font-bold text-white">Categories</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => load()} className="text-slate-400">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <p className="text-slate-500 text-sm">Used when classifying incomes, expenses, and services.</p>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300">Add category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="flex gap-2 flex-wrap">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="bg-slate-800 border-slate-700 text-white flex-1 min-w-48"
            />
            <Button type="submit" disabled={adding} className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400 text-right w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-slate-500 py-8">
                      No categories yet.
                    </TableCell>
                  </TableRow>
                )}
                {rows.map((r) => (
                  <TableRow key={r.id} className="border-slate-800">
                    <TableCell className="text-white font-medium">{r.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400">
                        <Link href={`/admin/control/categories/${r.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400" onClick={() => setDel(r)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete category?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">{del?.name}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-300">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white" onClick={remove}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
