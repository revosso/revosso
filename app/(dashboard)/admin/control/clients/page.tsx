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
import { Plus, Pencil, Trash2, RefreshCw, UserCircle } from "lucide-react"
import Link from "next/link"

type Row = { id: number; name: string; email: string | null; phone: string | null }

export default function ClientsPage() {
  const getAccessToken = useAccessToken()
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [adding, setAdding] = useState(false)
  const [del, setDel] = useState<Row | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await authenticatedFetch("/api/admin/control/clients", getAccessToken)
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
    if (!form.name.trim()) return
    setAdding(true)
    try {
      const res = await authenticatedFetch("/api/admin/control/clients", getAccessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          notes: null,
        }),
        raw: true,
      })
      if (res.ok) {
        setForm({ name: "", email: "", phone: "" })
        load()
      }
    } finally {
      setAdding(false)
    }
  }

  async function remove() {
    if (!del) return
    await authenticatedFetch(`/api/admin/control/clients/${del.id}`, getAccessToken, { method: "DELETE" })
    setDel(null)
    load()
  }

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Clients</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => load()} className="text-slate-400">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <p className="text-slate-500 text-sm">Select a client when recording income (who paid).</p>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300">Add client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Name *"
              className="bg-slate-800 border-slate-700 text-white sm:col-span-2"
              required
            />
            <Input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Email"
              className="bg-slate-800 border-slate-700 text-white"
            />
            <div className="flex gap-2">
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="Phone"
                className="bg-slate-800 border-slate-700 text-white flex-1"
              />
              <Button type="submit" disabled={adding} className="bg-cyan-600 hover:bg-cyan-700 text-white shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Email</TableHead>
                  <TableHead className="text-slate-400">Phone</TableHead>
                  <TableHead className="text-slate-400 text-right w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                      No clients yet.
                    </TableCell>
                  </TableRow>
                )}
                {rows.map((r) => (
                  <TableRow key={r.id} className="border-slate-800">
                    <TableCell className="text-white font-medium">{r.name}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{r.email || "-"}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{r.phone || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400">
                        <Link href={`/admin/control/clients/${r.id}/edit`}>
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
            <AlertDialogTitle className="text-white">Delete client?</AlertDialogTitle>
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
