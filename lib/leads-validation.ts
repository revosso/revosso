import { z } from "zod"

export const projectLeadSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  company: z.string().optional(),
  projectTypes: z.array(z.string()).min(1, "Veuillez sélectionner au moins un type de projet"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
})

export const consultationLeadSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  company: z.string().optional(),
  phone: z.string().optional(),
  service: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  message: z.string().optional(),
})

export type ProjectLeadInput = z.infer<typeof projectLeadSchema>
export type ConsultationLeadInput = z.infer<typeof consultationLeadSchema>

