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

const STATUSES = [
  { value: "stopped", label: "Stopped" },
  { value: "in_progress", label: "In Progress" },
  { value: "delayed", label: "Delayed" },
  { value: "completed", label: "Completed" },
]
const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const getAccessToken = useAccessToken()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [form, setForm] = useState({
    name: "", description: "", budget: "", status: "in_progress",
    startDate: "", expectedEndDate: "", actualEndDate: "",
    progressPercent: "0", priority: "medium", owner: "",
  })

  function set(k: keyof typeof form, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  useEffect(() => {
    async function load() {
      const p = await authenticatedFetch(`/api/admin/control/projects/${id}`, getAccessToken)
      setForm({
        name: p.name ?? "",
        description: p.description ?? "",
        budget: p.budget != null ? String(p.budget) : "",
        status: p.status ?? "in_progress",
        startDate: toDateInput(p.startDate),
        expectedEndDate: toDateInput(p.expectedEndDate),
        actualEndDate: toDateInput(p.actualEndDate),
        progressPercent: String(p.progressPercent ?? 0),
        priority: p.priority ?? "medium",
        owner: p.owner ?? "",
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
      const res = await authenticatedFetch(`/api/admin/control/projects/${id}`, getAccessToken, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          budget: form.budget ? Number(form.budget) : null,
          status: form.status,
          startDate: form.startDate,
          expectedEndDate: form.expectedEndDate || null,
          actualEndDate: form.actualEndDate || null,
          progressPercent: Number(form.progressPercent),
          priority: form.priority,
          owner: form.owner || null,
        }),
        raw: true,
      })
      const body = await res.json().catch(() => ({}))
      if (res.status === 422) {
        setErrors(body.errors?.fieldErrors ?? {})
        return
      }
      if (!res.ok) throw new Error("Failed")
      router.push("/admin/control/projects")
    } catch {
      setErrors({ name: ["An unexpected error occurred."] })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="h-6 w-6 text-slate-500 animate-spin" />
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="text-slate-400">
          <Link href="/admin/control/projects"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
        </Button>
        <h1 className="text-xl font-bold text-white">Edit project</h1>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300">Project details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300">Name *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white" required />
              {errors.name && <p className="text-red-400 text-xs">{errors.name[0]}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Description</Label>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <Label className="text-slate-300">Priority</Label>
                <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {PRIORITIES.map((p) => <SelectItem key={p.value} value={p.value} className="text-white">{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300">Start date *</Label>
                <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Expected end date *</Label>
                <Input type="date" value={form.expectedEndDate} onChange={(e) => set("expectedEndDate", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300">Budget</Label>
                <Input type="number" min="0" step="0.01" value={form.budget}
                  onChange={(e) => set("budget", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white" placeholder="0.00" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Progress (%)</Label>
                <Input type="number" min="0" max="100" value={form.progressPercent}
                  onChange={(e) => set("progressPercent", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300">Owner</Label>
                <Input value={form.owner} onChange={(e) => set("owner", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white" placeholder="Owner name" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Actual end date</Label>
                <Input type="date" value={form.actualEndDate} onChange={(e) => set("actualEndDate", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {saving ? "Saving…" : "Save changes"}
              </Button>
              <Button type="button" variant="ghost" asChild className="text-slate-400">
                <Link href="/admin/control/projects">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
