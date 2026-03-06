import type React from "react"

/**
 * Landing Page Layout
 * 
 * This layout is used for the public marketing site.
 * Accessible via: revosso.com and revosso.local
 * 
 * No authentication required.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
