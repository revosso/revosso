"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { toast } from "@/hooks/use-toast"
import { translations } from "@/lib/landing-data"
import { resolveInitialLandingLocale, type LandingLocale } from "@/lib/landing-locale"
import { LandingContactDialog } from "@/components/landing/landing-contact-dialog"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingSections } from "@/components/landing/landing-sections"

export default function LandingPage() {
  const calendlyUrl = (process.env.NEXT_PUBLIC_CALENDLY_URL ?? "").trim()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedInterest, setSelectedInterest] = useState<string>("")
  const [locale, setLocale] = useState<LandingLocale>("en")
  const productTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let cancelled = false
    resolveInitialLandingLocale().then((l) => {
      if (!cancelled) setLocale(l)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const handleLocaleChange = (newLocale: LandingLocale) => {
    setLocale(newLocale)
    localStorage.setItem("revosso-locale", newLocale)
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authError = params.get("auth_error")
    if (!authError) return

    const clean = window.location.pathname
    window.history.replaceState({}, document.title, clean)

    const isOrgError =
      authError.includes("not part of") || authError.includes("organization")

    toast({
      title: isOrgError ? "Access denied" : "Login failed",
      description: isOrgError
        ? "Your account doesn't have access to the admin dashboard."
        : authError,
      variant: "destructive",
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const t = translations[locale]
  const year = new Date().getFullYear()

  const contactTitle =
    selectedInterest === "NEW_PLATFORM"
      ? t.contact.title.newPlatform
      : selectedInterest === "PLATFORM_TAKEOVER"
      ? t.contact.title.takeover
      : selectedInterest === "PLATFORM_MAINTENANCE"
      ? t.contact.title.maintenance
      : selectedInterest === "INFRASTRUCTURE_HOSTING"
      ? t.contact.title.hosting
      : selectedInterest === "PARTNERSHIP"
      ? t.contact.title.partnership
      : t.contact.title.default

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsSubmitting(true)

    if (!selectedInterest) {
      toast({
        title: t.contact.toast.selectionRequired,
        description: t.contact.toast.selectionRequiredDesc,
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const formData = new FormData(form)
    const contactData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string | undefined,
      message: formData.get("message") as string,
      productInterest: selectedInterest as
        | "NEW_PLATFORM"
        | "PLATFORM_TAKEOVER"
        | "PLATFORM_MAINTENANCE"
        | "INFRASTRUCTURE_HOSTING"
        | "PARTNERSHIP"
        | "GENERAL_INQUIRY",
      sourcePage: "landing",
      userLanguage: locale,
      honeypot: (formData.get("honeypot") as string) || "",
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Error sending message")

      setIsSubmitting(false)
      setIsContactOpen(false)
      setSelectedInterest("")
      form.reset()

      toast({
        title: t.contact.toast.success,
        description: t.contact.toast.successDesc,
      })
    } catch (error) {
      setIsSubmitting(false)
      toast({
        title: t.contact.toast.error,
        description: error instanceof Error ? error.message : t.contact.toast.errorDesc,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" suppressHydrationWarning>
      <LandingContactDialog
        open={isContactOpen}
        onOpenChange={setIsContactOpen}
        title={contactTitle}
        copy={t.contact}
        selectedInterest={selectedInterest}
        onSelectedInterestChange={setSelectedInterest}
        isSubmitting={isSubmitting}
        onSubmit={handleContactSubmit}
      />

      <LandingHeader
        copy={t}
        locale={locale}
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        onLocaleChange={handleLocaleChange}
        calendlyUrl={calendlyUrl}
        onOpenContact={() => setIsContactOpen(true)}
        productTriggerRef={productTriggerRef}
      />

      <LandingSections
        copy={t}
        calendlyUrl={calendlyUrl}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <LandingFooter copy={t} year={year} />
    </div>
  )
}
