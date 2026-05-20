"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { LandingLocaleMessages } from "@/lib/landing-translations/types"
import { products, type Product } from "@/utils/products"
import { cn } from "@/lib/utils"

type ProductsMegaMenuProps = {
  copy: LandingLocaleMessages["productsMenu"]
  variant?: "desktop" | "mobile"
  onNavigate?: () => void
}

function ProductIcon({ product, size = "md" }: { product: Product; size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-11 w-11" : "h-12 w-12"

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200/90 dark:bg-slate-800 dark:ring-slate-700/80",
        box,
      )}
    >
      <Image
        src={product.logo}
        alt=""
        fill
        sizes={size === "sm" ? "44px" : "48px"}
        className="object-contain p-0.5"
      />
    </div>
  )
}

function ProductItem({
  product,
  description,
  comingSoonLabel,
  onNavigate,
  layout,
}: {
  product: Product
  description: string
  comingSoonLabel: string
  onNavigate?: () => void
  layout: "grid" | "stack"
}) {
  const isGrid = layout === "grid"

  const content = (
    <>
      <ProductIcon product={product} size={isGrid ? "sm" : "md"} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p
            className={cn(
              "font-semibold text-slate-900 dark:text-slate-100",
              isGrid ? "text-sm" : "text-[15px]",
            )}
          >
            {product.name}
          </p>
          {!product.available && (
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-blue-600 dark:text-blue-300">
              {comingSoonLabel}
            </span>
          )}
        </div>
        <p
          className={cn(
            "mt-1 text-slate-500 dark:text-slate-400 leading-snug",
            isGrid ? "text-xs line-clamp-3" : "text-sm line-clamp-2",
          )}
        >
          {description}
        </p>
      </div>
      {product.available && (
        <ArrowRight
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 self-center text-slate-400 transition-all duration-200",
            isGrid
              ? "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              : "text-slate-500 group-hover:translate-x-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400",
          )}
        />
      )}
    </>
  )

  const className = cn(
    "group relative flex items-start gap-3 rounded-xl transition-colors duration-200",
    isGrid ? "p-4" : "p-3",
    product.available
      ? "cursor-pointer hover:bg-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      : "cursor-default opacity-70",
  )

  if (product.available) {
    return (
      <a
        href={product.website}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={() => onNavigate?.()}
      >
        {content}
      </a>
    )
  }

  return <div className={className}>{content}</div>
}

export function ProductsMegaMenuPanel({ copy, variant = "desktop", onNavigate }: ProductsMegaMenuProps) {
  const isMobile = variant === "mobile"

  return (
    <div className="overflow-hidden">
      {!isMobile && (
        <p className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {copy.sectionLabel}
        </p>
      )}

      <div className={cn(isMobile ? "space-y-3 px-2 py-3" : "p-6")}>
        <div
          className={cn(
            "mx-auto grid w-full",
            isMobile ? "grid-cols-1 gap-3" : "max-w-4xl grid-cols-3 gap-x-6 gap-y-8",
          )}
        >
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              description={copy.items[product.id].description}
              comingSoonLabel={copy.comingSoon}
              onNavigate={onNavigate}
              layout={isMobile ? "stack" : "grid"}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
