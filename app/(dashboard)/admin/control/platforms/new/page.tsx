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

export default function NewPlatformPage() {
  const getAccessToken = useAccessToken()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [form, setForm] = useState({
    name: "",
    url: "",
    category: "",
    notes: "",
    sortOrder: "0",
  })

  function setField(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const res = await authenticatedFetch("/api/admin/control/platforms", getAccessToken, {
        method: "POST",
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

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="text-slate-400">
          <Link href="/admin/control/platforms">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-white">Add platform</h1>
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
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. GitHub, Linear, Turso"
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
              {errors.name && <p className="text-red-400 text-xs">{errors.name[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300">URL *</Label>
              <Input
                value={form.url}
                onChange={(e) => setField("url", e.target.value)}
                placeholder="https://github.com/org"
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
              {errors.url && <p className="text-red-400 text-xs">{errors.url[0]}</p>}
              <p className="text-slate-500 text-xs">If you omit https://, it will be added automatically.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300">Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  placeholder="e.g. Dev, Finance"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Sort order</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setField("sortOrder", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-slate-500 text-xs">Lower numbers appear first.</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300">Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-sky-700 hover:bg-sky-800 text-white">
                {saving ? "Saving…" : "Create platform"}
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
