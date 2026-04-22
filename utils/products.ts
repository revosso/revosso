export type Product = {
  name: string
  website: string
  logo: string
  available: boolean
}

export const products: Product[] = [
  {
    name: "Rechajem",
    website: "https://rechajem.revosso.com",
    logo: "/images/products/rechajem.svg",
    available: true,
  },
  {
    name: "Revofin",
    website: "https://finance.revosso.com",
    logo: "/images/products/revofin.svg",
    available: true,
  },
  {
    name: "Nuvann",
    website: "https://nuvann.com",
    logo: "/images/products/nuvann.svg",
    available: false,
  },
  {
    name: "RevoBarber",
    website: "https://revobarber.revosso.com",
    logo: "/images/products/revobarber.svg",
    available: false,
  },
  {
    name: "RevoCom",
    website: "https://revocom.revosso.com",
    logo: "/images/products/revocom.svg",
    available: false,
  },
  {
    name: "RevoSchool",
    website: "https://revoschool.revosso.com",
    logo: "/images/products/revoschool.svg",
    available: false,
  },
]
