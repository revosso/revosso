"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { resolveInitialLandingLocale } from "@/lib/landing-locale"
import { Code, ArrowLeft, Shield, Lock, Server, Eye, AlertTriangle } from "lucide-react"

type Locale = "en" | "fr" | "pt-BR" | "es"

const data: Record<Locale, {
  backToHome: string
  title: string
  lastUpdated: string
  intro: string
  cards: { title: string; description: string }[]
  platformTitle: string
  transportTitle: string
  transport: string[]
  authTitle: string
  auth: string[]
  apiTitle: string
  api: string[]
  infraTitle: string
  infra: string[]
  disclosureTitle: string
  disclosure1: string
  disclosure2: string
  reportTitle: string
  reportText1: string
  reportText2: string
  reportItems: string[]
  commitmentsTitle: string
  commitments: string[]
  scopeTitle: string
  scopeIntro: string
  scopeIn: string[]
  scopeOutIntro: string
  scopeOut: string[]
  contactTitle: string
  contactIntro: string
  contactCompany: string
  contactSecurity: string
  contactGeneral: string
  contactWebsite: string
  allRightsReserved: string
  footerPrivacy: string
  footerTerms: string
  footerCookies: string
  footerSecurity: string
}> = {
  en: {
    backToHome: "Back to Home",
    title: "Security",
    lastUpdated: "Last updated:",
    intro: "Security is a foundational principle at Revosso — both in the systems we build for clients and in how we operate our own infrastructure. This page outlines our security practices and how to report potential vulnerabilities.",
    cards: [
      { title: "TLS Everywhere", description: "All data in transit is encrypted using TLS 1.2 or higher." },
      { title: "Secure Authentication", description: "Admin access is protected with PKCE authorization flow and public key validation." },
      { title: "Minimal Attack Surface", description: "API endpoints are protected with JWT validation and rate limiting." },
      { title: "Access Controls", description: "Role-based access control enforces least-privilege across all systems." },
    ],
    platformTitle: "Platform Security Measures",
    transportTitle: "Transport Security",
    transport: [
      "All connections enforced over HTTPS with TLS 1.2+",
      "HTTP Strict Transport Security (HSTS) enabled",
      "Secure headers configured on all responses",
    ],
    authTitle: "Authentication & Authorization",
    auth: [
      "Admin access protected with PKCE authorization flow via a dedicated identity provider",
      "Access tokens stored in memory only — never in localStorage or cookies",
      "Server-side JWT validation using public key infrastructure",
      "Role-based access control with least-privilege enforcement via custom claims",
      "All admin API routes protected by server-side token validation",
    ],
    apiTitle: "API & Input Security",
    api: [
      "Strict input validation on all API endpoints",
      "Rate limiting on public endpoints to prevent abuse",
      "Honeypot fields on contact forms to detect automated submissions",
      "Parameterized database queries to prevent SQL injection",
    ],
    infraTitle: "Infrastructure",
    infra: [
      "Hosted on a managed cloud platform with edge-level DDoS protection",
      "Database hosted on a managed, encrypted cloud storage with strict access controls",
      "Environment variables and secrets managed through secure environment configuration",
      "No secrets committed to version control",
    ],
    disclosureTitle: "Responsible Disclosure Policy",
    disclosure1: "We take security seriously. If you discover a potential security vulnerability in our website or systems, we encourage you to report it to us responsibly. We appreciate the efforts of security researchers and commit to working with you to understand and resolve the issue quickly.",
    disclosure2: "To report a security vulnerability:",
    reportTitle: "To report a security vulnerability:",
    reportText1: "Please email",
    reportText2: "with a detailed description of the issue, steps to reproduce, and any supporting evidence. Please do not publicly disclose the vulnerability until we have had an opportunity to investigate and address it.",
    reportItems: [
      "Description of the vulnerability and its potential impact",
      "Step-by-step instructions to reproduce the issue",
      "Any relevant screenshots, logs, or proof-of-concept code",
      "Your contact information for follow-up",
    ],
    commitmentsTitle: "Our Commitments",
    commitments: [
      "We will acknowledge receipt of your report within 3 business days",
      "We will investigate and keep you informed of our progress",
      "We will not take legal action against researchers acting in good faith",
      "We will work to remediate confirmed vulnerabilities in a timely manner",
    ],
    scopeTitle: "Scope",
    scopeIntro: "Our responsible disclosure program covers:",
    scopeIn: ["revosso.com and all subdomains", "Public APIs operated by Revosso"],
    scopeOutIntro: "Out of scope:",
    scopeOut: [
      "Social engineering attacks targeting Revosso staff",
      "Physical security",
      "Denial of service attacks",
      "Third-party services and platforms not operated by Revosso",
    ],
    contactTitle: "Contact",
    contactIntro: "For security-related inquiries:",
    contactCompany: "Revosso Security",
    contactSecurity: "Security reports:",
    contactGeneral: "General inquiries:",
    contactWebsite: "Website:",
    allRightsReserved: "All rights reserved.",
    footerPrivacy: "Privacy",
    footerTerms: "Terms",
    footerCookies: "Cookies",
    footerSecurity: "Security",
  },
  fr: {
    backToHome: "Retour à l'accueil",
    title: "Sécurité",
    lastUpdated: "Dernière mise à jour :",
    intro: "La sécurité est un principe fondamental chez Revosso — aussi bien dans les systèmes que nous construisons pour nos clients que dans la façon dont nous exploitons notre propre infrastructure. Cette page présente nos pratiques de sécurité et la manière de signaler des vulnérabilités potentielles.",
    cards: [
      { title: "TLS Partout", description: "Toutes les données en transit sont chiffrées à l'aide de TLS 1.2 ou supérieur." },
      { title: "Authentification Sécurisée", description: "L'accès administrateur est protégé par un flux d'autorisation PKCE et une validation par clé publique." },
      { title: "Surface d'Attaque Minimale", description: "Les points d'accès API sont protégés par validation JWT et limitation de débit." },
      { title: "Contrôles d'Accès", description: "Le contrôle d'accès basé sur les rôles applique le moindre privilège sur tous les systèmes." },
    ],
    platformTitle: "Mesures de Sécurité de la Plateforme",
    transportTitle: "Sécurité du Transport",
    transport: [
      "Toutes les connexions imposées sur HTTPS avec TLS 1.2+",
      "HTTP Strict Transport Security (HSTS) activé",
      "En-têtes sécurisés configurés sur toutes les réponses",
    ],
    authTitle: "Authentification et Autorisation",
    auth: [
      "Accès administrateur protégé par un flux d'autorisation PKCE via un fournisseur d'identité dédié",
      "Jetons d'accès stockés en mémoire uniquement — jamais dans localStorage ou les cookies",
      "Validation JWT côté serveur à l'aide d'une infrastructure à clé publique",
      "Contrôle d'accès basé sur les rôles avec application du moindre privilège via des revendications personnalisées",
      "Toutes les routes API administrateur protégées par une validation de jeton côté serveur",
    ],
    apiTitle: "Sécurité des API et des Entrées",
    api: [
      "Validation stricte des entrées sur tous les points d'accès API",
      "Limitation de débit sur les points d'accès publics pour prévenir les abus",
      "Champs honeypot sur les formulaires de contact pour détecter les soumissions automatisées",
      "Requêtes de base de données paramétrées pour prévenir les injections SQL",
    ],
    infraTitle: "Infrastructure",
    infra: [
      "Hébergé sur une plateforme cloud gérée avec protection DDoS au niveau de la périphérie",
      "Base de données hébergée sur un stockage cloud géré et chiffré avec des contrôles d'accès stricts",
      "Variables d'environnement et secrets gérés via une configuration d'environnement sécurisée",
      "Aucun secret engagé dans le contrôle de version",
    ],
    disclosureTitle: "Politique de Divulgation Responsable",
    disclosure1: "Nous prenons la sécurité au sérieux. Si vous découvrez une vulnérabilité de sécurité potentielle sur notre site Web ou nos systèmes, nous vous encourageons à nous la signaler de manière responsable. Nous apprécions les efforts des chercheurs en sécurité et nous nous engageons à collaborer avec vous pour comprendre et résoudre le problème rapidement.",
    disclosure2: "Pour signaler une vulnérabilité de sécurité :",
    reportTitle: "Pour signaler une vulnérabilité de sécurité :",
    reportText1: "Veuillez envoyer un e-mail à",
    reportText2: "avec une description détaillée du problème, des étapes pour le reproduire et tout justificatif. Veuillez ne pas divulguer publiquement la vulnérabilité tant que nous n'avons pas eu l'occasion d'enquêter et d'y remédier.",
    reportItems: [
      "Description de la vulnérabilité et de son impact potentiel",
      "Instructions étape par étape pour reproduire le problème",
      "Captures d'écran, journaux ou code de preuve de concept pertinents",
      "Vos coordonnées pour le suivi",
    ],
    commitmentsTitle: "Nos Engagements",
    commitments: [
      "Nous accuserons réception de votre rapport dans les 3 jours ouvrables",
      "Nous enquêterons et vous tiendrons informé de nos progrès",
      "Nous n'intenterons pas de poursuites judiciaires contre les chercheurs agissant de bonne foi",
      "Nous travaillerons à remédier aux vulnérabilités confirmées en temps opportun",
    ],
    scopeTitle: "Périmètre",
    scopeIntro: "Notre programme de divulgation responsable couvre :",
    scopeIn: ["revosso.com et tous les sous-domaines", "Les API publiques exploitées par Revosso"],
    scopeOutIntro: "Hors périmètre :",
    scopeOut: [
      "Attaques d'ingénierie sociale ciblant le personnel de Revosso",
      "Sécurité physique",
      "Attaques par déni de service",
      "Services et plateformes tiers non exploités par Revosso",
    ],
    contactTitle: "Contact",
    contactIntro: "Pour les demandes liées à la sécurité :",
    contactCompany: "Sécurité Revosso",
    contactSecurity: "Signalements de sécurité :",
    contactGeneral: "Renseignements généraux :",
    contactWebsite: "Site web :",
    allRightsReserved: "Tous droits réservés.",
    footerPrivacy: "Confidentialité",
    footerTerms: "Conditions",
    footerCookies: "Cookies",
    footerSecurity: "Sécurité",
  },
  "pt-BR": {
    backToHome: "Voltar ao início",
    title: "Segurança",
    lastUpdated: "Última atualização:",
    intro: "A segurança é um princípio fundamental na Revosso — tanto nos sistemas que construímos para nossos clientes quanto na forma como operamos nossa própria infraestrutura. Esta página descreve nossas práticas de segurança e como reportar possíveis vulnerabilidades.",
    cards: [
      { title: "TLS em Todo Lugar", description: "Todos os dados em trânsito são criptografados usando TLS 1.2 ou superior." },
      { title: "Autenticação Segura", description: "O acesso administrativo é protegido com fluxo de autorização PKCE e validação por chave pública." },
      { title: "Superfície de Ataque Mínima", description: "Os endpoints de API são protegidos com validação JWT e limitação de taxa." },
      { title: "Controles de Acesso", description: "O controle de acesso baseado em funções aplica o menor privilégio em todos os sistemas." },
    ],
    platformTitle: "Medidas de Segurança da Plataforma",
    transportTitle: "Segurança do Transporte",
    transport: [
      "Todas as conexões forçadas sobre HTTPS com TLS 1.2+",
      "HTTP Strict Transport Security (HSTS) habilitado",
      "Cabeçalhos seguros configurados em todas as respostas",
    ],
    authTitle: "Autenticação e Autorização",
    auth: [
      "Acesso administrativo protegido com fluxo de autorização PKCE via provedor de identidade dedicado",
      "Tokens de acesso armazenados apenas em memória — nunca em localStorage ou cookies",
      "Validação JWT no servidor usando infraestrutura de chave pública",
      "Controle de acesso baseado em funções com aplicação de menor privilégio via declarações personalizadas",
      "Todas as rotas de API administrativas protegidas por validação de token no servidor",
    ],
    apiTitle: "Segurança de API e Entradas",
    api: [
      "Validação estrita de entradas em todos os endpoints de API",
      "Limitação de taxa em endpoints públicos para prevenir abusos",
      "Campos honeypot em formulários de contato para detectar envios automatizados",
      "Consultas parametrizadas ao banco de dados para prevenir injeção SQL",
    ],
    infraTitle: "Infraestrutura",
    infra: [
      "Hospedado em uma plataforma de nuvem gerenciada com proteção DDoS em nível de borda",
      "Banco de dados hospedado em armazenamento de nuvem gerenciado e criptografado com controles de acesso rigorosos",
      "Variáveis de ambiente e segredos gerenciados por meio de configuração de ambiente seguro",
      "Nenhum segredo confirmado no controle de versão",
    ],
    disclosureTitle: "Política de Divulgação Responsável",
    disclosure1: "Levamos a segurança a sério. Se você descobrir uma potencial vulnerabilidade de segurança em nosso site ou sistemas, encorajamos que a reporte de forma responsável. Agradecemos os esforços dos pesquisadores de segurança e nos comprometemos a trabalhar com você para entender e resolver o problema rapidamente.",
    disclosure2: "Para reportar uma vulnerabilidade de segurança:",
    reportTitle: "Para reportar uma vulnerabilidade de segurança:",
    reportText1: "Por favor, envie um e-mail para",
    reportText2: "com uma descrição detalhada do problema, etapas para reprodução e quaisquer evidências de suporte. Por favor, não divulgue publicamente a vulnerabilidade até que tenhamos tido a oportunidade de investigá-la e corrigi-la.",
    reportItems: [
      "Descrição da vulnerabilidade e seu impacto potencial",
      "Instruções passo a passo para reproduzir o problema",
      "Capturas de tela, logs ou código de prova de conceito relevantes",
      "Suas informações de contato para acompanhamento",
    ],
    commitmentsTitle: "Nossos Compromissos",
    commitments: [
      "Confirmaremos o recebimento do seu relatório em até 3 dias úteis",
      "Investigaremos e manteremos você informado sobre nosso progresso",
      "Não tomaremos medidas legais contra pesquisadores agindo de boa-fé",
      "Trabalharemos para remediar vulnerabilidades confirmadas em tempo hábil",
    ],
    scopeTitle: "Escopo",
    scopeIntro: "Nosso programa de divulgação responsável cobre:",
    scopeIn: ["revosso.com e todos os subdomínios", "APIs públicas operadas pela Revosso"],
    scopeOutIntro: "Fora do escopo:",
    scopeOut: [
      "Ataques de engenharia social direcionados à equipe da Revosso",
      "Segurança física",
      "Ataques de negação de serviço",
      "Serviços e plataformas de terceiros não operados pela Revosso",
    ],
    contactTitle: "Contato",
    contactIntro: "Para consultas relacionadas à segurança:",
    contactCompany: "Segurança Revosso",
    contactSecurity: "Relatórios de segurança:",
    contactGeneral: "Consultas gerais:",
    contactWebsite: "Site:",
    allRightsReserved: "Todos os direitos reservados.",
    footerPrivacy: "Privacidade",
    footerTerms: "Termos",
    footerCookies: "Cookies",
    footerSecurity: "Segurança",
  },
  es: {
    backToHome: "Volver al inicio",
    title: "Seguridad",
    lastUpdated: "Última actualización:",
    intro: "La seguridad es un principio fundamental en Revosso — tanto en los sistemas que construimos para nuestros clientes como en la forma en que operamos nuestra propia infraestructura. Esta página describe nuestras prácticas de seguridad y cómo reportar posibles vulnerabilidades.",
    cards: [
      { title: "TLS en Todas Partes", description: "Todos los datos en tránsito están cifrados con TLS 1.2 o superior." },
      { title: "Autenticación Segura", description: "El acceso de administrador está protegido con flujo de autorización PKCE y validación por clave pública." },
      { title: "Superficie de Ataque Mínima", description: "Los endpoints de API están protegidos con validación JWT y limitación de tasa." },
      { title: "Controles de Acceso", description: "El control de acceso basado en roles aplica el mínimo privilegio en todos los sistemas." },
    ],
    platformTitle: "Medidas de Seguridad de la Plataforma",
    transportTitle: "Seguridad del Transporte",
    transport: [
      "Todas las conexiones forzadas sobre HTTPS con TLS 1.2+",
      "HTTP Strict Transport Security (HSTS) habilitado",
      "Cabeceras seguras configuradas en todas las respuestas",
    ],
    authTitle: "Autenticación y Autorización",
    auth: [
      "Acceso de administrador protegido con flujo de autorización PKCE a través de un proveedor de identidad dedicado",
      "Tokens de acceso almacenados solo en memoria — nunca en localStorage ni en cookies",
      "Validación JWT en el servidor utilizando infraestructura de clave pública",
      "Control de acceso basado en roles con aplicación de mínimo privilegio mediante reclamaciones personalizadas",
      "Todas las rutas de API de administrador protegidas por validación de token en el servidor",
    ],
    apiTitle: "Seguridad de API y Entradas",
    api: [
      "Validación estricta de entradas en todos los endpoints de API",
      "Limitación de tasa en endpoints públicos para prevenir abusos",
      "Campos honeypot en formularios de contacto para detectar envíos automatizados",
      "Consultas parametrizadas a la base de datos para prevenir inyección SQL",
    ],
    infraTitle: "Infraestructura",
    infra: [
      "Alojado en una plataforma de nube administrada con protección DDoS a nivel de borde",
      "Base de datos alojada en almacenamiento en la nube administrado y cifrado con controles de acceso estrictos",
      "Variables de entorno y secretos administrados a través de una configuración de entorno segura",
      "Ningún secreto confirmado en el control de versiones",
    ],
    disclosureTitle: "Política de Divulgación Responsable",
    disclosure1: "Tomamos la seguridad en serio. Si descubre una posible vulnerabilidad de seguridad en nuestro sitio web o sistemas, le animamos a reportarla de manera responsable. Apreciamos los esfuerzos de los investigadores de seguridad y nos comprometemos a trabajar con usted para comprender y resolver el problema rápidamente.",
    disclosure2: "Para reportar una vulnerabilidad de seguridad:",
    reportTitle: "Para reportar una vulnerabilidad de seguridad:",
    reportText1: "Por favor, envíe un correo electrónico a",
    reportText2: "con una descripción detallada del problema, pasos para reproducirlo y cualquier evidencia de apoyo. Por favor, no divulgue públicamente la vulnerabilidad hasta que hayamos tenido la oportunidad de investigarla y abordarla.",
    reportItems: [
      "Descripción de la vulnerabilidad y su impacto potencial",
      "Instrucciones paso a paso para reproducir el problema",
      "Capturas de pantalla, registros o código de prueba de concepto relevantes",
      "Su información de contacto para seguimiento",
    ],
    commitmentsTitle: "Nuestros Compromisos",
    commitments: [
      "Acusaremos recibo de su informe dentro de los 3 días hábiles",
      "Investigaremos y le mantendremos informado de nuestro progreso",
      "No tomaremos acciones legales contra investigadores que actúen de buena fe",
      "Trabajaremos para remediar las vulnerabilidades confirmadas de manera oportuna",
    ],
    scopeTitle: "Alcance",
    scopeIntro: "Nuestro programa de divulgación responsable cubre:",
    scopeIn: ["revosso.com y todos los subdominios", "APIs públicas operadas por Revosso"],
    scopeOutIntro: "Fuera del alcance:",
    scopeOut: [
      "Ataques de ingeniería social dirigidos al personal de Revosso",
      "Seguridad física",
      "Ataques de denegación de servicio",
      "Servicios y plataformas de terceros no operados por Revosso",
    ],
    contactTitle: "Contacto",
    contactIntro: "Para consultas relacionadas con la seguridad:",
    contactCompany: "Seguridad Revosso",
    contactSecurity: "Informes de seguridad:",
    contactGeneral: "Consultas generales:",
    contactWebsite: "Sitio web:",
    allRightsReserved: "Todos los derechos reservados.",
    footerPrivacy: "Privacidad",
    footerTerms: "Términos",
    footerCookies: "Cookies",
    footerSecurity: "Seguridad",
  },
}

