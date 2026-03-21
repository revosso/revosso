"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

function toDateInput(d: string | null | undefined) {
  if (!d) return ""
  return new Date(d).toISOString().split("T")[0]
}

export default function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const getAccessToken = useAccessToken()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [form, setForm] = useState({ description: "", amount: "", paidTo: "", date: "", note: "" })

  function set(k: keyof typeof form, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  useEffect(() => {
    async function load() {
      const e = await authenticatedFetch(`/api/admin/control/expenses/${id}`, getAccessToken)
      setForm({
        description: e.description ?? "",
        amount: String(e.amount ?? ""),
        paidTo: e.paidTo ?? "",
        date: toDateInput(e.date),
        note: e.note ?? "",
      })
      setLoading(false)
    }
    load()
  }, [id, getAccessToken])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const res = await authenticatedFetch(`/api/admin/control/expenses/${id}`, getAccessToken, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description,
          amount: Number(form.amount),
          paidTo: form.paidTo,
          date: form.date,
          note: form.note || null,
        }),
        raw: true,
      })
      const body = await res.json().catch(() => ({}))
      if (res.status === 422) { setErrors(body.errors?.fieldErrors ?? {}); return }
      if (!res.ok) throw new Error("Failed")
      router.push("/admin/control/expenses")
    } catch { setErrors({ description: ["An unexpected error occurred."] }) } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="h-6 w-6 text-slate-500 animate-spin" /></div>

  return (
    <div className="p-6 max-w-xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="text-slate-400">
          <Link href="/admin/control/expenses"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
        </Button>
        <h1 className="text-xl font-bold text-white">Edit expense</h1>
      </div>
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-sm text-slate-300">Expense details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300">Description *</Label>
              <Input value={form.description} onChange={(e) => set("description", e.target.value)} className="bg-slate-800 border-slate-700 text-white" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300">Amount *</Label>
                <Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => set("amount", e.target.value)} className="bg-slate-800 border-slate-700 text-white" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Date *</Label>
                <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="bg-slate-800 border-slate-700 text-white" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300">Paid to *</Label>
              <Input value={form.paidTo} onChange={(e) => set("paidTo", e.target.value)} className="bg-slate-800 border-slate-700 text-white" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300">Note</Label>
              <Textarea value={form.note} onChange={(e) => set("note", e.target.value)} className="bg-slate-800 border-slate-700 text-white" rows={2} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-red-700 hover:bg-red-800 text-white">{saving ? "Saving…" : "Save changes"}</Button>
              <Button type="button" variant="ghost" asChild className="text-slate-400"><Link href="/admin/control/expenses">Cancel</Link></Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
