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

export default function EditPlatformPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const getAccessToken = useAccessToken()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [form, setForm] = useState({
    name: "",
    url: "",
    category: "",
    notes: "",
    sortOrder: "0",
  })

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  useEffect(() => {
    async function load() {
      const row = await authenticatedFetch(`/api/admin/control/platforms/${id}`, getAccessToken)
      setForm({
        name: row.name ?? "",
        url: row.url ?? "",
        category: row.category ?? "",
        notes: row.notes ?? "",
        sortOrder: String(row.sortOrder ?? 0),
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
      const res = await authenticatedFetch(`/api/admin/control/platforms/${id}`, getAccessToken, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          url: form.url,
          category: form.category || null,
          notes: form.notes || null,
          sortOrder: form.sortOrder === "" ? 0 : Number(form.sortOrder),
        }),
        raw: true,
      })
      const body = await res.json().catch(() => ({}))
      if (res.status === 422) {
        setErrors(body.errors?.fieldErrors ?? {})
        return
      }
      if (!res.ok) throw new Error("Failed")
      router.push("/admin/control/platforms")
    } catch {
      setErrors({ name: ["An unexpected error occurred."] })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 text-slate-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="text-slate-400">
          <Link href="/admin/control/platforms">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-white">Edit platform</h1>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300">Platform details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300">Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
              {errors.name && <p className="text-red-400 text-xs">{errors.name[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300">URL *</Label>
              <Input
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
              {errors.url && <p className="text-red-400 text-xs">{errors.url[0]}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300">Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Sort order</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => set("sortOrder", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300">Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-sky-700 hover:bg-sky-800 text-white">
                {saving ? "Saving…" : "Save changes"}
              </Button>
              <Button type="button" variant="ghost" asChild className="text-slate-400">
                <Link href="/admin/control/platforms">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
