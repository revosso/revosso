import { z } from "zod"

// Lead submission schema with flexible string fields for future expansion
export const leadSubmissionSchema = z.object({
  // Basic information
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  company: z.string().max(200).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  
  // Intent fields - flexible strings to allow growth without migrations
  leadType: z.string().max(100).optional(),
  productInterest: z.string().max(100).optional(),
  sourcePage: z.string().max(100).optional(),
  businessStage: z.string().max(100).optional(),
  
  // System fields (captured from request)
  userLanguage: z.string().max(10).optional(),
  
  // Spam protection
  honeypot: z.string().max(0).optional(), // Must be empty
})

// Visitor tracking schema
export const visitorTrackingSchema = z.object({
  visitorId: z.string().min(1),
  pagePath: z.string().min(1).max(500),
  language: z.string().max(10).optional(),
  referrer: z.string().max(500).optional(),
})

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>
export type VisitorTrackingInput = z.infer<typeof visitorTrackingSchema>

// Legacy support for existing contact form
export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Adresse email invalide"),
  company: z.string().max(200).optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(2000),
  productInterest: z.string().max(100).optional(),
  source: z.string().max(200).optional(),
  honeypot: z.string().max(0).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

