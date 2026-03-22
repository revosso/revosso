"use client"

import { useCallback, useState } from "react"
import { Building2, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminLocale } from "@/components/admin-locale-context"
import {
  ENTERPRISE_CNPJ_DIGITS,
  ENTERPRISE_CNPJ_FORMATTED,
  ENTERPRISE_DISPLAY_LINE,
  ENTERPRISE_LEGAL_NAME,
} from "@/lib/enterprise-identity"

type Variant = "sidebar" | "banner"

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement("textarea")
      ta.value = text
      ta.style.position = "fixed"
      ta.style.left = "-9999px"
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand("copy")
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

export function AdminEnterpriseIdentity({ variant = "sidebar" }: { variant?: Variant }) {
  const { t } = useAdminLocale()
  const [copied, setCopied] = useState<"none" | "cnpj" | "full" | "digits">("none")

  const flash = useCallback((kind: typeof copied) => {
    setCopied(kind)
    window.setTimeout(() => setCopied("none"), 2200)
  }, [])

  const onCopyCnpj = async () => {
    if (await copyText(ENTERPRISE_CNPJ_FORMATTED)) flash("cnpj")
  }

  const onCopyFull = async () => {
    if (await copyText(ENTERPRISE_DISPLAY_LINE)) flash("full")
  }

  const onCopyDigits = async () => {
    if (await copyText(ENTERPRISE_CNPJ_DIGITS)) flash("digits")
  }

  if (variant === "banner") {
    return (
      <div
        className="rounded-xl border border-emerald-900/35 bg-gradient-to-r from-slate-900/95 via-slate-900 to-emerald-950/25 px-4 py-3.5 shadow-sm"
        role="region"
        aria-label={t.enterpriseIdentityAria}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/90">
                {t.enterpriseIdentityLabel}
              </p>
              <p className="text-sm font-semibold text-white truncate">{ENTERPRISE_LEGAL_NAME}</p>
              <p className="mt-0.5 font-mono text-sm text-slate-300 tabular-nums">
                <span className="text-slate-500 text-xs font-sans mr-1.5">CNPJ</span>
                {ENTERPRISE_CNPJ_FORMATTED}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 hidden sm:block">{ENTERPRISE_DISPLAY_LINE}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 bg-slate-800/90 text-slate-100 border-slate-700 hover:bg-slate-700"
              onClick={onCopyCnpj}
            >
              {copied === "cnpj" ? <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
              {copied === "cnpj" ? t.enterpriseCopied : t.enterpriseCopyCnpj}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={onCopyDigits}
            >
              {copied === "digits" ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : null}
              {copied === "digits" ? t.enterpriseCopied : t.enterpriseCopyDigits}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={onCopyFull}
            >
              {copied === "full" ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : null}
              {copied === "full" ? t.enterpriseCopied : t.enterpriseCopyFull}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  /* sidebar */
  return (
    <div
      className="mx-3 mb-2 rounded-xl border border-slate-800 bg-slate-900/90 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
      role="region"
      aria-label={t.enterpriseIdentityAria}
    >
      <div className="flex gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <Building2 className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{t.enterpriseIdentityLabel}</p>
          <p className="text-xs font-semibold text-white leading-tight">{ENTERPRISE_LEGAL_NAME}</p>
          <p className="mt-1 font-mono text-[11px] leading-snug text-slate-300 tabular-nums break-all">
            <span className="text-slate-500 font-sans text-[10px] mr-1">CNPJ</span>
            {ENTERPRISE_CNPJ_FORMATTED}
          </p>
        </div>
      </div>
      <div className="mt-2.5 flex flex-col gap-1.5">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-7 w-full justify-center text-[11px] bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700"
          onClick={onCopyCnpj}
        >
          {copied === "cnpj" ? <Check className="h-3 w-3 mr-1.5 text-emerald-400" /> : <Copy className="h-3 w-3 mr-1.5" />}
          {copied === "cnpj" ? t.enterpriseCopied : t.enterpriseCopyCnpj}
        </Button>
        <div className="grid grid-cols-2 gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-[10px] text-slate-500 hover:text-slate-200 hover:bg-slate-800/80 px-1"
            onClick={onCopyDigits}
          >
            {copied === "digits" ? <Check className="h-3 w-3 mr-1 text-emerald-400" /> : null}
            {copied === "digits" ? t.enterpriseCopied : t.enterpriseCopyDigits}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-[10px] text-slate-500 hover:text-slate-200 hover:bg-slate-800/80 px-1"
            onClick={onCopyFull}
          >
            {copied === "full" ? <Check className="h-3 w-3 mr-1 text-emerald-400" /> : null}
            {copied === "full" ? t.enterpriseCopied : t.enterpriseCopyFull}
          </Button>
        </div>
      </div>
    </div>
  )
}
