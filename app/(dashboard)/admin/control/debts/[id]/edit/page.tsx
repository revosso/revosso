"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

function toDateInput(d: string | null | undefined) {
  if (!d) return ""
  return new Date(d).toISOString().split("T")[0]
}

export default function EditDebtPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const getAccessToken = useAccessToken()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [form, setForm] = useState({
    debtorName: "", contact: "", description: "", amount: "", paidAmount: "0",
    currency: "USD", dueDate: "", status: "open", notes: "",
  })

  function set(k: keyof typeof form, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  useEffect(() => {
    async function load() {
      const d = await authenticatedFetch(`/api/admin/control/debts/${id}`, getAccessToken)
      setForm({
        debtorName: d.debtorName ?? "", contact: d.contact ?? "", description: d.description ?? "",
        amount: String(d.amount ?? ""), paidAmount: String(d.paidAmount ?? 0),
        currency: d.currency ?? "USD", dueDate: toDateInput(d.dueDate),
        status: d.status ?? "open", notes: d.notes ?? "",
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
      const res = await authenticatedFetch(`/api/admin/control/debts/${id}`, getAccessToken, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          debtorName: form.debtorName, contact: form.contact || null, description: form.description || null,
          amount: Number(form.amount), paidAmount: Number(form.paidAmount),
          currency: form.currency || "USD", dueDate: form.dueDate || null,
          status: form.status, notes: form.notes || null,
        }),
        raw: true,
      })
      const body = await res.json().catch(() => ({}))
      if (res.status === 422) { setErrors(body.errors?.fieldErrors ?? {}); return }
      if (!res.ok) throw new Error("Failed")
      router.push("/admin/control/debts")
    } catch { setErrors({ debtorName: ["An unexpected error occurred."] }) } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="h-6 w-6 text-slate-500 animate-spin" /></div>

  return (
    <div className="p-6 max-w-xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="text-slate-400">
          <Link href="/admin/control/debts"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
        </Button>
        <h1 className="text-xl font-bold text-white">Edit debt</h1>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-sm text-slate-300">Debt details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-slate-300">Debtor name *</Label>
                <Input value={form.debtorName} onChange={(e) => set("debtorName", e.target.value)} className="bg-slate-800 border-slate-700 text-white" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Contact</Label>
                <Input value={form.contact} onChange={(e) => set("contact", e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Status *</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {["open", "partial", "paid", "canceled"].map((s) => (
                      <SelectItem key={s} value={s} className="text-white capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Amount *</Label>
                <Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => set("amount", e.target.value)} className="bg-slate-800 border-slate-700 text-white" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Paid amount</Label>
                <Input type="number" min="0" step="0.01" value={form.paidAmount} onChange={(e) => set("paidAmount", e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Currency</Label>
                <Input value={form.currency} onChange={(e) => set("currency", e.target.value)} className="bg-slate-800 border-slate-700 text-white" maxLength={10} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Due date</Label>
                <Input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300">Description</Label>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="bg-slate-800 border-slate-700 text-white" rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300">Notes</Label>
              <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="bg-slate-800 border-slate-700 text-white" rows={2} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-amber-600 hover:bg-amber-700 text-white">{saving ? "Saving…" : "Save changes"}</Button>
              <Button type="button" variant="ghost" asChild className="text-slate-400"><Link href="/admin/control/debts">Cancel</Link></Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
