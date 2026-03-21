"use client"

import { useState, useEffect } from "react"
import { useAccessToken } from "@/components/auth0-provider"
import { useAdminLocale } from "@/components/admin-locale-context"
import { authenticatedFetch } from "@/lib/authenticated-fetch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, RefreshCw, Check } from "lucide-react"

const LOCALES = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "pt", label: "Português" },
]

export default function SettingsPage() {
  const getAccessToken = useAccessToken()
  const { t, refresh } = useAdminLocale()
  const [locale, setLocale] = useState("en")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await authenticatedFetch("/api/admin/control/settings", getAccessToken)
      setLocale(data.locale ?? "en")
      setLoading(false)
    }
    load()
  }, [getAccessToken])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await authenticatedFetch("/api/admin/control/settings", getAccessToken, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      })
      await refresh()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally { setSaving(false) }
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-slate-400" />
        <h1 className="text-xl font-bold text-white">{t.settingsTitle}</h1>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300">{t.settingsCardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-16">
              <RefreshCw className="h-5 w-5 text-slate-500 animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label className="text-slate-300">{t.settingsLocaleLabel}</Label>
                <Select value={locale} onValueChange={setLocale}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {LOCALES.map((l) => (
                      <SelectItem key={l.value} value={l.value} className="text-white">{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-slate-500 text-xs">{t.settingsHelp}</p>
              </div>

              <Button onClick={handleSave} disabled={saving || saved} className="bg-blue-600 hover:bg-blue-700 text-white">
                {saved ? (
                  <><Check className="h-4 w-4 mr-1.5" />{t.settingsSaved}</>
                ) : saving ? t.settingsSaving : t.settingsSave}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
