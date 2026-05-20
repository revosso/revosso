"use client"

import type React from "react"
import { Button } from "@/components/ui/button"

type DiscussProjectCtaButtonProps = {
  calendlyUrl: string
  onOpenContact: () => void
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  children: React.ReactNode
  onBeforeAction?: () => void
}

/** When `NEXT_PUBLIC_CALENDLY_URL` is set, opens Calendly; otherwise opens the contact dialog. */
export function DiscussProjectCtaButton({
  calendlyUrl,
  onOpenContact,
  className,
  size,
  variant,
  children,
  onBeforeAction,
}: DiscussProjectCtaButtonProps) {
  if (calendlyUrl) {
    return (
      <Button asChild size={size} variant={variant} className={className}>
        <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" onClick={() => onBeforeAction?.()}>
          {children}
        </a>
      </Button>
    )
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={() => {
        onBeforeAction?.()
        onOpenContact()
      }}
    >
      {children}
    </Button>
  )
}
