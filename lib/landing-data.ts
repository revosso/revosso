import { landingEn } from "@/lib/landing-translations/en"
import { landingEs } from "@/lib/landing-translations/es"
import { landingFr } from "@/lib/landing-translations/fr"
import { landingPtBR } from "@/lib/landing-translations/pt-br"

export const translations = {
  en: landingEn,
  fr: landingFr,
  "pt-BR": landingPtBR,
  es: landingEs,
} as const

export const clients = [
  { name: "Cashlakay", url: "https://cashlakay.com", description: "Custom platform development" },
  { name: "Revofin", url: "https://finance.revosso.com", description: "Financial platform hosting" },
  { name: "Rechajem", url: "https://rechajem.revosso.com", description: "Platform development" },
  { name: "Nuvann", url: "https://nuvann.com", description: "Platform hosting" },
]
