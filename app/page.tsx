"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Code,
  Globe,
  ShoppingCart,
  Smartphone,
  Cloud,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  TrendingUp,
  Menu,
  X,
  CalendarIcon,
  Clock,
  Send,
  Rocket,
  Ticket,
  Store,
  GraduationCap,
  BookOpen,
  Users,
  BarChart3,
  Wallet,
  Utensils,
  Scissors,
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const services = [
    {
      icon: Smartphone,
      title: "Développement Mobile",
      description:
        "Applications mobiles natives et multiplateformes qui offrent des expériences utilisateur exceptionnelles sur iOS et Android.",
      features: ["Développement iOS et Android", "React Native et Flutter", "Optimisation App Store"],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Globe,
      title: "Développement Web",
      description:
        "Sites web modernes et réactifs et applications web construites avec des technologies de pointe et les meilleures pratiques.",
      features: ["React, Next.js et Vue.js", "Applications Web Progressives", "Optimisation des Performances"],
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: ShoppingCart,
      title: "Solutions E-Commerce",
      description:
        "Plateformes e-commerce complètes avec paiements sécurisés, gestion des stocks et analyses avancées.",
      features: ["Shopify et WooCommerce", "Intégration de Paiement", "Gestion des Stocks"],
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Code,
      title: "Logiciels d'Entreprise",
      description:
        "Solutions d'entreprise personnalisées avec intégration IA, automatisation des flux de travail et architecture évolutive.",
      features: ["IA et Apprentissage Automatique", "Intégration Systèmes Hérités", "Automatisation des Flux"],
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Cloud,
      title: "Infrastructure Cloud",
      description:
        "Solutions cloud complètes avec hébergement, DevOps, pipelines CI/CD et sécurité de niveau entreprise.",
      features: ["SLA 99,9% de Disponibilité", "DevOps et CI/CD", "Infrastructure Auto-évolutive"],
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Star,
      title: "Design UI/UX",
      description:
        "Design centré sur l'utilisateur qui crée des expériences numériques intuitives, engageantes et accessibles.",
      features: ["Recherche et Tests Utilisateur", "Prototypage et Wireframing", "Conformité Accessibilité"],
      gradient: "from-pink-500 to-rose-500",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "PDG, TechInnovate",
      content:
        "Revosso a transformé notre présence numérique avec leurs solutions innovantes. L'expertise et le dévouement de l'équipe ont dépassé nos attentes.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Chen",
      role: "CTO, GrowthWave",
      content:
        "Expertise technique exceptionnelle et gestion de projet. Ils ont livré notre plateforme complexe dans les temps et le budget.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emily Rodriguez",
      role: "Fondatrice, EcoSolutions",
      content:
        "L'infrastructure cloud qu'ils ont construite pour nous a été très solide. Leur support continu est exceptionnel.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]

  const projectTypes = [
    { id: "mobile", label: "Application Mobile" },
    { id: "web", label: "Application Web" },
    { id: "ecommerce", label: "Plateforme E-Commerce" },
    { id: "enterprise", label: "Logiciel d'Entreprise" },
    { id: "cloud", label: "Infrastructure Cloud" },
    { id: "design", label: "Design UI/UX" },
    { id: "other", label: "Autre" },
  ]

  const handleProjectTypeChange = (projectTypeId: string, checked: boolean) => {
    if (checked) {
      setSelectedProjectTypes([...selectedProjectTypes, projectTypeId])
    } else {
      setSelectedProjectTypes(selectedProjectTypes.filter((id) => id !== projectTypeId))
    }
  }

  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const projectData = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      projectTypes: selectedProjectTypes,
      budget: formData.get("budget"),
      timeline: formData.get("timeline"),
      description: formData.get("description"),
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Project submission:", projectData)
    setIsSubmitting(false)
    setIsProjectModalOpen(false)
    setSelectedProjectTypes([])

    // Show success message
    toast({
      title: "Projet envoyé",
      description: "Nous vous recontactons sous 24 heures avec la prochaine étape.",
    })
  }

  const handleConsultationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const consultationData = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      date: selectedDate,
      time: formData.get("time"),
      message: formData.get("message"),
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Consultation booking:", consultationData)
    setIsSubmitting(false)
    setIsConsultationModalOpen(false)

    // Show success message
    toast({
      title: "Consultation programmée",
      description: "Invitation et email de confirmation en cours d'envoi.",
    })
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
            {/* Logo */}
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: "Services", href: "#services" },
                { name: "Produits", href: "#products" },
                { name: "À Propos", href: "#about" },
                { name: "Contact", href: "#contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button variant="ghost" className="text-slate-300 hover:text-blue-400">
                Se Connecter
              </Button>
              <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Commencer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-xl">
              <nav className="container mx-auto px-4 py-6 space-y-4">
                {[
                  { name: "Services", href: "#services" },
                  { name: "Produits", href: "#products" },
                  { name: "À Propos", href: "#about" },
                  { name: "Contact", href: "#contact" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-slate-300 hover:text-blue-400 font-medium py-2 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-3">
                  <Button variant="ghost" className="w-full justify-start">
                    Se Connecter
                  </Button>
                  <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        Commencer
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
        <section className="relative overflow-hidden py-16 lg:py-24">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[520px] lg:min-h-[600px]">
              {/* Content */}
              <div className="space-y-8 text-center lg:text-left relative z-10">
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                      Solutions Logicielles Révolutionnaires
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Transformer les idées en solutions numériques puissantes. Mobile, web, e-commerce, plateformes à la
                    demande et hébergement cloud.
                  </p>
                </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6 border-0"
                      >
                        Commencer
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-slate-600 hover:border-blue-400 text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 text-lg px-8 py-6 group bg-transparent backdrop-blur-sm"
                    onClick={() => {
                      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    Nos Services
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative mt-8 lg:mt-0">
                <div className="relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-20" suppressHydrationWarning></div>
                  <Image
                    src="/images/hero-revolutionary-software.png"
                    width={600}
                    height={600}
                    sizes="(min-width: 1024px) 600px, 100vw"
                    alt="Solutions Logicielles Révolutionnaires - Équipe de développement moderne"
                    className="relative z-10 w-full h-auto rounded-3xl shadow-2xl"
                    priority
                  />
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-700 hidden lg:block">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-300">Projets en Direct</span>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-700 hidden lg:block">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-slate-300">Suivi de Croissance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 lg:py-32 bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
              <Badge className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-blue-300 border-blue-800 mb-6">
                Notre Expertise
              </Badge>

              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
                <span className="text-white">Solutions Numériques</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Complètes
                </span>
              </h2>

              <p className="text-xl text-slate-300 leading-relaxed">
                Du concept au déploiement, nous fournissons des solutions numériques de bout en bout qui stimulent
                l'innovation et accélèrent la croissance de votre entreprise.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Gradient Border */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  >
                    <div className="absolute inset-[1px] bg-slate-800 rounded-lg"></div>
                  </div>

                  <CardContent className="relative p-8 space-y-6">
                    {/* Icon */}
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <service.icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                        {service.title}
                      </h3>

                      <p className="text-slate-300 leading-relaxed">{service.description}</p>

                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-slate-400">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant="ghost"
                        className="group/btn p-0 h-auto text-blue-400 hover:text-purple-400 font-semibold"
                      >
                        En Savoir Plus
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <Dialog open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                  >
                    Discuter de Votre Projet
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-20 lg:py-32 bg-gradient-to-br from-slate-950 to-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
              <Badge className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-300 border-purple-800 mb-6">
                Nos Produits
              </Badge>

              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
                <span className="text-white">Solutions</span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Propriétaires
                </span>
              </h2>

              <p className="text-xl text-slate-300 leading-relaxed">
                Découvrez nos produits innovants conçus pour résoudre des défis commerciaux complexes et stimuler la
                transformation numérique.
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  name: "RevoFresh",
                  description:
                    "Gestion pour salons de beauté et barbershops centrée sur le rendez-vous uniquement—planning, rappels et fidélité.",
                  features: [
                    "Agenda en ligne et rappels SMS",
                    "Gestion des stylistes et ressources",
                    "Historique clients et fidélité",
                  ],
                  gradient: "from-rose-500 to-fuchsia-500",
                  icon: Scissors,
                },
                {
                  name: "Revoay",
                  description:
                    "Super‑app de services à la demande : réservation, paiement et suivi dans une expérience unifiée.",
                  features: [
                    "Modules transport/livraison",
                    "Paiements intégrés et wallet",
                    "Suivi temps réel et notifications",
                  ],
                  gradient: "from-sky-500 to-indigo-500",
                  icon: Wallet,
                },
                {
                  name: "RevEnts",
                  description:
                    "Planification et gestion d'événements pour promoteurs : publiez vos événements et vendez des billets en ligne en toute simplicité.",
                  features: [
                    "Billetterie en ligne sécurisée",
                    "Tableaux de bord des ventes",
                    "Scanner de billets et contrôle d'accès",
                  ],
                  gradient: "from-indigo-500 to-blue-500",
                  icon: Ticket,
                },
                {
                  name: "RevoShop",
                  description:
                    "Constructeur de boutique personnalisée pour créer votre e-commerce sur mesure sans compromis sur la performance.",
                  features: [
                    "Thèmes et blocs modulaires",
                    "Paiements et logistique intégrés",
                    "Catalogue et stocks avancés",
                  ],
                  gradient: "from-emerald-500 to-teal-500",
                  icon: Store,
                },
                {
                  name: "Nuvann",
                  description:
                    "Marketplace clé en main pour connecter vendeurs et acheteurs avec des flux de paiement sécurisés.",
                  features: [
                    "Onboarding vendeurs",
                    "Escrow et split de paiements",
                    "Ratings et arbitrage",
                  ],
                  gradient: "from-fuchsia-500 to-pink-500",
                  icon: Users,
                },
                {
                  name: "RevoSchool",
                  description:
                    "Suite complète de gestion scolaire : admissions, présences, notes, facturation et communication.",
                  features: [
                    "Portails parents/élèves",
                    "Planification et évaluations",
                    "Comptabilité et facturation",
                  ],
                  gradient: "from-amber-500 to-orange-500",
                  icon: GraduationCap,
                },
                {
                  name: "RevoKlas",
                  description:
                    "Plateforme d'apprentissage en ligne type Udemy pour créer, vendre et suivre des cours.",
                  features: [
                    "Création de cours multimédia",
                    "Quizzes et certificats",
                    "Monétisation et coupons",
                  ],
                  gradient: "from-cyan-500 to-sky-500",
                  icon: BookOpen,
                },
                {
                  name: "RevoCRM",
                  description:
                    "Plateforme de gestion de la relation client de niveau entreprise avec analyses pilotées par IA et flux de travail automatisés.",
                  features: ["Scoring Avancé des Prospects", "Prévisions de Ventes", "Automatisation des Campagnes"],
                  gradient: "from-blue-500 to-cyan-500",
                  icon: BarChart3,
                },
                {
                  name: "RevoAnalytics",
                  description:
                    "Plateforme complète d'intelligence d'affaires exploitant l'apprentissage automatique pour des insights prédictifs.",
                  features: ["Analyses Prédictives", "Tableaux de Bord Exécutifs", "Visualisation de Données"],
                  gradient: "from-purple-500 to-pink-500",
                  icon: BarChart3,
                },
                {
                  name: "RevoFin",
                  description:
                    "Écosystème sophistiqué de gestion financière avec automatisation comptable complète et conformité.",
                  features: ["Rapports Financiers", "Gestion de Conformité", "Optimisation Budgétaire"],
                  gradient: "from-green-500 to-emerald-500",
                  icon: Wallet,
                },
                {
                  name: "RevoFood",
                  description:
                    "Solution intégrée de gestion hôtelière pour un contrôle et une optimisation opérationnels de bout en bout.",
                  features: ["Optimisation Chaîne d'Approvisionnement", "Analyses de Revenus", "Fidélité Client"],
                  gradient: "from-orange-500 to-red-500",
                  icon: Utensils,
                },
              ].map((product, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  <CardContent className="relative p-8 space-y-6 h-full flex flex-col">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${product.gradient} shadow-lg self-start`}>
                      {product.icon ? (
                        <product.icon className="h-6 w-6 text-white" />
                      ) : (
                        <Award className="h-6 w-6 text-white" />
                      )}
                    </div>

                    <div className="space-y-4 flex-1">
                      <h3 className="text-2xl font-bold text-white">{product.name}</h3>

                      <p className="text-slate-300 leading-relaxed">{product.description}</p>

                      <ul className="space-y-2">
                        {product.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-slate-400">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full group/btn border-2 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300 bg-transparent"
                    >
                      En Savoir Plus
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        

        {/* Testimonials Section */}
        <section className="py-20 lg:py-32 bg-slate-900" suppressHydrationWarning>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
              <Badge className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 text-yellow-300 border-yellow-800 mb-6">
                Succès Clients
              </Badge>

              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
                <span className="text-white">Ce Que Disent</span>
                <br />
                <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Nos Clients
                </span>
              </h2>

              <p className="text-xl text-slate-300 leading-relaxed">
                Ne nous croyez pas sur parole. Voici ce que les leaders de l'industrie disent de notre travail et de
                notre partenariat.
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <CardContent className="p-8 space-y-6">
                    {/* Rating */}
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Content */}
                    <blockquote className="text-slate-300 leading-relaxed italic">"{testimonial.content}"</blockquote>

                    {/* Author */}
                    <div className="flex items-center space-x-4">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        width={48}
                        height={48}
                        alt={testimonial.name}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-slate-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="contact"
          className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0" suppressHydrationWarning>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=800&width=1200&text=Pattern')] opacity-10"></div>
            <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                Prêt à Transformer
                <br />
                <span className="text-blue-200">Votre Entreprise ?</span>
              </h2>

              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Discutons de la façon dont nos solutions innovantes peuvent accélérer votre transformation numérique et
                stimuler une croissance durable.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                    >
                      Démarrer Votre Projet
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Dialog open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-6 bg-transparent"
                    >
                      Programmer une Consultation
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>

              <div className="pt-8 text-blue-200">
                <p className="text-sm">✨ Consultation gratuite • 🚀 Réponse rapide • 💼 Solutions sur mesure</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
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
                Transformer les entreprises grâce à des solutions numériques innovantes et une technologie de pointe.
              </p>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Services</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Développement Mobile
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Développement Web
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    E-Commerce
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Solutions Cloud
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Entreprise</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    À Propos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Carrières
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Nous Contacter</h3>
              <div className="space-y-2 text-slate-400">
                <p>bonjour@revosso.com</p>
                <p>+33 1 23 45 67 89</p>
                <p>Paris, France</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Revosso. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Politique de Confidentialité
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Conditions d'Utilisation
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Politique des Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Project Modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl font-bold text-white">
              <Rocket className="mr-3 h-6 w-6 text-blue-400" />
              Démarrer Votre Projet
            </DialogTitle>
            <DialogDescription className="text-base text-slate-300">
              Parlez-nous de votre projet et nous vous recontacterons dans les 24 heures avec une proposition détaillée.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProjectSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200 font-medium">
                  Nom Complet *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Jean Dupont"
                  required
                  className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 font-medium">
                  Adresse Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jean@entreprise.com"
                  required
                  className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-200 font-medium">
                Nom de l'Entreprise
              </Label>
              <Input
                id="company"
                name="company"
                placeholder="Votre Entreprise SARL"
                className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200 font-medium">
                Types de Projet * (Sélectionnez tous ceux qui s'appliquent)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-800 rounded-lg border border-slate-600">
                {projectTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={selectedProjectTypes.includes(type.id)}
                      onCheckedChange={(checked) => handleProjectTypeChange(type.id, checked as boolean)}
                      className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor={type.id}
                      className="text-sm text-slate-300 cursor-pointer hover:text-white transition-colors"
                    >
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedProjectTypes.length === 0 && (
                <p className="text-sm text-red-400">Veuillez sélectionner au moins un type de projet</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-slate-200 font-medium">
                Fourchette de Budget
              </Label>
              <Select name="budget">
                <SelectTrigger className="h-12 bg-slate-800 border-slate-600 text-white focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue placeholder="Sélectionner la fourchette de budget" className="text-slate-400" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="10k-25k" className="text-white hover:bg-slate-700">
                    $10k - $25k
                  </SelectItem>
                  <SelectItem value="25k-50k" className="text-white hover:bg-slate-700">
                    $25k - $50k
                  </SelectItem>
                  <SelectItem value="50k-100k" className="text-white hover:bg-slate-700">
                    $50k - $100k
                  </SelectItem>
                  <SelectItem value="100k-250k" className="text-white hover:bg-slate-700">
                    $100k - $250k
                  </SelectItem>
                  <SelectItem value="250k+" className="text-white hover:bg-slate-700">
                    $250k+
                  </SelectItem>
                  <SelectItem value="discuss" className="text-white hover:bg-slate-700">
                    À Discuter
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline" className="text-slate-200 font-medium">
                Délai Préféré
              </Label>
              <Select name="timeline">
                <SelectTrigger className="h-12 bg-slate-800 border-slate-600 text-white focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue placeholder="Quand avez-vous besoin que ce soit terminé ?" className="text-slate-400" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="asap" className="text-white hover:bg-slate-700">
                    Dès que possible
                  </SelectItem>
                  <SelectItem value="1-3months" className="text-white hover:bg-slate-700">
                    1-3 mois
                  </SelectItem>
                  <SelectItem value="3-6months" className="text-white hover:bg-slate-700">
                    3-6 mois
                  </SelectItem>
                  <SelectItem value="6-12months" className="text-white hover:bg-slate-700">
                    6-12 mois
                  </SelectItem>
                  <SelectItem value="flexible" className="text-white hover:bg-slate-700">
                    Flexible
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-200 font-medium">
                Description du Projet *
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Veuillez décrire votre projet, vos objectifs, votre public cible et toute exigence spécifique..."
                required
                className="min-h-[120px] resize-none bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                </div>
                <div className="text-sm text-slate-300">
                  <p className="font-medium mb-1 text-white">Prochaines étapes :</p>
                  <ul className="space-y-1 text-slate-400">
                    <li>• Nous examinerons les détails de votre projet dans les 24 heures</li>
                    <li>• Programmer un appel de découverte pour discuter des exigences</li>
                    <li>• Fournir une proposition détaillée avec calendrier et tarification</li>
                    <li>• Commencer le développement une fois approuvé</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsProjectModalOpen(false)
                  setSelectedProjectTypes([])
                }}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                disabled={isSubmitting || selectedProjectTypes.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Soumettre le Projet
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Consultation Modal */}
      <Dialog open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl font-bold text-white">
              <CalendarIcon className="mr-3 h-6 w-6 text-blue-400" />
              Programmer une Consultation
            </DialogTitle>
            <DialogDescription className="text-base text-slate-300">
              Réservez une consultation gratuite de 30 minutes pour discuter de votre projet et explorer comment nous
              pouvons vous aider.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConsultationSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cons-name" className="text-slate-200 font-medium">
                  Nom Complet *
                </Label>
                <Input
                  id="cons-name"
                  name="name"
                  placeholder="Jean Dupont"
                  required
                  className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cons-email" className="text-slate-200 font-medium">
                  Adresse Email *
                </Label>
                <Input
                  id="cons-email"
                  name="email"
                  type="email"
                  placeholder="jean@entreprise.com"
                  required
                  className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cons-company" className="text-slate-200 font-medium">
                  Nom de l'Entreprise
                </Label>
                <Input
                  id="cons-company"
                  name="company"
                  placeholder="Votre Entreprise SARL"
                  className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cons-phone" className="text-slate-200 font-medium">
                  Numéro de Téléphone
                </Label>
                <Input
                  id="cons-phone"
                  name="phone"
                  type="tel"
                  placeholder="+33 1 23 45 67 89"
                  className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cons-service" className="text-slate-200 font-medium">
                Service d'Intérêt
              </Label>
              <Select name="service">
                <SelectTrigger className="h-12 bg-slate-800 border-slate-600 text-white focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue placeholder="Quel service vous intéresse ?" className="text-slate-400" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="mobile" className="text-white hover:bg-slate-700">
                    Développement Mobile
                  </SelectItem>
                  <SelectItem value="web" className="text-white hover:bg-slate-700">
                    Développement Web
                  </SelectItem>
                  <SelectItem value="ecommerce" className="text-white hover:bg-slate-700">
                    Solutions E-Commerce
                  </SelectItem>
                  <SelectItem value="enterprise" className="text-white hover:bg-slate-700">
                    Logiciels d'Entreprise
                  </SelectItem>
                  <SelectItem value="cloud" className="text-white hover:bg-slate-700">
                    Infrastructure Cloud
                  </SelectItem>
                  <SelectItem value="design" className="text-white hover:bg-slate-700">
                    Design UI/UX
                  </SelectItem>
                  <SelectItem value="consultation" className="text-white hover:bg-slate-700">
                    Consultation Générale
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-200 font-medium">Date Préférée *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-12 w-full justify-start text-left font-normal bg-slate-800 border-slate-600 hover:bg-slate-700 ${
                        !selectedDate ? "text-slate-400" : "text-white"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="bg-slate-800 text-white"
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cons-time" className="text-slate-200 font-medium">
                  Heure Préférée *
                </Label>
                <Select name="time" required>
                  <SelectTrigger className="h-12 bg-slate-800 border-slate-600 text-white focus:border-blue-400 focus:ring-blue-400">
                    <SelectValue placeholder="Sélectionner un créneau horaire" className="text-slate-400" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time} className="text-white hover:bg-slate-700">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {time}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cons-message" className="text-slate-200 font-medium">
                Informations Supplémentaires
              </Label>
              <Textarea
                id="cons-message"
                name="message"
                placeholder="Parlez-nous davantage de votre projet ou de tout sujet spécifique que vous aimeriez discuter..."
                className="min-h-[100px] resize-none bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                </div>
                <div className="text-sm text-slate-300">
                  <p className="font-medium mb-1 text-white">À quoi s'attendre :</p>
                  <ul className="space-y-1 text-slate-400">
                    <li>• Appel vidéo de 30 minutes avec notre équipe d'experts</li>
                    <li>• Évaluation du projet et recommandations</li>
                    <li>• Estimation du calendrier et du budget</li>
                    <li>• Discussion des prochaines étapes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsConsultationModalOpen(false)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                disabled={isSubmitting || !selectedDate}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Réservation...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Réserver la Consultation
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
