export type ProductId =
  | "rechajem"
  | "revofin"
  | "revomaket"
  | "revobarber"
  | "revocom"
  | "revoschool"

export type Product = {
  id: ProductId
  name: string
  website: string
  logo: string
  available: boolean
}

export const products: Product[] = [
  {
    id: "rechajem",
    name: "Rechajem",
    website: "https://rechajem.com",
    logo: "https://storage.revosso.com/logos/rechajem/logo-white.jpg",
    available: true,
  },
  {
    id: "revomaket",
    name: "RevoMaket",
    website: "https://revomaket.com/",
    logo: "https://storage.revosso.com/logos/revomaket/revomaket-logo-white.png",
    available: true,
  },
  {
    id: "revofin",
    name: "Revofin",
    website: "https://revofin.app/",
    logo: "/images/products/revofin.svg",
    available: true,
  },
  {
    id: "revobarber",
    name: "RevoBarber",
    website: "https://revobarber.revosso.com",
    logo: "/images/products/revobarber.svg",
    available: false,
  },
  {
    id: "revocom",
    name: "RevoCom",
    website: "https://revocom.revosso.com",
    logo: "/images/products/revocom.svg",
    available: false,
  },
  {
    id: "revoschool",
    name: "RevoSchool",
    website: "https://revoschool.revosso.com",
    logo: "/images/products/revoschool.svg",
    available: false,
  },
]

