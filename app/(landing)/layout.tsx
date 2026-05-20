import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"

/**
 * Landing Page Layout
 *
 * Public marketing site — revosso.com / revosso.local
 * No authentication required.
 */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
