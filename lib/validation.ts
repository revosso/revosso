import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Adresse email invalide"),
  company: z.string().max(200).optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(2000),
  productInterest: z.enum(["NEW_PLATFORM", "PLATFORM_TAKEOVER", "PLATFORM_MAINTENANCE", "INFRASTRUCTURE_HOSTING", "PARTNERSHIP", "GENERAL_INQUIRY"], {
    required_error: "Please select what you need",
  }),
  source: z.string().max(200).optional(),
  honeypot: z.string().max(0).optional(), // Honeypot field should be empty
})

export type ContactInput = z.infer<typeof contactSchema>

