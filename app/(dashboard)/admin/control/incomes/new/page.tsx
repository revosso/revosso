"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAccessToken } from "@/components/auth0-provider"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewIncomePage() {
  const getAccessToken = useAccessToken()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [form, setForm] = useState({ description: "", amount: "", receivedFrom: "", date: "", note: "" })

  function set(k: keyof typeof form, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const res = await authenticatedFetch("/api/admin/control/incomes", getAccessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description,
          amount: Number(form.amount),
          receivedFrom: form.receivedFrom,
          date: form.date,
          note: form.note || null,
        }),
        raw: true,
      })
      const body = await res.json().catch(() => ({}))
      if (res.status === 422) { setErrors(body.errors?.fieldErrors ?? {}); return }
      if (!res.ok) throw new Error("Failed")
      router.push("/admin/control/incomes")
    } catch { setErrors({ description: ["An unexpected error occurred."] }) } finally { setSaving(false) }
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="text-slate-400">
          <Link href="/admin/control/incomes"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
        </Button>
        <h1 className="text-xl font-bold text-white">Add income</h1>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-sm text-slate-300">Income details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300">Description *</Label>
              <Input value={form.description} onChange={(e) => set("description", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white" required />
              {errors.description && <p className="text-red-400 text-xs">{errors.description[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300">Amount *</Label>
                <Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => set("amount", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white" required />
                {errors.amount && <p className="text-red-400 text-xs">{errors.amount[0]}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Date *</Label>
                <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white" required />
                {errors.date && <p className="text-red-400 text-xs">{errors.date[0]}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Received from *</Label>
              <Input value={form.receivedFrom} onChange={(e) => set("receivedFrom", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white" required />
              {errors.receivedFrom && <p className="text-red-400 text-xs">{errors.receivedFrom[0]}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Note</Label>
              <Textarea value={form.note} onChange={(e) => set("note", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white" rows={2} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {saving ? "Saving…" : "Create income"}
              </Button>
              <Button type="button" variant="ghost" asChild className="text-slate-400">
                <Link href="/admin/control/incomes">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
