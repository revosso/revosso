"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Code,
  ArrowRight,
  Menu,
  X,
  Send,
  CheckCircle,
  Shield,
  Zap,
  Layers,
  Building2,
  TrendingUp,
  Server,
  Database,
  Lock,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Comprehensive i18n translations for entire landing page
const translations = {
  en: {
    nav: {
      approach: "Approach",
      services: "Services",
      industries: "Industries",
      contact: "Contact",
    },
    hero: {
      h1: "Engineering, Operating & Scaling Digital Platforms",
      subheadline: "We build custom software, modernize existing systems, and manage scalable infrastructure for businesses relying on robust digital platforms.",
      primaryCta: "Discuss Your Project",
      secondaryCta: "Explore Our Approach",
    },
    whoWeAre: {
      title: "Digital Infrastructure. Built for Scale.",
      intro: "Revosso is a digital infrastructure and platform engineering company focused on building secure, scalable, and maintainable systems.",
      partnerTitle: "We partner with businesses that need:",
      requirements: [
        "Robust backend architecture",
        "High-performance platforms",
        "Secure financial and operational systems",
        "Long-term technical scalability",
      ],
      closing: "We don't deliver short-term solutions.\nWe engineer digital foundations.",
    },
    platformLifecycle: {
      title: "From Architecture to Operation",
      subtitle: "Full lifecycle platform engineering: build, take over, and operate.",
      build: {
        title: "BUILD",
        description: "We design and develop custom digital platforms aligned with your business model and long-term growth.",
      },
      takeOver: {
        title: "TAKE OVER & OPTIMIZE",
        intro: "We take ownership of existing systems to:",
        items: [
          "Stabilize and refactor codebases",
          "Enhance performance",
          "Reduce technical debt",
          "Modernize architecture",
          "Strengthen security",
        ],
      },
      operate: {
        title: "OPERATE & SCALE",
        intro: "We manage infrastructure and platform operations, including:",
        items: [
          "Secure hosting",
          "Performance monitoring",
          "Cloud deployment",
          "Ongoing technical maintenance",
          "Infrastructure scaling",
        ],
      },
      cta: "Discuss Your Platform Needs",
    },
    howWeWork: {
      title: "Engineering with Long-Term Vision",
      principles: [
        { title: "Architecture before code", description: "We design systems to scale seamlessly" },
        { title: "Scalability from day one", description: "Built to grow with your business" },
        { title: "Security-first mindset", description: "Protection integrated into the foundation" },
        { title: "Clean and maintainable", description: "Code that stands the test of time" },
        { title: "Performance as baseline", description: "Speed and efficiency by design" },
        { title: "Robust infrastructure", description: "Reliable systems you can depend on" },
      ],
    },
    industries: {
      title: "Built for Ambitious Businesses",
      items: [
        { title: "Financial Services", description: "Secure, compliant systems for financial operations" },
        { title: "Digital Commerce", description: "High-performance e-commerce platforms" },
        { title: "Enterprise Operations", description: "Scalable infrastructure for large organizations" },
        { title: "Tech-Driven Startups", description: "Foundation systems for rapid growth" },
      ],
      cta: "Discuss Your Industry Needs",
    },
    clients: {
      title: "Trusted by Businesses & Partners",
      copy: "We collaborate with companies and platforms to deliver secure, scalable, and high-performance solutions.",
    },
    finalCta: {
      title: "Let's Build the Infrastructure Behind Your Growth",
      subtitle: "Discuss your project requirements and explore how we can engineer scalable solutions for your business.",
      trust: "We form long-term partnerships grounded in structured engineering, operational stability, and continuous platform evolution. We prioritize architectural clarity and technical ownership over quick fixes.",
      button: "Contact Us",
    },
    contact: {
      title: {
        default: "Contact Us",
        newPlatform: "New Platform Development",
        takeover: "Platform Takeover & Optimization",
        maintenance: "Platform Maintenance",
        hosting: "Infrastructure & Hosting",
        partnership: "Partnership Inquiry",
      },
      description: "Tell us about your project and we'll respond within 24 hours.",
      fields: {
        name: "Name",
        email: "Email",
        company: "Company",
        need: "What do you need?",
        message: "Message",
        needPlaceholder: "Select your need",
        messagePlaceholder: "Tell us about your project...",
      },
      options: {
        newPlatform: "New Platform Development",
        takeover: "Platform Takeover & Optimization",
        maintenance: "Platform Maintenance",
        hosting: "Infrastructure & Hosting",
        partnership: "Partnership",
        general: "General Inquiry",
      },
      buttons: {
        cancel: "Cancel",
        send: "Send Message",
        sending: "Sending...",
      },
      toast: {
        selectionRequired: "Selection Required",
        selectionRequiredDesc: "Please select what you need.",
        success: "Message Sent Successfully",
        successDesc: "We'll respond within 24 hours. A confirmation email has been sent to your inbox.",
        error: "Error",
        errorDesc: "An error occurred. Please try again.",
      },
    },
    footer: {
      description: "Digital infrastructure and platform engineering for scalable growth.",
      services: "Services",
      company: "Company",
      contact: "Contact",
      links: {
        customPlatforms: "Custom Platforms",
        platformEngineering: "Platform Engineering",
        infrastructure: "Infrastructure",
        ourApproach: "Our Approach",
        industries: "Industries",
        contact: "Contact",
      },
      copyright: "All rights reserved.",
    },
  },
  fr: {
    nav: {
      approach: "Approche",
      services: "Services",
      industries: "Secteurs",
      contact: "Contact",
    },
    hero: {
      h1: "Ingénierie, Exploitation et Mise à l'Échelle de Plateformes Numériques",
      subheadline: "Nous développons des logiciels sur mesure, modernisons les systèmes existants et gérons des infrastructures évolutives pour les entreprises reposant sur des plateformes numériques robustes.",
      primaryCta: "Discuter de Votre Projet",
      secondaryCta: "Explorer Notre Approche",
    },
    whoWeAre: {
      title: "Infrastructure Numérique. Conçue pour l'Échelle.",
      intro: "Revosso est une société d'ingénierie d'infrastructure et de plateformes numériques spécialisée dans la création de systèmes sécurisés, évolutifs et maintenables.",
      partnerTitle: "Nous collaborons avec des entreprises qui ont besoin de:",
      requirements: [
        "Architecture backend robuste",
        "Plateformes haute performance",
        "Systèmes financiers et opérationnels sécurisés",
        "Scalabilité technique à long terme",
      ],
      closing: "Nous ne fournissons pas de solutions à court terme.\nNous concevons des fondations numériques.",
    },
    platformLifecycle: {
      title: "De l'Architecture à l'Exploitation",
      subtitle: "Ingénierie de plateforme sur l'ensemble du cycle de vie : construire, reprendre et exploiter.",
      build: {
        title: "CONSTRUIRE",
        description: "Nous concevons et développons des plateformes numériques sur mesure alignées avec votre modèle d'affaires et votre croissance à long terme.",
      },
      takeOver: {
        title: "REPRENDRE & OPTIMISER",
        intro: "Nous prenons en charge les systèmes existants pour :",
        items: [
          "Stabiliser et refactoriser le code",
          "Améliorer les performances",
          "Réduire la dette technique",
          "Moderniser l'architecture",
          "Renforcer la sécurité",
        ],
      },
      operate: {
        title: "EXPLOITER & ÉVOLUER",
        intro: "Nous gérons l'infrastructure et les opérations de plateforme, incluant :",
        items: [
          "Hébergement sécurisé",
          "Surveillance des performances",
          "Déploiement cloud",
          "Maintenance technique continue",
          "Scalabilité de l'infrastructure",
        ],
      },
      cta: "Discuter de Vos Besoins de Plateforme",
    },
    howWeWork: {
      title: "Ingénierie avec Vision à Long Terme",
      principles: [
        { title: "Architecture avant le code", description: "Concevoir des systèmes évolutifs" },
        { title: "Scalabilité dès le départ", description: "Construite pour croître avec votre entreprise" },
        { title: "Sécurité d'abord", description: "Protection intégrée dès les fondations" },
        { title: "Code propre et maintenable", description: "Résistant à l'épreuve du temps" },
        { title: "Performance comme référence", description: "Vitesse et efficacité par conception" },
        { title: "Infrastructure fiable", description: "Systèmes fiables sur lesquels vous pouvez compter" },
      ],
    },
    industries: {
      title: "Conçu pour Entreprises Ambitieuses",
      items: [
        { title: "Services Financiers", description: "Systèmes sécurisés et conformes pour les opérations financières" },
        { title: "Commerce Numérique", description: "Plateformes e-commerce haute performance" },
        { title: "Opérations d'Entreprise", description: "Infrastructure évolutive pour grandes organisations" },
        { title: "Startups Technologiques", description: "Systèmes de base pour une croissance rapide" },
      ],
      cta: "Discuter de Vos Besoins Sectoriels",
    },
    clients: {
      title: "Reconnu par Entreprises & Partenaires",
      copy: "Nous collaborons avec des entreprises et plateformes pour offrir des solutions sécurisées, évolutives et performantes.",
    },
    finalCta: {
      title: "Construisons l'Infrastructure Derrière Votre Croissance",
      subtitle: "Discutez de votre projet et explorez comment nous pouvons concevoir des solutions évolutives pour votre entreprise.",
      trust: "Nous établissons des partenariats à long terme fondés sur l'ingénierie structurée, la stabilité opérationnelle et l'évolution continue de la plateforme. Nous privilégions la clarté architecturale et la propriété technique plutôt que des solutions rapides.",
      button: "Nous Contacter",
    },
    contact: {
      title: {
        default: "Nous Contacter",
        newPlatform: "Développement de Nouvelle Plateforme",
        takeover: "Reprise & Optimisation de Plateforme",
        maintenance: "Maintenance de Plateforme",
        hosting: "Infrastructure & Hébergement",
        partnership: "Demande de Partenariat",
      },
      description: "Parlez-nous de votre projet, nous répondrons sous 24 heures.",
      fields: {
        name: "Nom",
        email: "Email",
        company: "Entreprise",
        need: "De quoi avez-vous besoin?",
        message: "Message",
        needPlaceholder: "Sélectionnez votre besoin",
        messagePlaceholder: "Parlez-nous de votre projet...",
      },
      options: {
        newPlatform: "Développement de Nouvelle Plateforme",
        takeover: "Reprise & Optimisation",
        maintenance: "Maintenance",
        hosting: "Infrastructure & Hébergement",
        partnership: "Partenariat",
        general: "Demande Générale",
      },
      buttons: {
        cancel: "Annuler",
        send: "Envoyer",
        sending: "Envoi...",
      },
      toast: {
        selectionRequired: "Sélection requise",
        selectionRequiredDesc: "Veuillez sélectionner ce dont vous avez besoin.",
        success: "Message envoyé avec succès",
        successDesc: "Nous répondrons sous 24 heures. Un email de confirmation a été envoyé.",
        error: "Erreur",
        errorDesc: "Une erreur est survenue. Veuillez réessayer.",
      },
    },
    footer: {
      description: "Ingénierie d'infrastructure et de plateformes numériques pour une croissance évolutive.",
      services: "Services",
      company: "Entreprise",
      contact: "Contact",
      links: {
        customPlatforms: "Plateformes Sur Mesure",
        platformEngineering: "Ingénierie de Plateforme",
        infrastructure: "Infrastructure",
        ourApproach: "Notre Approche",
        industries: "Secteurs",
        contact: "Contact",
      },
      copyright: "Tous droits réservés.",
    },
  },
  "pt-BR": {
    nav: {
      approach: "Abordagem",
      services: "Serviços",
      industries: "Setores",
      contact: "Contato",
    },
    hero: {
      h1: "Engenharia, Operação e Escalabilidade de Plataformas Digitais",
      subheadline: "Desenvolvemos software personalizado, modernizamos sistemas existentes e gerenciamos infraestrutura escalável para empresas que dependem de plataformas digitais robustas.",
      primaryCta: "Discutir Seu Projeto",
      secondaryCta: "Explorar Nossa Abordagem",
    },
    whoWeAre: {
      title: "Infraestrutura Digital. Construída para Escala.",
      intro: "A Revosso é uma empresa de engenharia de infraestrutura e plataformas digitais focada em criar sistemas seguros, escaláveis e sustentáveis.",
      partnerTitle: "Trabalhamos com empresas que necessitam de:",
      requirements: [
        "Arquitetura backend robusta",
        "Plataformas de alto desempenho",
        "Sistemas financeiros e operacionais seguros",
        "Escalabilidade técnica de longo prazo",
      ],
      closing: "Não fornecemos soluções de curto prazo.\nProjetamos fundações digitais.",
    },
    platformLifecycle: {
      title: "Da Arquitetura à Operação",
      subtitle: "Engenharia de plataforma em todo o ciclo de vida: construir, assumir e operar.",
      build: {
        title: "CONSTRUIR",
        description: "Projetamos e desenvolvemos plataformas digitais personalizadas alinhadas ao seu modelo de negócios e crescimento a longo prazo.",
      },
      takeOver: {
        title: "ASSUMIR & OTIMIZAR",
        intro: "Assumimos a propriedade de sistemas existentes para:",
        items: [
          "Estabilizar e refatorar código",
          "Melhorar desempenho",
          "Reduzir dívida técnica",
          "Modernizar arquitetura",
          "Fortalecer segurança",
        ],
      },
      operate: {
        title: "OPERAR & ESCALAR",
        intro: "Gerenciamos infraestrutura e operações de plataforma, incluindo:",
        items: [
          "Hospedagem segura",
          "Monitoramento de desempenho",
          "Implantação em nuvem",
          "Manutenção técnica contínua",
          "Escalabilidade de infraestrutura",
        ],
      },
      cta: "Discutir Suas Necessidades de Plataforma",
    },
    howWeWork: {
      title: "Engenharia com Visão de Longo Prazo",
      principles: [
        { title: "Arquitetura antes do código", description: "Projetamos sistemas que escalam facilmente" },
        { title: "Escalabilidade desde o início", description: "Construído para crescer com seu negócio" },
        { title: "Segurança em primeiro lugar", description: "Proteção integrada desde a fundação" },
        { title: "Código limpo e sustentável", description: "Código que resiste ao tempo" },
        { title: "Performance como referência", description: "Velocidade e eficiência por design" },
        { title: "Infraestrutura robusta", description: "Sistemas confiáveis nos quais você pode confiar" },
      ],
    },
    industries: {
      title: "Construído para Empresas Ambiciosas",
      items: [
        { title: "Serviços Financeiros", description: "Sistemas seguros e compatíveis para operações financeiras" },
        { title: "Comércio Digital", description: "Plataformas de e-commerce de alto desempenho" },
        { title: "Operações Empresariais", description: "Infraestrutura escalável para grandes organizações" },
        { title: "Startups Tecnológicas", description: "Sistemas de base para crescimento rápido" },
      ],
      cta: "Discutir Suas Necessidades do Setor",
    },
    clients: {
      title: "Confiado por Empresas & Parceiros",
      copy: "Colaboramos com empresas e plataformas para fornecer soluções seguras, escaláveis e de alto desempenho.",
    },
    finalCta: {
      title: "Vamos Construir a Infraestrutura por Trás do Seu Crescimento",
      subtitle: "Discuta os requisitos do seu projeto e descubra como podemos criar soluções escaláveis para o seu negócio.",
      trust: "Formamos parcerias de longo prazo baseadas em engenharia estruturada, estabilidade operacional e evolução contínua da plataforma. Priorizamos clareza arquitetural e propriedade técnica sobre soluções rápidas.",
      button: "Entre em Contato",
    },
    contact: {
      title: {
        default: "Entre em Contato",
        newPlatform: "Desenvolvimento de Nova Plataforma",
        takeover: "Assunção & Otimização de Plataforma",
        maintenance: "Manutenção de Plataforma",
        hosting: "Infraestrutura & Hospedagem",
        partnership: "Consulta de Parceria",
      },
      description: "Conte-nos sobre seu projeto e responderemos em até 24 horas.",
      fields: {
        name: "Nome",
        email: "Email",
        company: "Empresa",
        need: "O que você precisa?",
        message: "Mensagem",
        needPlaceholder: "Selecione sua necessidade",
        messagePlaceholder: "Conte-nos sobre seu projeto...",
      },
      options: {
        newPlatform: "Desenvolvimento de Nova Plataforma",
        takeover: "Assunção & Otimização de Plataforma",
        maintenance: "Manutenção de Plataforma",
        hosting: "Infraestrutura & Hospedagem",
        partnership: "Parceria",
        general: "Consulta Geral",
      },
      buttons: {
        cancel: "Cancelar",
        send: "Enviar",
        sending: "Enviando...",
      },
      toast: {
        selectionRequired: "Seleção necessária",
        selectionRequiredDesc: "Por favor, selecione sua necessidade.",
        success: "Mensagem enviada com sucesso",
        successDesc: "Responderemos em até 24 horas. Um email de confirmação foi enviado.",
        error: "Erro",
        errorDesc: "Ocorreu um erro. Tente novamente.",
      },
    },
    footer: {
      description: "Engenharia de infraestrutura digital e plataformas para crescimento escalável.",
      services: "Serviços",
      company: "Empresa",
      contact: "Contato",
      links: {
        customPlatforms: "Plataformas Personalizadas",
        platformEngineering: "Engenharia de Plataforma",
        infrastructure: "Infraestrutura",
        ourApproach: "Nossa Abordagem",
        industries: "Setores",
        contact: "Contato",
      },
      copyright: "Todos os direitos reservados.",
    },
  },
  es: {
    nav: {
      approach: "Enfoque",
      services: "Servicios",
      industries: "Industrias",
      contact: "Contacto",
    },
    hero: {
      h1: "Ingeniería, Operación y Escalabilidad de Plataformas Digitales",
      subheadline: "Creamos software personalizado, modernizamos sistemas existentes y gestionamos infraestructura escalable para empresas que dependen de plataformas digitales sólidas.",
      primaryCta: "Discutir Su Proyecto",
      secondaryCta: "Explorar Nuestro Enfoque",
    },
    whoWeAre: {
      title: "Infraestructura Digital. Construida para Escala.",
      intro: "Revosso es una empresa de ingeniería de infraestructura y plataformas digitales enfocada en construir sistemas seguros, escalables y sostenibles.",
      partnerTitle: "Trabajamos con empresas que necesitan:",
      requirements: [
        "Arquitectura backend robusta",
        "Plataformas de alto rendimiento",
        "Sistemas financieros y operativos seguros",
        "Escalabilidad técnica a largo plazo",
      ],
      closing: "No entregamos soluciones a corto plazo.\nIngeniamos bases digitales duraderas.",
    },
    platformLifecycle: {
      title: "De la Arquitectura a la Operación",
      subtitle: "Ingeniería de plataforma de ciclo completo: construir, asumir y operar.",
      build: {
        title: "CONSTRUIR",
        description: "Diseñamos y desarrollamos plataformas digitales personalizadas alineadas con su modelo de negocio y crecimiento a largo plazo.",
      },
      takeOver: {
        title: "ASUMIR & OPTIMIZAR",
        intro: "Asumimos sistemas existentes para:",
        items: [
          "Estabilizar y refactorizar el código",
          "Mejorar el rendimiento",
          "Reducir la deuda técnica",
          "Modernizar la arquitectura",
          "Fortalecer la seguridad",
        ],
      },
      operate: {
        title: "OPERAR & ESCALAR",
        intro: "Gestionamos infraestructura y operaciones de plataforma, incluyendo:",
        items: [
          "Alojamiento seguro",
          "Monitoreo de rendimiento",
          "Despliegue en la nube",
          "Mantenimiento técnico continuo",
          "Escalabilidad de infraestructura",
        ],
      },
      cta: "Discutir Sus Necesidades de Plataforma",
    },
    howWeWork: {
      title: "Ingeniería con Visión a Largo Plazo",
      principles: [
        { title: "Arquitectura antes del código", description: "Diseñamos sistemas que escalan sin problemas" },
        { title: "Escalabilidad desde el primer día", description: "Construido para crecer con su negocio" },
        { title: "Seguridad primero", description: "Protección integrada desde la base" },
        { title: "Código limpio y mantenible", description: "Código que resiste el paso del tiempo" },
        { title: "Rendimiento como estándar", description: "Velocidad y eficiencia por diseño" },
        { title: "Infraestructura confiable", description: "Sistemas fiables en los que puede confiar" },
      ],
    },
    industries: {
      title: "Construido para Empresas Ambiciosas",
      items: [
        { title: "Servicios Financieros", description: "Sistemas seguros y conformes para operaciones financieras" },
        { title: "Comercio Digital", description: "Plataformas de e-commerce de alto rendimiento" },
        { title: "Operaciones Empresariales", description: "Infraestructura escalable para grandes organizaciones" },
        { title: "Startups Tecnológicas", description: "Sistemas base para crecimiento rápido" },
      ],
      cta: "Discutir Sus Necesidades del Sector",
    },
    clients: {
      title: "Confiado por Empresas & Socios",
      copy: "Colaboramos con empresas y plataformas para ofrecer soluciones seguras, escalables y de alto rendimiento.",
    },
    finalCta: {
      title: "Construyamos la Infraestructura Detrás de Su Crecimiento",
      subtitle: "Comparta los requisitos de su proyecto y descubra cómo podemos diseñar soluciones escalables para su negocio.",
      trust: "Formamos asociaciones a largo plazo basadas en ingeniería estructurada, estabilidad operacional y evolución continua de la plataforma. Priorizamos claridad arquitectónica y propiedad técnica sobre soluciones rápidas.",
      button: "Contáctenos",
    },
    contact: {
      title: {
        default: "Contáctenos",
        newPlatform: "Desarrollo de Nueva Plataforma",
        takeover: "Asunción & Optimización de Plataforma",
        maintenance: "Mantenimiento de Plataforma",
        hosting: "Infraestructura & Alojamiento",
        partnership: "Consulta de Asociación",
      },
      description: "Cuéntenos sobre su proyecto y le responderemos en 24 horas.",
      fields: {
        name: "Nombre",
        email: "Correo electrónico",
        company: "Empresa",
        need: "¿Qué necesita?",
        message: "Mensaje",
        needPlaceholder: "Seleccione su necesidad",
        messagePlaceholder: "Cuéntenos sobre su proyecto...",
      },
      options: {
        newPlatform: "Desarrollo de Nueva Plataforma",
        takeover: "Asunción & Optimización",
        maintenance: "Mantenimiento",
        hosting: "Infraestructura & Alojamiento",
        partnership: "Asociación",
        general: "Consulta General",
      },
      buttons: {
        cancel: "Cancelar",
        send: "Enviar",
        sending: "Enviando...",
      },
      toast: {
        selectionRequired: "Selección requerida",
        selectionRequiredDesc: "Por favor seleccione lo que necesita.",
        success: "Mensaje enviado con éxito",
        successDesc: "Responderemos en 24 horas. Se ha enviado un correo de confirmación.",
        error: "Error",
        errorDesc: "Ocurrió un error. Intente nuevamente.",
      },
    },
    footer: {
      description: "Ingeniería de infraestructura digital y plataformas para crecimiento escalable.",
      services: "Servicios",
      company: "Empresa",
      contact: "Contacto",
      links: {
        customPlatforms: "Plataformas Personalizadas",
        platformEngineering: "Ingeniería de Plataforma",
        infrastructure: "Infraestructura",
        ourApproach: "Nuestro Enfoque",
        industries: "Industrias",
        contact: "Contacto",
      },
      copyright: "Todos los derechos reservados.",
    },
  },
};


