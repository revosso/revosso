"use client"

import type { RefObject } from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, Code, Globe, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DiscussProjectCtaButton } from "@/components/landing/discuss-project-cta-button"
import { ProductsMegaMenuPanel } from "@/components/landing/products-mega-menu"
import { LandingThemeToggle } from "@/components/landing/landing-theme-toggle"
import type { LandingLocale } from "@/lib/landing-locale"
import type { LandingLocaleMessages } from "@/lib/landing-translations/types"

const LOCALE_LABELS: Record<LandingLocale, string> = {
  en: "EN",
  fr: "FR",
  "pt-BR": "PT",
  es: "ES",
}

const navLinkClass =
  "text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group"

const ghostNavClass =
  "text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 gap-1.5 px-2 font-medium outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"

type LandingHeaderProps = {
  copy: LandingLocaleMessages
  locale: LandingLocale
  isScrolled: boolean
  isMenuOpen: boolean
  onMenuOpenChange: (open: boolean) => void
  onLocaleChange: (locale: LandingLocale) => void
  calendlyUrl: string
  onOpenContact: () => void
  productTriggerRef: RefObject<HTMLButtonElement | null>
}

export function LandingHeader({
  copy,
  locale,
  isScrolled,
  isMenuOpen,
  onMenuOpenChange,
  onLocaleChange,
  calendlyUrl,
  onOpenContact,
  productTriggerRef,
}: LandingHeaderProps) {
  const [productsOpen, setProductsOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("landing-overlay-open", productsOpen || isMenuOpen)
    return () => document.documentElement.classList.remove("landing-overlay-open")
  }, [productsOpen, isMenuOpen])

  const navLinks = [
    { name: copy.nav.approach, href: "#approach" },
    { name: copy.nav.services, href: "#services" },
    { name: copy.nav.industries, href: "#solutions" },
    { name: copy.nav.contact, href: "#contact" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/50 shadow-lg"
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
            <DropdownMenu
              modal={false}
              onOpenChange={(isOpen) => {
                setProductsOpen(isOpen)
                if (!isOpen) productTriggerRef.current?.blur()
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button ref={productTriggerRef} variant="ghost" size="sm" className={ghostNavClass}>
                  <span>{copy.nav.products}</span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={10}
                collisionPadding={24}
                className="w-[min(900px,calc(100dvw-3rem))] overflow-hidden rounded-xl border border-slate-200/80 dark:border-0 bg-white/95 dark:bg-slate-900/95 p-0 shadow-2xl backdrop-blur-xl"
              >
                <ProductsMegaMenuPanel copy={copy.productsMenu} />
              </DropdownMenuContent>
            </DropdownMenu>
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-2">
            <LandingThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={ghostNavClass}>
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">{LOCALE_LABELS[locale]}</span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700 min-w-[90px]"
              >
                {(["en", "fr", "pt-BR", "es"] as const).map((l) => (
                  <DropdownMenuItem
                    key={l}
                    onClick={() => onLocaleChange(l)}
                    className={`cursor-pointer ${locale === l ? "text-blue-600 dark:text-blue-400 font-medium" : "text-slate-600 dark:text-slate-300"}`}
                  >
                    {LOCALE_LABELS[l]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DiscussProjectCtaButton
              calendlyUrl={calendlyUrl}
              onOpenContact={onOpenContact}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {copy.hero.primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </DiscussProjectCtaButton>
          </div>

          <div className="lg:hidden flex items-center space-x-1">
            <LandingThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMenuOpenChange(!isMenuOpen)}
              className="text-slate-600 dark:text-slate-300"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="container mx-auto px-4 py-6 space-y-4">
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-medium">
                  {copy.productsMenu.sectionLabel}
                </p>
                <ProductsMegaMenuPanel
                  copy={copy.productsMenu}
                  variant="mobile"
                  onNavigate={() => onMenuOpenChange(false)}
                />
              </div>
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-2 ${navLinkClass}`}
                  onClick={() => onMenuOpenChange(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">Language</p>
                <div className="flex gap-2">
                  {(["en", "fr", "pt-BR", "es"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => onLocaleChange(l)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        locale === l
                          ? "bg-blue-600 text-white"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                      }`}
                    >
                      {LOCALE_LABELS[l]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <DiscussProjectCtaButton
                  calendlyUrl={calendlyUrl}
                  onOpenContact={onOpenContact}
                  onBeforeAction={() => onMenuOpenChange(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {copy.hero.primaryCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </DiscussProjectCtaButton>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
