/**
 * Public marketing site locales (must match translation keys in pages / landing-data).
 */
export type LandingLocale = "en" | "fr" | "pt-BR" | "es"

const LANDING_LOCALES = new Set<string>(["en", "fr", "pt-BR", "es"])

/** Values stored in DB as `app.locale` (Control → Settings). */
export type DbAppLocale = "en" | "fr" | "pt"

export function dbLocaleToLanding(db: string | null | undefined): LandingLocale {
  if (db === "fr") return "fr"
  if (db === "pt") return "pt-BR"
  if (db === "es") return "es"
  return "en"
}

/**
 * Resolve language for the marketing site:
 * 1. Visitor choice in localStorage (`revosso-locale`) wins.
 * 2. Else default from server (`/api/locale` → Control Settings `app.locale`).
 * 3. Else browser language.
 * 4. Else English.
 */
export async function resolveInitialLandingLocale(): Promise<LandingLocale> {
  if (typeof window === "undefined") return "en"

  const saved = localStorage.getItem("revosso-locale")
  if (saved && LANDING_LOCALES.has(saved)) {
    return saved as LandingLocale
  }

  try {
    const r = await fetch("/api/locale", { cache: "no-store" })
    if (r.ok) {
      const body = (await r.json()) as { locale?: string }
      if (body.locale) {
        return dbLocaleToLanding(body.locale)
      }
    }
  } catch {
    /* Turso down or network — fall through */
  }

  const browserLocale = navigator.language || "en"
  if (browserLocale.toLowerCase().startsWith("fr")) return "fr"
  if (browserLocale.toLowerCase().startsWith("pt")) return "pt-BR"
  if (browserLocale.toLowerCase().startsWith("es")) return "es"
  return "en"
}
