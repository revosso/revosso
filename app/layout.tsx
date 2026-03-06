import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { Auth0Provider } from "@/components/auth0-provider"
import { ClientOnly } from "@/components/client-only"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Revosso - Digital Infrastructure & Platform Engineering",
  description:
    "Revosso designs and builds secure, high-performance digital infrastructure and custom software systems engineered for long-term growth.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Auth0Provider>
          {children}
          <ClientOnly><Toaster /></ClientOnly>
        </Auth0Provider>
      </body>
    </html>
  )
}
