"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Code,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Send,
  CheckCircle,
  Shield,
  Zap,
  Layers,
  TrendingUp,
  Server,
  Database,
  Globe,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { translations, clients } from "@/lib/landing-data"
import { resolveInitialLandingLocale } from "@/lib/landing-locale"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedInterest, setSelectedInterest] = useState<string>("")
  const [locale, setLocale] = useState<"en" | "fr" | "pt-BR" | "es">("en")

  useEffect(() => {
    let cancelled = false
    resolveInitialLandingLocale().then((l) => {
      if (!cancelled) setLocale(l)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const handleLocaleChange = (newLocale: "en" | "fr" | "pt-BR" | "es") => {
    setLocale(newLocale)
    localStorage.setItem("revosso-locale", newLocale)
  }

  const localeLabels: Record<"en" | "fr" | "pt-BR" | "es", string> = {
    en: "EN",
    fr: "FR",
    "pt-BR": "PT",
    es: "ES",
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Show a toast when redirected back from a failed admin login attempt
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authError = params.get("auth_error")
    if (!authError) return

    // Strip the param from the URL without a page reload
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

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" suppressHydrationWarning>
      {/* Single contact dialog — all CTAs open this via setIsContactOpen(true) */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">{contactTitle}</DialogTitle>
            <DialogDescription className="text-base text-slate-300">
              {t.contact.description}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleContactSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200 font-medium">
                  {t.contact.fields.name} *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 font-medium">
                  {t.contact.fields.email} *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  required
                  className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-200 font-medium">
                {t.contact.fields.company}
              </Label>
              <Input
                id="company"
                name="company"
                placeholder="Your Company"
                className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productInterest" className="text-slate-200 font-medium">
                {t.contact.fields.need} *
              </Label>
              <Select name="productInterest" value={selectedInterest} onValueChange={setSelectedInterest}>
                <SelectTrigger className="h-12 bg-slate-800 border-slate-600 text-white focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue placeholder={t.contact.fields.needPlaceholder} className="text-slate-400" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="NEW_PLATFORM" className="text-white hover:bg-slate-700">
                    {t.contact.options.newPlatform}
                  </SelectItem>
                  <SelectItem value="PLATFORM_TAKEOVER" className="text-white hover:bg-slate-700">
                    {t.contact.options.takeover}
                  </SelectItem>
                  <SelectItem value="PLATFORM_MAINTENANCE" className="text-white hover:bg-slate-700">
                    {t.contact.options.maintenance}
                  </SelectItem>
                  <SelectItem value="INFRASTRUCTURE_HOSTING" className="text-white hover:bg-slate-700">
                    {t.contact.options.hosting}
                  </SelectItem>
                  <SelectItem value="PARTNERSHIP" className="text-white hover:bg-slate-700">
                    {t.contact.options.partnership}
                  </SelectItem>
                  <SelectItem value="GENERAL_INQUIRY" className="text-white hover:bg-slate-700">
                    {t.contact.options.general}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-slate-200 font-medium">
                {t.contact.fields.message} *
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder={t.contact.fields.messagePlaceholder}
                required
                className="min-h-[120px] resize-none bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsContactOpen(false)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                disabled={isSubmitting}
              >
                {t.contact.buttons.cancel}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                disabled={isSubmitting || !selectedInterest}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {t.contact.buttons.sending}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t.contact.buttons.send}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                  <Code className="h-6 w-6" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                REVOSSO
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: t.nav.approach, href: "#approach" },
                { name: t.nav.services, href: "#services" },
                { name: t.nav.industries, href: "#solutions" },
                { name: t.nav.contact, href: "#contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-blue-400 gap-1.5 px-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">{localeLabels[locale]}</span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 min-w-[90px]">
                  {(["en", "fr", "pt-BR", "es"] as const).map((l) => (
                    <DropdownMenuItem
                      key={l}
                      onClick={() => handleLocaleChange(l)}
                      className={`cursor-pointer ${locale === l ? "text-blue-400 font-medium" : "text-slate-300"}`}
                    >
                      {localeLabels[l]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsContactOpen(true)}
              >
                {t.hero.primaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="lg:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-300"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
              <nav className="container mx-auto px-4 py-6 space-y-4">
                {[
                  { name: t.nav.approach, href: "#approach" },
                  { name: t.nav.services, href: "#services" },
                  { name: t.nav.industries, href: "#solutions" },
                  { name: t.nav.contact, href: "#contact" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-slate-300 hover:text-blue-400 font-medium py-2 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2 border-t border-slate-800">
                  <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">Language</p>
                  <div className="flex gap-2">
                    {(["en", "fr", "pt-BR", "es"] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => handleLocaleChange(l)}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                          locale === l
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        {localeLabels[l]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsContactOpen(true)
                    }}
                  >
                    {t.hero.primaryCta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-x-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center space-y-8 py-16 lg:py-24">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  {t.hero.h1}
                </span>
              </h1>

              <p className="text-xl sm:text-2xl lg:text-3xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                {t.hero.subheadline}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                  onClick={() => setIsContactOpen(true)}
                >
                  {t.hero.primaryCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-600 hover:border-blue-400 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 text-lg px-8 py-6 bg-transparent backdrop-blur-sm"
                  onClick={() => document.getElementById("approach")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {t.hero.secondaryCta}
                  <ChevronDown className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section id="approach" className="py-20 lg:py-32 bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  {t.whoWeAre.title}
                </h2>
              </div>

              <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                <p>{t.whoWeAre.intro}</p>

                <p className="font-medium text-white">{t.whoWeAre.partnerTitle}</p>

                <ul className="space-y-3 list-none">
                  {t.whoWeAre.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>

                <p className="pt-4 font-medium text-white whitespace-pre-line">{t.whoWeAre.closing}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Lifecycle Engineering Section */}
        <section id="services" className="py-20 lg:py-32 bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t.platformLifecycle.title}
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">{t.platformLifecycle.subtitle}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
                <CardContent className="p-8 lg:p-10 space-y-6">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                    <Layers className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white">
                      {t.platformLifecycle.build.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-lg">
                      {t.platformLifecycle.build.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
                <CardContent className="p-8 lg:p-10 space-y-6">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white">
                      {t.platformLifecycle.takeOver.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-lg mb-4">
                      {t.platformLifecycle.takeOver.intro}
                    </p>
                    <ul className="space-y-2 text-slate-300">
                      {t.platformLifecycle.takeOver.items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
                <CardContent className="p-8 lg:p-10 space-y-6">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
                    <Server className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white">
                      {t.platformLifecycle.operate.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-lg mb-4">
                      {t.platformLifecycle.operate.intro}
                    </p>
                    <ul className="space-y-2 text-slate-300">
                      {t.platformLifecycle.operate.items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                onClick={() => setIsContactOpen(true)}
              >
                {t.platformLifecycle.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* How We Work Section */}
        <section className="py-20 lg:py-32 bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t.howWeWork.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Layers, ...t.howWeWork.principles[0] },
                { icon: TrendingUp, ...t.howWeWork.principles[1] },
                { icon: Shield, ...t.howWeWork.principles[2] },
                { icon: Code, ...t.howWeWork.principles[3] },
                { icon: Zap, ...t.howWeWork.principles[4] },
                { icon: Database, ...t.howWeWork.principles[5] },
              ].map((principle, index) => (
                <Card key={index} className="border-0 bg-slate-800/50 shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                      <principle.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{principle.title}</h3>
                    <p className="text-slate-300">{principle.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-600 hover:border-blue-400 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 text-lg px-8 py-6 bg-transparent backdrop-blur-sm"
                onClick={() => setIsContactOpen(true)}
              >
                {t.hero.primaryCta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section id="solutions" className="py-20 lg:py-32 bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t.industries.title}
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto mt-4 leading-relaxed">
                {t.industries.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: Code, ...t.industries.items[0] },
                { icon: TrendingUp, ...t.industries.items[1] },
                { icon: Layers, ...t.industries.items[2] },
                { icon: Server, ...t.industries.items[3] },
              ].map((capability, index) => (
                <Card key={index} className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
                  <CardContent className="p-8 space-y-4">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                      <capability.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{capability.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{capability.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-600 hover:border-blue-400 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 text-lg px-8 py-6 bg-transparent backdrop-blur-sm"
                onClick={() => setIsContactOpen(true)}
              >
                {t.industries.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Clients & Partners Section */}
        <section className="py-20 lg:py-32 bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t.clients.title}
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">{t.clients.copy}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {clients.map((client, index) => (
                <a
                  key={index}
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-slate-300 group-hover:text-white transition-colors duration-300 text-center">
                    {client.name}
                  </div>
                  <p className="text-sm text-slate-500 group-hover:text-slate-400 mt-3 text-center transition-colors duration-300">
                    {client.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section
          id="contact"
          className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                {t.finalCta.title}
              </h2>

              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
                {t.finalCta.subtitle}
              </p>

              <div className="max-w-2xl mx-auto space-y-4 pt-4">
                <p className="text-lg text-blue-100 leading-relaxed">{t.finalCta.trust}</p>
              </div>

              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                onClick={() => setIsContactOpen(true)}
              >
                {t.finalCta.button}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                  <Code className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  REVOSSO
                </span>
              </Link>
              <p className="text-slate-400 leading-relaxed">{t.footer.description}</p>
              <p className="text-slate-400 text-sm">
                <a href="mailto:contact@revosso.com" className="hover:text-white transition-colors">
                  contact@revosso.com
                </a>
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t.footer.services}</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#services" className="hover:text-white transition-colors">
                    {t.footer.links.customPlatforms}
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-white transition-colors">
                    {t.footer.links.platformEngineering}
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-white transition-colors">
                    {t.footer.links.infrastructure}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t.footer.company}</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#approach" className="hover:text-white transition-colors">
                    {t.footer.links.ourApproach}
                  </Link>
                </li>
                <li>
                  <Link href="#solutions" className="hover:text-white transition-colors">
                    {t.footer.links.industries}
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    {t.footer.links.contact}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t.footer.legal}</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    {t.footer.links.privacy}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    {t.footer.links.terms}
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    {t.footer.links.cookies}
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors">
                    {t.footer.links.security}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {year} Revosso. {t.footer.copyright}
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-slate-400 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">
                {t.footer.links.privacy}
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                {t.footer.links.terms}
              </Link>
              <span>·</span>
              <Link href="/security" className="hover:text-white transition-colors">
                {t.footer.links.security}
              </Link>
              <span>·</span>
              <Link href="/cookies" className="hover:text-white transition-colors">
                {t.footer.links.cookies}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
