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

const BILLING_CYCLES = [
  { value: "weekly", label: "Weekly" }, { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" }, { value: "yearly", label: "Yearly" }, { value: "one_time", label: "One time" },
]
const STATUSES = [
  { value: "active", label: "Active" }, { value: "paused", label: "Paused" }, { value: "canceled", label: "Canceled" },
]

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const getAccessToken = useAccessToken()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [form, setForm] = useState({
    name: "", vendor: "", category: "", description: "", cost: "",
    currency: "USD", billingCycle: "monthly", billingDay: "",
    renewalDate: "", startDate: "", endDate: "", status: "active", notes: "",
  })

  function set(k: keyof typeof form, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  useEffect(() => {
    async function load() {
      const s = await authenticatedFetch(`/api/admin/control/services/${id}`, getAccessToken)
      setForm({
        name: s.name ?? "", vendor: s.vendor ?? "", category: s.category ?? "",
        description: s.description ?? "", cost: String(s.cost ?? ""),
        currency: s.currency ?? "USD", billingCycle: s.billingCycle ?? "monthly",
        billingDay: s.billingDay ? String(s.billingDay) : "",
        renewalDate: toDateInput(s.renewalDate), startDate: toDateInput(s.startDate),
        endDate: toDateInput(s.endDate), status: s.status ?? "active", notes: s.notes ?? "",
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
      const res = await authenticatedFetch(`/api/admin/control/services/${id}`, getAccessToken, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, vendor: form.vendor || null, category: form.category || null,
          description: form.description || null, cost: Number(form.cost),
          currency: form.currency || "USD", billingCycle: form.billingCycle,
          billingDay: form.billingDay ? Number(form.billingDay) : null,
          renewalDate: form.renewalDate || null, startDate: form.startDate || null,
          endDate: form.endDate || null, status: form.status, notes: form.notes || null,
        }),
        raw: true,
      })
      const body = await res.json().catch(() => ({}))
      if (res.status === 422) { setErrors(body.errors?.fieldErrors ?? {}); return }
      if (!res.ok) throw new Error("Failed")
      router.push("/admin/control/services")
    } catch { setErrors({ name: ["An unexpected error occurred."] }) } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="h-6 w-6 text-slate-500 animate-spin" /></div>

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="text-slate-400">
          <Link href="/admin/control/services"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
        </Button>
        <h1 className="text-xl font-bold text-white">Edit service</h1>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-sm text-slate-300">Service details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-slate-300">Name *</Label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-slate-800 border-slate-700 text-white" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Vendor</Label>
                <Input value={form.vendor} onChange={(e) => set("vendor", e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Category</Label>
                <Input value={form.category} onChange={(e) => set("category", e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Cost *</Label>
                <Input type="number" min="0" step="0.01" value={form.cost} onChange={(e) => set("cost", e.target.value)} className="bg-slate-800 border-slate-700 text-white" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Currency</Label>
                <Input value={form.currency} onChange={(e) => set("currency", e.target.value)} className="bg-slate-800 border-slate-700 text-white" maxLength={10} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Billing cycle *</Label>
                <Select value={form.billingCycle} onValueChange={(v) => set("billingCycle", v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {BILLING_CYCLES.map((c) => <SelectItem key={c.value} value={c.value} className="text-white">{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Status *</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {STATUSES.map((s) => <SelectItem key={s.value} value={s.value} className="text-white">{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Billing day (1–28)</Label>
                <Input type="number" min="1" max="28" value={form.billingDay} onChange={(e) => set("billingDay", e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Renewal date</Label>
                <Input type="date" value={form.renewalDate} onChange={(e) => set("renewalDate", e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Start date</Label>
                <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">End date</Label>
                <Input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
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
              <Button type="submit" disabled={saving} className="bg-purple-700 hover:bg-purple-800 text-white">{saving ? "Saving…" : "Save changes"}</Button>
              <Button type="button" variant="ghost" asChild className="text-slate-400"><Link href="/admin/control/services">Cancel</Link></Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