const cardIcons = [Lock, Shield, Server, Eye]
const lastUpdated = "March 2026"

export default function SecurityPage() {
  const [locale, setLocale] = useState<Locale>("en")

  useEffect(() => {
    let cancelled = false
    resolveInitialLandingLocale().then((l) => {
      if (!cancelled) setLocale(l as Locale)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const t = data[locale]
  const year = new Date().getFullYear()

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white" suppressHydrationWarning>
      <header className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                  <Code className="h-6 w-6" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                REVOSSO
              </span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-blue-400 font-medium transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              {t.backToHome}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-16 lg:py-24">
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white">{t.title}</h1>
            <p className="text-slate-400 text-sm">{t.lastUpdated} {lastUpdated}</p>
            <p className="text-lg text-slate-300 leading-relaxed">{t.intro}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {t.cards.map((card, index) => {
              const Icon = cardIcons[index]
              return (
                <div key={index} className="bg-slate-800/50 rounded-xl p-6 space-y-3 border border-slate-700/50">
                  <div className="inline-flex p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">{card.title}</h3>
                  <p className="text-slate-400 text-sm">{card.description}</p>
                </div>
              )
            })}
          </div>

          <div className="space-y-10 text-slate-300 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.platformTitle}</h2>

              <h3 className="text-lg font-medium text-slate-200">{t.transportTitle}</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.transport.map((item, i) => <li key={i}>{item}</li>)}
              </ul>

              <h3 className="text-lg font-medium text-slate-200 mt-6">{t.authTitle}</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.auth.map((item, i) => <li key={i}>{item}</li>)}
              </ul>

              <h3 className="text-lg font-medium text-slate-200 mt-6">{t.apiTitle}</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.api.map((item, i) => <li key={i}>{item}</li>)}
              </ul>

              <h3 className="text-lg font-medium text-slate-200 mt-6">{t.infraTitle}</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.infra.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.disclosureTitle}</h2>
              <p>{t.disclosure1}</p>

              <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-semibold text-white">{t.reportTitle}</p>
                    <p className="text-slate-300">
                      {t.reportText1}{" "}
                      <a href="mailto:security@revosso.com" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                        security@revosso.com
                      </a>{" "}
                      {t.reportText2}
                    </p>
                  </div>
                </div>
              </div>

              <p>{t.disclosure2}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.reportItems.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.commitmentsTitle}</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.commitments.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.scopeTitle}</h2>
              <p>{t.scopeIntro}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.scopeIn.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <p className="mt-4">{t.scopeOutIntro}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.scopeOut.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.contactTitle}</h2>
              <p>{t.contactIntro}</p>
              <div className="bg-slate-800/50 rounded-xl p-6 space-y-2 text-sm">
                <p className="font-semibold text-white">{t.contactCompany}</p>
                <p>
                  {t.contactSecurity}{" "}
                  <a href="mailto:security@revosso.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    security@revosso.com
                  </a>
                </p>
                <p>
                  {t.contactGeneral}{" "}
                  <a href="mailto:contact@revosso.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    contact@revosso.com
                  </a>
                </p>
                <p>{t.contactWebsite} <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">revosso.com</Link></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm text-center md:text-left">© {year} Revosso. {t.allRightsReserved}</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-slate-400 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">{t.footerPrivacy}</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white transition-colors">{t.footerTerms}</Link>
            <span>·</span>
            <Link href="/cookies" className="hover:text-white transition-colors">{t.footerCookies}</Link>
            <span>·</span>
            <Link href="/security" className="hover:text-white transition-colors">{t.footerSecurity}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