// Client/Partner data
const clients = [
  { name: "Cashlakay", url: "https://cashlakay.com", description: "Custom platform development" },
  { name: "Revofin", url: "https://finance.revosso.com", description: "Financial platform hosting" },
  { name: "Rechajem", url: "https://rechajem-dev.revosso.com/", description: "Platform development" },
  { name: "Nuvann", url: "https://staging.nuvann.com", description: "Platform hosting" },
]

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedInterest, setSelectedInterest] = useState<string>("")
  const [locale, setLocale] = useState<"en" | "fr" | "pt-BR" | "es">("en")

  // Detect browser locale on mount
  useEffect(() => {
    const browserLocale = navigator.language || "en"
    if (browserLocale.startsWith("fr")) {
      setLocale("fr")
    } else if (browserLocale.startsWith("pt")) {
      setLocale("pt-BR")
    } else if (browserLocale.startsWith("es")) {
      setLocale("es")
    } else {
      setLocale("en")
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!selectedInterest) {
      toast({
        title: translations[locale].contact.toast.selectionRequired,
        description: translations[locale].contact.toast.selectionRequiredDesc,
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const contactData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string | undefined,
      message: formData.get("message") as string,
      productInterest: selectedInterest as "NEW_PLATFORM" | "PLATFORM_TAKEOVER" | "PLATFORM_MAINTENANCE" | "INFRASTRUCTURE_HOSTING" | "PARTNERSHIP" | "GENERAL_INQUIRY",
      source: "homepage",
      honeypot: "",
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error sending message")
      }

      setIsSubmitting(false)
      setIsContactOpen(false)
      setSelectedInterest("")
      e.currentTarget.reset()

      toast({
        title: translations[locale].contact.toast.success,
        description: translations[locale].contact.toast.successDesc,
      })
    } catch (error) {
      setIsSubmitting(false)
      toast({
        title: translations[locale].contact.toast.error,
        description: error instanceof Error ? error.message : translations[locale].contact.toast.errorDesc,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" suppressHydrationWarning>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrollY > 50 ? "bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity" suppressHydrationWarning></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                  <Code className="h-6 w-6" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                REVOSSO
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: translations[locale].nav.approach, href: "#approach" },
                { name: translations[locale].nav.services, href: "#services" },
                { name: translations[locale].nav.industries, href: "#industries" },
                { name: translations[locale].nav.contact, href: "#contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    {translations[locale].hero.primaryCta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            <div className="lg:hidden flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-xl">
              <nav className="container mx-auto px-4 py-6 space-y-4">
                {[
                  { name: translations[locale].nav.approach, href: "#approach" },
                  { name: translations[locale].nav.services, href: "#services" },
                  { name: translations[locale].nav.industries, href: "#industries" },
                  { name: translations[locale].nav.contact, href: "#contact" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-slate-300 hover:text-blue-400 font-medium py-2 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4">
                  <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        {translations[locale].hero.primaryCta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-x-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center space-y-8 py-16 lg:py-24">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  {translations[locale].hero.h1}
                </span>
              </h1>

              <p className="text-xl sm:text-2xl lg:text-3xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                {translations[locale].hero.subheadline}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                    >
                      {translations[locale].hero.primaryCta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-600 hover:border-blue-400 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 text-lg px-8 py-6 bg-transparent backdrop-blur-sm"
                  onClick={() => {
                    document.getElementById("approach")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  {translations[locale].hero.secondaryCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section id="approach" className="py-20 lg:py-32 bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  {translations[locale].whoWeAre.title}
                </h2>
              </div>

              <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                <p>
                  {translations[locale].whoWeAre.intro}
                </p>

                <p className="font-medium text-white">{translations[locale].whoWeAre.partnerTitle}</p>

                <ul className="space-y-3 list-none">
                  {translations[locale].whoWeAre.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>

                <p className="pt-4 font-medium text-white whitespace-pre-line">
                  {translations[locale].whoWeAre.closing}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Lifecycle Engineering Section */}
        <section id="services" className="py-20 lg:py-32 bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {translations[locale].platformLifecycle.title}
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                {translations[locale].platformLifecycle.subtitle}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Block 1 - BUILD */}
              <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
                <CardContent className="p-8 lg:p-10 space-y-6">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                    <Layers className="h-8 w-8 text-white" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white">
                      {translations[locale].platformLifecycle.build.title}
                    </h3>

                    <p className="text-slate-300 leading-relaxed text-lg">
                      {translations[locale].platformLifecycle.build.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Block 2 - TAKE OVER & OPTIMIZE */}
              <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
                <CardContent className="p-8 lg:p-10 space-y-6">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white">
                      {translations[locale].platformLifecycle.takeOver.title}
                    </h3>

                    <p className="text-slate-300 leading-relaxed text-lg mb-4">
                      {translations[locale].platformLifecycle.takeOver.intro}
                    </p>

                    <ul className="space-y-2 text-slate-300">
                      {translations[locale].platformLifecycle.takeOver.items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Block 3 - OPERATE & SCALE */}
              <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
                <CardContent className="p-8 lg:p-10 space-y-6">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
                    <Server className="h-8 w-8 text-white" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white">
                      {translations[locale].platformLifecycle.operate.title}
                    </h3>

                    <p className="text-slate-300 leading-relaxed text-lg mb-4">
                      {translations[locale].platformLifecycle.operate.intro}
                    </p>

                    <ul className="space-y-2 text-slate-300">
                      {translations[locale].platformLifecycle.operate.items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                  >
                    {translations[locale].platformLifecycle.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </section>

        {/* How We Work Section */}
        <section className="py-20 lg:py-32 bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {translations[locale].howWeWork.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Layers, ...translations[locale].howWeWork.principles[0] },
                { icon: TrendingUp, ...translations[locale].howWeWork.principles[1] },
                { icon: Shield, ...translations[locale].howWeWork.principles[2] },
                { icon: Code, ...translations[locale].howWeWork.principles[3] },
                { icon: Zap, ...translations[locale].howWeWork.principles[4] },
                { icon: Database, ...translations[locale].howWeWork.principles[5] },
              ].map((principle, index) => (
                <Card key={index} className="border-0 bg-slate-800/50 shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                      <principle.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{principle.title}</h3>
                    <p className="text-slate-300">{principle.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section id="industries" className="py-20 lg:py-32 bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {translations[locale].industries.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: Building2, ...translations[locale].industries.items[0] },
                { icon: TrendingUp, ...translations[locale].industries.items[1] },
                { icon: Server, ...translations[locale].industries.items[2] },
                { icon: Zap, ...translations[locale].industries.items[3] },
              ].map((industry, index) => (
                <Card key={index} className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl">
                  <CardContent className="p-8 space-y-4">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                      <industry.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{industry.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{industry.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-slate-600 hover:border-blue-400 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 text-lg px-8 py-6 bg-transparent backdrop-blur-sm"
                  >
                    {translations[locale].industries.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Clients & Partners Section */}
        <section className="py-20 lg:py-32 bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {translations[locale].clients.title}
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                {translations[locale].clients.copy}
              </p>
            </div>

            <TooltipProvider>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                {clients.map((client, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <a
                        href={client.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center justify-center p-6 lg:p-8 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                      >
                        <div className="w-full h-20 flex items-center justify-center">
                          <div className="text-2xl lg:text-3xl font-bold text-slate-300 group-hover:text-white transition-colors duration-300">
                            {client.name}
                          </div>
                        </div>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 border-slate-700 text-white">
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-slate-300 mt-1">{client.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="contact" className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                {translations[locale].finalCta.title}
              </h2>

              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
                {translations[locale].finalCta.subtitle}
              </p>

              <div className="max-w-2xl mx-auto space-y-4 pt-4">
                <p className="text-lg text-blue-100 leading-relaxed">
                  {translations[locale].finalCta.trust}
                </p>
              </div>

              <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                  >
                    {translations[locale].finalCta.button}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">
                      {selectedInterest === "NEW_PLATFORM"
                        ? translations[locale].contact.title.newPlatform
                        : selectedInterest === "PLATFORM_TAKEOVER"
                        ? translations[locale].contact.title.takeover
                        : selectedInterest === "PLATFORM_MAINTENANCE"
                        ? translations[locale].contact.title.maintenance
                        : selectedInterest === "INFRASTRUCTURE_HOSTING"
                        ? translations[locale].contact.title.hosting
                        : selectedInterest === "PARTNERSHIP"
                        ? translations[locale].contact.title.partnership
                        : translations[locale].contact.title.default}
                    </DialogTitle>
                    <DialogDescription className="text-base text-slate-300">
                      {translations[locale].contact.description}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleContactSubmit} className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-200 font-medium">
                          {translations[locale].contact.fields.name} *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          required
                          className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-200 font-medium">
                          {translations[locale].contact.fields.email} *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@company.com"
                          required
                          className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-slate-200 font-medium">
                        {translations[locale].contact.fields.company}
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your Company"
                        className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productInterest" className="text-slate-200 font-medium">
                        {translations[locale].contact.fields.need} *
                      </Label>
                      <Select name="productInterest" value={selectedInterest} onValueChange={setSelectedInterest}>
                        <SelectTrigger className="h-12 bg-slate-800 border-slate-600 text-white focus:border-blue-400 focus:ring-blue-400">
                          <SelectValue placeholder={translations[locale].contact.fields.needPlaceholder} className="text-slate-400" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="NEW_PLATFORM" className="text-white hover:bg-slate-700">
                            {translations[locale].contact.options.newPlatform}
                          </SelectItem>
                          <SelectItem value="PLATFORM_TAKEOVER" className="text-white hover:bg-slate-700">
                            {translations[locale].contact.options.takeover}
                          </SelectItem>
                          <SelectItem value="PLATFORM_MAINTENANCE" className="text-white hover:bg-slate-700">
                            {translations[locale].contact.options.maintenance}
                          </SelectItem>
                          <SelectItem value="INFRASTRUCTURE_HOSTING" className="text-white hover:bg-slate-700">
                            {translations[locale].contact.options.hosting}
                          </SelectItem>
                          <SelectItem value="PARTNERSHIP" className="text-white hover:bg-slate-700">
                            {translations[locale].contact.options.partnership}
                          </SelectItem>
                          <SelectItem value="GENERAL_INQUIRY" className="text-white hover:bg-slate-700">
                            {translations[locale].contact.options.general}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-slate-200 font-medium">
                        {translations[locale].contact.fields.message} *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={translations[locale].contact.fields.messagePlaceholder}
                        required
                        className="min-h-[120px] resize-none bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>

                    <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsContactOpen(false)}
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                        disabled={isSubmitting}
                      >
                        {translations[locale].contact.buttons.cancel}
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                        disabled={isSubmitting || !selectedInterest}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {translations[locale].contact.buttons.sending}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {translations[locale].contact.buttons.send}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                  <Code className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  REVOSSO
                </span>
              </Link>
              <p className="text-slate-400 leading-relaxed">
                {translations[locale].footer.description}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{translations[locale].footer.services}</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#services" className="hover:text-white transition-colors">
                    {translations[locale].footer.links.customPlatforms}
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-white transition-colors">
                    {translations[locale].footer.links.platformEngineering}
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-white transition-colors">
                    {translations[locale].footer.links.infrastructure}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{translations[locale].footer.company}</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#approach" className="hover:text-white transition-colors">
                    {translations[locale].footer.links.ourApproach}
                  </Link>
                </li>
                <li>
                  <Link href="#industries" className="hover:text-white transition-colors">
                    {translations[locale].footer.links.industries}
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-white transition-colors">
                    {translations[locale].footer.links.contact}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{translations[locale].footer.contact}</h3>
              <div className="space-y-2 text-slate-400">
                <p>contact@revosso.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Revosso. {translations[locale].footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
