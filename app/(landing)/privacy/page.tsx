"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { resolveInitialLandingLocale } from "@/lib/landing-locale"
import { Code, ArrowLeft } from "lucide-react"

type Locale = "en" | "fr" | "pt-BR" | "es"

const data: Record<Locale, {
  backToHome: string
  title: string
  lastUpdated: string
  s1Title: string
  s1p1: string
  s1p2: string
  s2Title: string
  s2_1Title: string
  s2_1Intro: string
  s2_1Items: string[]
  s2_2Title: string
  s2_2Intro: string
  s2_2Items: string[]
  s3Title: string
  s3Intro: string
  s3Items: string[]
  s3Outro: string
  s4Title: string
  s4p1: string
  s4p2: string
  s5Title: string
  s5Intro: string
  s5Items: string[]
  s5Outro: string
  s6Title: string
  s6Intro: string
  s6Items: string[]
  s6Outro: string
  s7Title: string
  s7Intro: string
  s7Items: { label: string; text: string }[]
  s7Outro: string
  s8Title: string
  s8p1: string
  s8Link: string
  s9Title: string
  s9p1: string
  s10Title: string
  s10p1: string
  s10Company: string
  s10Email: string
  s10Website: string
  allRightsReserved: string
  footerPrivacy: string
  footerTerms: string
  footerCookies: string
  footerSecurity: string
}> = {
  en: {
    backToHome: "Back to Home",
    title: "Privacy Policy",
    lastUpdated: "Last updated:",
    s1Title: "1. Introduction",
    s1p1: `Revosso ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at revosso.com or contact us through our platform.`,
    s1p2: "By using our website, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this policy, please do not access the site.",
    s2Title: "2. Information We Collect",
    s2_1Title: "2.1 Information You Provide",
    s2_1Intro: "When you contact us through our contact form, we collect:",
    s2_1Items: ["Name", "Email address", "Company name (optional)", "Project description or message", "Area of interest (e.g., new platform, infrastructure, partnership)"],
    s2_2Title: "2.2 Information Collected Automatically",
    s2_2Intro: "When you visit our website, we automatically collect certain technical information:",
    s2_2Items: ["IP address (anonymized for analytics purposes)", "Browser type and version", "Pages visited and time spent", "Referring URL", "Browser language preference"],
    s3Title: "3. How We Use Your Information",
    s3Intro: "We use the information we collect to:",
    s3Items: ["Respond to your inquiries and project requests", "Send confirmation emails acknowledging receipt of your message", "Understand how visitors interact with our website to improve our services", "Comply with legal obligations", "Prevent fraudulent or abusive use of our services"],
    s3Outro: "We do not use your personal information for marketing or advertising purposes without your explicit consent. We do not sell, rent, or trade your personal information to third parties.",
    s4Title: "4. Data Retention",
    s4p1: "We retain contact form submissions and related lead information for up to 24 months from the date of submission, or until you request deletion, whichever is earlier. Anonymous visitor analytics data is retained for up to 12 months.",
    s4p2: "You may request deletion of your personal data at any time by contacting us at",
    s5Title: "5. Data Security",
    s5Intro: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:",
    s5Items: ["Encrypted data transmission (HTTPS/TLS)", "Secure database storage with access controls", "Regular security reviews of our infrastructure", "Limited access to personal data on a need-to-know basis"],
    s5Outro: "However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.",
    s6Title: "6. Third-Party Services",
    s6Intro: "We use the following categories of third-party services that may process your data:",
    s6Items: ["Cloud hosting provider — hosting and infrastructure", "Database storage provider — encrypted database storage", "Authentication service provider — authentication for internal admin access", "Analytics provider — anonymized website traffic analytics"],
    s6Outro: "Each of these providers has their own privacy policies governing their use of data. We encourage you to review their respective policies.",
    s7Title: "7. Your Rights",
    s7Intro: "Depending on your jurisdiction, you may have the following rights regarding your personal data:",
    s7Items: [
      { label: "Access", text: "request a copy of the personal data we hold about you" },
      { label: "Rectification", text: "request correction of inaccurate data" },
      { label: "Erasure", text: "request deletion of your personal data" },
      { label: "Portability", text: "request your data in a structured, machine-readable format" },
      { label: "Objection", text: "object to certain types of data processing" },
    ],
    s7Outro: "To exercise any of these rights, please contact us at contact@revosso.com. We will respond to your request within 30 days.",
    s8Title: "8. Cookies",
    s8p1: "We use cookies and similar tracking technologies. For details on the cookies we use and how to manage your preferences, please see our",
    s8Link: "Cookie Policy",
    s9Title: "9. Changes to This Policy",
    s9p1: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating the "Last updated" date at the top of this page. Your continued use of our website after any changes constitutes your acceptance of the updated policy.`,
    s10Title: "10. Contact Us",
    s10p1: "If you have any questions about this Privacy Policy or our data practices, please contact us:",
    s10Company: "Revosso",
    s10Email: "Email:",
    s10Website: "Website:",
    allRightsReserved: "All rights reserved.",
    footerPrivacy: "Privacy",
    footerTerms: "Terms",
    footerCookies: "Cookies",
    footerSecurity: "Security",
  },
  fr: {
    backToHome: "Retour à l'accueil",
    title: "Politique de Confidentialité",
    lastUpdated: "Dernière mise à jour :",
    s1Title: "1. Introduction",
    s1p1: `Revosso (« nous », « notre » ou « nos ») s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site Web revosso.com ou nous contactez via notre plateforme.`,
    s1p2: "En utilisant notre site Web, vous acceptez la collecte et l'utilisation des informations conformément à cette politique. Si vous n'acceptez pas les termes de cette politique, veuillez ne pas accéder au site.",
    s2Title: "2. Informations que Nous Collectons",
    s2_1Title: "2.1 Informations que vous fournissez",
    s2_1Intro: "Lorsque vous nous contactez via notre formulaire de contact, nous collectons :",
    s2_1Items: ["Nom", "Adresse e-mail", "Nom de l'entreprise (facultatif)", "Description du projet ou message", "Domaine d'intérêt (ex. : nouvelle plateforme, infrastructure, partenariat)"],
    s2_2Title: "2.2 Informations collectées automatiquement",
    s2_2Intro: "Lorsque vous visitez notre site Web, nous collectons automatiquement certaines informations techniques :",
    s2_2Items: ["Adresse IP (anonymisée à des fins d'analyse)", "Type et version du navigateur", "Pages visitées et temps passé", "URL de référence", "Préférence de langue du navigateur"],
    s3Title: "3. Utilisation de Vos Informations",
    s3Intro: "Nous utilisons les informations collectées pour :",
    s3Items: ["Répondre à vos demandes et requêtes de projet", "Envoyer des e-mails de confirmation accusant réception de votre message", "Comprendre comment les visiteurs interagissent avec notre site pour améliorer nos services", "Respecter les obligations légales", "Prévenir l'utilisation frauduleuse ou abusive de nos services"],
    s3Outro: "Nous n'utilisons pas vos informations personnelles à des fins de marketing ou de publicité sans votre consentement explicite. Nous ne vendons, ne louons ni n'échangeons vos informations personnelles à des tiers.",
    s4Title: "4. Conservation des Données",
    s4p1: "Nous conservons les soumissions de formulaires de contact et les informations de prospects associées pendant 24 mois maximum à compter de la date de soumission, ou jusqu'à votre demande de suppression, selon la première éventualité. Les données analytiques anonymes des visiteurs sont conservées pendant 12 mois maximum.",
    s4p2: "Vous pouvez demander la suppression de vos données personnelles à tout moment en nous contactant à",
    s5Title: "5. Sécurité des Données",
    s5Intro: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos informations personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction. Ces mesures comprennent :",
    s5Items: ["Transmission de données chiffrée (HTTPS/TLS)", "Stockage sécurisé des données avec contrôles d'accès", "Examens réguliers de la sécurité de notre infrastructure", "Accès limité aux données personnelles selon le principe du besoin de savoir"],
    s5Outro: "Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est sécurisée à 100 %. Bien que nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger vos données, nous ne pouvons garantir une sécurité absolue.",
    s6Title: "6. Services Tiers",
    s6Intro: "Nous faisons appel aux catégories de services tiers suivantes susceptibles de traiter vos données :",
    s6Items: ["Fournisseur d'hébergement cloud — hébergement et infrastructure", "Fournisseur de stockage de base de données — stockage de données chiffré", "Fournisseur de services d'authentification — authentification pour l'accès administrateur interne", "Fournisseur d'analyse — statistiques de trafic web anonymisées"],
    s6Outro: "Chacun de ces fournisseurs dispose de ses propres politiques de confidentialité régissant l'utilisation des données. Nous vous encourageons à consulter leurs politiques respectives.",
    s7Title: "7. Vos Droits",
    s7Intro: "Selon votre juridiction, vous pouvez disposer des droits suivants concernant vos données personnelles :",
    s7Items: [
      { label: "Accès", text: "demander une copie des données personnelles que nous détenons à votre sujet" },
      { label: "Rectification", text: "demander la correction de données inexactes" },
      { label: "Effacement", text: "demander la suppression de vos données personnelles" },
      { label: "Portabilité", text: "demander vos données dans un format structuré et lisible par machine" },
      { label: "Opposition", text: "vous opposer à certains types de traitement de données" },
    ],
    s7Outro: "Pour exercer l'un de ces droits, veuillez nous contacter à contact@revosso.com. Nous répondrons à votre demande dans les 30 jours.",
    s8Title: "8. Cookies",
    s8p1: "Nous utilisons des cookies et des technologies de suivi similaires. Pour plus de détails sur les cookies que nous utilisons et la façon de gérer vos préférences, veuillez consulter notre",
    s8Link: "Politique en matière de cookies",
    s9Title: "9. Modifications de Cette Politique",
    s9p1: `Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement important en mettant à jour la date de « Dernière mise à jour » en haut de cette page. Votre utilisation continue de notre site Web après toute modification constitue votre acceptation de la politique mise à jour.`,
    s10Title: "10. Nous Contacter",
    s10p1: "Si vous avez des questions sur cette politique de confidentialité ou nos pratiques en matière de données, veuillez nous contacter :",
    s10Company: "Revosso",
    s10Email: "Courriel :",
    s10Website: "Site web :",
    allRightsReserved: "Tous droits réservés.",
    footerPrivacy: "Confidentialité",
    footerTerms: "Conditions",
    footerCookies: "Cookies",
    footerSecurity: "Sécurité",
  },
  "pt-BR": {
    backToHome: "Voltar ao início",
    title: "Política de Privacidade",
    lastUpdated: "Última atualização:",
    s1Title: "1. Introdução",
    s1p1: `A Revosso ("nós", "nosso" ou "nos") está comprometida com a proteção de sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você visita nosso site revosso.com ou nos contata por meio de nossa plataforma.`,
    s1p2: "Ao usar nosso site, você concorda com a coleta e uso de informações de acordo com esta política. Se você não concordar com os termos desta política, por favor não acesse o site.",
    s2Title: "2. Informações que Coletamos",
    s2_1Title: "2.1 Informações que você fornece",
    s2_1Intro: "Quando você nos contata por meio do formulário de contato, coletamos:",
    s2_1Items: ["Nome", "Endereço de e-mail", "Nome da empresa (opcional)", "Descrição do projeto ou mensagem", "Área de interesse (ex.: nova plataforma, infraestrutura, parceria)"],
    s2_2Title: "2.2 Informações coletadas automaticamente",
    s2_2Intro: "Quando você visita nosso site, coletamos automaticamente determinadas informações técnicas:",
    s2_2Items: ["Endereço IP (anonimizado para fins analíticos)", "Tipo e versão do navegador", "Páginas visitadas e tempo gasto", "URL de referência", "Preferência de idioma do navegador"],
    s3Title: "3. Como Usamos Suas Informações",
    s3Intro: "Usamos as informações coletadas para:",
    s3Items: ["Responder às suas consultas e solicitações de projeto", "Enviar e-mails de confirmação acusando recebimento de sua mensagem", "Entender como os visitantes interagem com nosso site para melhorar nossos serviços", "Cumprir obrigações legais", "Prevenir o uso fraudulento ou abusivo de nossos serviços"],
    s3Outro: "Não usamos suas informações pessoais para fins de marketing ou publicidade sem seu consentimento explícito. Não vendemos, alugamos nem negociamos suas informações pessoais a terceiros.",
    s4Title: "4. Retenção de Dados",
    s4p1: "Retemos as submissões do formulário de contato e informações de leads relacionadas por até 24 meses a partir da data de envio, ou até que você solicite a exclusão, o que ocorrer primeiro. Os dados analíticos anônimos de visitantes são retidos por até 12 meses.",
    s4p2: "Você pode solicitar a exclusão de seus dados pessoais a qualquer momento entrando em contato conosco em",
    s5Title: "5. Segurança dos Dados",
    s5Intro: "Implementamos medidas técnicas e organizacionais adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Essas medidas incluem:",
    s5Items: ["Transmissão de dados criptografada (HTTPS/TLS)", "Armazenamento seguro de banco de dados com controles de acesso", "Revisões regulares de segurança de nossa infraestrutura", "Acesso limitado a dados pessoais com base na necessidade de conhecimento"],
    s5Outro: "No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro. Embora nos esforcemos para usar meios comercialmente aceitáveis para proteger seus dados, não podemos garantir segurança absoluta.",
    s6Title: "6. Serviços de Terceiros",
    s6Intro: "Utilizamos as seguintes categorias de serviços de terceiros que podem processar seus dados:",
    s6Items: ["Provedor de hospedagem em nuvem — hospedagem e infraestrutura", "Provedor de armazenamento de banco de dados — armazenamento de dados criptografado", "Provedor de serviços de autenticação — autenticação para acesso administrativo interno", "Provedor de análise — análise de tráfego de site anonimizada"],
    s6Outro: "Cada um desses provedores possui suas próprias políticas de privacidade que regem o uso de dados. Encorajamos você a revisar suas respectivas políticas.",
    s7Title: "7. Seus Direitos",
    s7Intro: "Dependendo de sua jurisdição, você pode ter os seguintes direitos em relação aos seus dados pessoais:",
    s7Items: [
      { label: "Acesso", text: "solicitar uma cópia dos dados pessoais que mantemos sobre você" },
      { label: "Retificação", text: "solicitar a correção de dados imprecisos" },
      { label: "Exclusão", text: "solicitar a exclusão de seus dados pessoais" },
      { label: "Portabilidade", text: "solicitar seus dados em um formato estruturado e legível por máquina" },
      { label: "Objeção", text: "objetar a certos tipos de processamento de dados" },
    ],
    s7Outro: "Para exercer qualquer um desses direitos, entre em contato conosco em contact@revosso.com. Responderemos à sua solicitação em 30 dias.",
    s8Title: "8. Cookies",
    s8p1: "Usamos cookies e tecnologias de rastreamento similares. Para detalhes sobre os cookies que usamos e como gerenciar suas preferências, consulte nossa",
    s8Link: "Política de Cookies",
    s9Title: "9. Alterações nesta Política",
    s9p1: `Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações significativas atualizando a data de "Última atualização" no topo desta página. Seu uso continuado de nosso site após quaisquer alterações constitui sua aceitação da política atualizada.`,
    s10Title: "10. Fale Conosco",
    s10p1: "Se você tiver dúvidas sobre esta Política de Privacidade ou nossas práticas de dados, entre em contato conosco:",
    s10Company: "Revosso",
    s10Email: "E-mail:",
    s10Website: "Site:",
    allRightsReserved: "Todos os direitos reservados.",
    footerPrivacy: "Privacidade",
    footerTerms: "Termos",
    footerCookies: "Cookies",
    footerSecurity: "Segurança",
  },
  es: {
    backToHome: "Volver al inicio",
    title: "Política de Privacidad",
    lastUpdated: "Última actualización:",
    s1Title: "1. Introducción",
    s1p1: `Revosso ("nosotros", "nuestro" o "nos") está comprometido con la protección de su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando visita nuestro sitio web revosso.com o nos contacta a través de nuestra plataforma.`,
    s1p2: "Al usar nuestro sitio web, usted acepta la recopilación y el uso de información de acuerdo con esta política. Si no está de acuerdo con los términos de esta política, por favor no acceda al sitio.",
    s2Title: "2. Información que Recopilamos",
    s2_1Title: "2.1 Información que usted proporciona",
    s2_1Intro: "Cuando nos contacta a través de nuestro formulario de contacto, recopilamos:",
    s2_1Items: ["Nombre", "Dirección de correo electrónico", "Nombre de la empresa (opcional)", "Descripción del proyecto o mensaje", "Área de interés (ej.: nueva plataforma, infraestructura, asociación)"],
    s2_2Title: "2.2 Información recopilada automáticamente",
    s2_2Intro: "Cuando visita nuestro sitio web, recopilamos automáticamente cierta información técnica:",
    s2_2Items: ["Dirección IP (anonimizada para fines analíticos)", "Tipo y versión del navegador", "Páginas visitadas y tiempo dedicado", "URL de referencia", "Preferencia de idioma del navegador"],
    s3Title: "3. Cómo Usamos Su Información",
    s3Intro: "Usamos la información recopilada para:",
    s3Items: ["Responder a sus consultas y solicitudes de proyecto", "Enviar correos electrónicos de confirmación acusando recibo de su mensaje", "Comprender cómo los visitantes interactúan con nuestro sitio para mejorar nuestros servicios", "Cumplir con las obligaciones legales", "Prevenir el uso fraudulento o abusivo de nuestros servicios"],
    s3Outro: "No usamos su información personal para fines de marketing o publicidad sin su consentimiento explícito. No vendemos, alquilamos ni intercambiamos su información personal a terceros.",
    s4Title: "4. Retención de Datos",
    s4p1: "Conservamos las presentaciones del formulario de contacto y la información de clientes potenciales relacionada durante hasta 24 meses desde la fecha de presentación, o hasta que solicite la eliminación, lo que ocurra primero. Los datos analíticos anónimos de visitantes se conservan durante hasta 12 meses.",
    s4p2: "Puede solicitar la eliminación de sus datos personales en cualquier momento contactándonos en",
    s5Title: "5. Seguridad de los Datos",
    s5Intro: "Implementamos medidas técnicas y organizativas adecuadas para proteger su información personal contra el acceso no autorizado, alteración, divulgación o destrucción. Estas medidas incluyen:",
    s5Items: ["Transmisión de datos cifrada (HTTPS/TLS)", "Almacenamiento seguro de base de datos con controles de acceso", "Revisiones regulares de seguridad de nuestra infraestructura", "Acceso limitado a datos personales según la necesidad de conocer"],
    s5Outro: "Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro. Si bien nos esforzamos por utilizar medios comercialmente aceptables para proteger sus datos, no podemos garantizar una seguridad absoluta.",
    s6Title: "6. Servicios de Terceros",
    s6Intro: "Utilizamos las siguientes categorías de servicios de terceros que pueden procesar sus datos:",
    s6Items: ["Proveedor de alojamiento en la nube — alojamiento e infraestructura", "Proveedor de almacenamiento de base de datos — almacenamiento de datos cifrado", "Proveedor de servicios de autenticación — autenticación para acceso administrativo interno", "Proveedor de análisis — análisis de tráfico web anonimizado"],
    s6Outro: "Cada uno de estos proveedores tiene sus propias políticas de privacidad que rigen el uso de los datos. Le animamos a revisar sus respectivas políticas.",
    s7Title: "7. Sus Derechos",
    s7Intro: "Dependiendo de su jurisdicción, puede tener los siguientes derechos con respecto a sus datos personales:",
    s7Items: [
      { label: "Acceso", text: "solicitar una copia de los datos personales que tenemos sobre usted" },
      { label: "Rectificación", text: "solicitar la corrección de datos inexactos" },
      { label: "Supresión", text: "solicitar la eliminación de sus datos personales" },
      { label: "Portabilidad", text: "solicitar sus datos en un formato estructurado y legible por máquina" },
      { label: "Objeción", text: "objetar a ciertos tipos de procesamiento de datos" },
    ],
    s7Outro: "Para ejercer cualquiera de estos derechos, contáctenos en contact@revosso.com. Responderemos a su solicitud en 30 días.",
    s8Title: "8. Cookies",
    s8p1: "Utilizamos cookies y tecnologías de seguimiento similares. Para obtener detalles sobre las cookies que utilizamos y cómo administrar sus preferencias, consulte nuestra",
    s8Link: "Política de Cookies",
    s9Title: "9. Cambios en esta Política",
    s9p1: `Podemos actualizar esta Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio significativo actualizando la fecha de "Última actualización" en la parte superior de esta página. Su uso continuado de nuestro sitio web después de cualquier cambio constituye su aceptación de la política actualizada.`,
    s10Title: "10. Contáctenos",
    s10p1: "Si tiene alguna pregunta sobre esta Política de Privacidad o nuestras prácticas de datos, contáctenos:",
    s10Company: "Revosso",
    s10Email: "Correo electrónico:",
    s10Website: "Sitio web:",
    allRightsReserved: "Todos los derechos reservados.",
    footerPrivacy: "Privacidad",
    footerTerms: "Términos",
    footerCookies: "Cookies",
    footerSecurity: "Seguridad",
  },
}

const lastUpdated = "March 2026"

export default function PrivacyPage() {
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
          </div>

          <div className="space-y-10 text-slate-300 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s1Title}</h2>
              <p>{t.s1p1}</p>
              <p>{t.s1p2}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s2Title}</h2>
              <h3 className="text-lg font-medium text-slate-200">{t.s2_1Title}</h3>
              <p>{t.s2_1Intro}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.s2_1Items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <h3 className="text-lg font-medium text-slate-200 mt-6">{t.s2_2Title}</h3>
              <p>{t.s2_2Intro}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.s2_2Items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s3Title}</h2>
              <p>{t.s3Intro}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.s3Items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <p>{t.s3Outro}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s4Title}</h2>
              <p>{t.s4p1}</p>
              <p>
                {t.s4p2}{" "}
                <a href="mailto:contact@revosso.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  contact@revosso.com
                </a>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s5Title}</h2>
              <p>{t.s5Intro}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.s5Items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <p>{t.s5Outro}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s6Title}</h2>
              <p>{t.s6Intro}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.s6Items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <p>{t.s6Outro}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s7Title}</h2>
              <p>{t.s7Intro}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.s7Items.map((item, i) => (
                  <li key={i}><strong className="text-slate-200">{item.label}</strong> — {item.text}</li>
                ))}
              </ul>
              <p>{t.s7Outro}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s8Title}</h2>
              <p>
                {t.s8p1}{" "}
                <Link href="/cookies" className="text-blue-400 hover:text-blue-300 transition-colors">
                  {t.s8Link}
                </Link>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s9Title}</h2>
              <p>{t.s9p1}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s10Title}</h2>
              <p>{t.s10p1}</p>
              <div className="bg-slate-800/50 rounded-xl p-6 space-y-2 text-sm">
                <p className="font-semibold text-white">{t.s10Company}</p>
                <p>
                  {t.s10Email}{" "}
                  <a href="mailto:contact@revosso.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    contact@revosso.com
                  </a>
                </p>
                <p>{t.s10Website} <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">revosso.com</Link></p>
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
