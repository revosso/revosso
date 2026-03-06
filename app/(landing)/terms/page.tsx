"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  s2p1: string
  s2p2: string
  s3Title: string
  s3p1: string
  s3p2: string
  s4Title: string
  s4Intro: string
  s4Items: string[]
  s5Title: string
  s5p1: string
  s5PrivacyLink: string
  s5p2: string
  s6Title: string
  s6p1: string
  s6p2: string
  s7Title: string
  s7p1: string
  s8Title: string
  s8p1: string
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
    title: "Terms of Service",
    lastUpdated: "Last updated:",
    s1Title: "1. Acceptance of Terms",
    s1p1: `By accessing or using the Revosso website at revosso.com ("the Site"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Site.`,
    s1p2: "These Terms apply to all visitors, users, and others who access or use the Site. Revosso reserves the right to modify these Terms at any time. Continued use of the Site after any modifications constitutes acceptance of the revised Terms.",
    s2Title: "2. Services",
    s2p1: "Revosso provides digital infrastructure and platform engineering services, including custom software development, platform modernization, and infrastructure operations. The Site serves as an informational and lead-generation resource for prospective clients.",
    s2p2: "Engagement of Revosso's professional services is governed by separate service agreements entered into between Revosso and the client. These Terms do not constitute or create any obligation on Revosso to provide any services.",
    s3Title: "3. Intellectual Property",
    s3p1: "All content on the Site, including but not limited to text, graphics, logos, images, and software, is the property of Revosso and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of any Site content without prior written permission from Revosso.",
    s3p2: "The Revosso name, logo, and all related marks are trademarks of Revosso. Nothing in these Terms grants you a license to use any trademark displayed on the Site.",
    s4Title: "4. Use of the Site",
    s4Intro: "You agree to use the Site only for lawful purposes. You must not:",
    s4Items: [
      "Use the Site in any way that violates applicable local, national, or international law",
      "Transmit any unsolicited or unauthorized advertising or promotional material",
      "Attempt to gain unauthorized access to any part of the Site or its systems",
      "Transmit any data containing viruses, trojans, or other malicious code",
      "Use automated tools to scrape or harvest data from the Site without prior consent",
      "Submit false or misleading information through the contact form",
    ],
    s5Title: "5. Contact Form Submissions",
    s5p1: "When you submit information through our contact form, you confirm that the information provided is accurate and that you are authorized to make the inquiry on behalf of any organization you represent. Revosso will use this information solely to respond to your inquiry in accordance with our",
    s5PrivacyLink: "Privacy Policy",
    s5p2: "Submission of a contact form does not create any contractual relationship between you and Revosso or any obligation by Revosso to respond or provide services.",
    s6Title: "6. Disclaimer of Warranties",
    s6p1: `The Site and its content are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.`,
    s6p2: "Revosso does not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.",
    s7Title: "7. Limitation of Liability",
    s7p1: "To the fullest extent permitted by applicable law, Revosso shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Site, even if Revosso has been advised of the possibility of such damages.",
    s8Title: "8. Third-Party Links",
    s8p1: "The Site may contain links to third-party websites. These links are provided for convenience only. Revosso has no control over the content of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.",
    s9Title: "9. Governing Law",
    s9p1: "These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising from these Terms or your use of the Site shall be subject to the exclusive jurisdiction of competent courts.",
    s10Title: "10. Contact",
    s10p1: "If you have questions about these Terms, please contact us:",
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
    title: "Conditions d'Utilisation",
    lastUpdated: "Dernière mise à jour :",
    s1Title: "1. Acceptation des Conditions",
    s1p1: `En accédant ou en utilisant le site Web de Revosso à l'adresse revosso.com (« le Site »), vous acceptez d'être lié par ces Conditions d'utilisation (« Conditions »). Si vous n'acceptez pas ces Conditions, veuillez ne pas utiliser le Site.`,
    s1p2: "Ces Conditions s'appliquent à tous les visiteurs, utilisateurs et autres personnes qui accèdent ou utilisent le Site. Revosso se réserve le droit de modifier ces Conditions à tout moment. L'utilisation continue du Site après toute modification constitue l'acceptation des Conditions révisées.",
    s2Title: "2. Services",
    s2p1: "Revosso fournit des services d'infrastructure numérique et d'ingénierie de plateformes, notamment le développement de logiciels personnalisés, la modernisation de plateformes et les opérations d'infrastructure. Le Site sert de ressource informative et de génération de leads pour les clients potentiels.",
    s2p2: "L'engagement des services professionnels de Revosso est régi par des accords de service distincts conclus entre Revosso et le client. Ces Conditions ne constituent pas et ne créent aucune obligation pour Revosso de fournir des services.",
    s3Title: "3. Propriété Intellectuelle",
    s3p1: "Tout le contenu du Site, y compris, sans limitation, les textes, graphiques, logos, images et logiciels, est la propriété de Revosso et est protégé par les lois applicables sur la propriété intellectuelle. Vous ne pouvez pas reproduire, distribuer, modifier ou créer des œuvres dérivées du contenu du Site sans l'autorisation écrite préalable de Revosso.",
    s3p2: "Le nom Revosso, le logo et toutes les marques associées sont des marques déposées de Revosso. Rien dans ces Conditions ne vous accorde une licence pour utiliser une marque affichée sur le Site.",
    s4Title: "4. Utilisation du Site",
    s4Intro: "Vous acceptez d'utiliser le Site uniquement à des fins légales. Vous ne devez pas :",
    s4Items: [
      "Utiliser le Site d'une manière qui viole la loi locale, nationale ou internationale applicable",
      "Transmettre des publicités ou du matériel promotionnel non sollicités ou non autorisés",
      "Tenter d'obtenir un accès non autorisé à toute partie du Site ou de ses systèmes",
      "Transmettre des données contenant des virus, chevaux de Troie ou autres codes malveillants",
      "Utiliser des outils automatisés pour scraper ou récolter des données du Site sans consentement préalable",
      "Soumettre des informations fausses ou trompeuses via le formulaire de contact",
    ],
    s5Title: "5. Soumissions du Formulaire de Contact",
    s5p1: "Lorsque vous soumettez des informations via notre formulaire de contact, vous confirmez que les informations fournies sont exactes et que vous êtes autorisé à faire la demande au nom de toute organisation que vous représentez. Revosso utilisera ces informations uniquement pour répondre à votre demande conformément à notre",
    s5PrivacyLink: "Politique de Confidentialité",
    s5p2: "La soumission d'un formulaire de contact ne crée aucune relation contractuelle entre vous et Revosso ni aucune obligation pour Revosso de répondre ou de fournir des services.",
    s6Title: "6. Exclusion de Garanties",
    s6p1: `Le Site et son contenu sont fournis « en l'état » et « selon disponibilité » sans aucune garantie d'aucune sorte, expresse ou implicite, notamment les garanties de qualité marchande, d'adéquation à un usage particulier ou de non-contrefaçon.`,
    s6p2: "Revosso ne garantit pas que le Site sera ininterrompu, exempt d'erreurs ou exempt de virus ou d'autres composants nuisibles.",
    s7Title: "7. Limitation de Responsabilité",
    s7p1: "Dans toute la mesure permise par la loi applicable, Revosso ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs découlant de votre utilisation ou de votre incapacité à utiliser le Site, même si Revosso a été informé de la possibilité de tels dommages.",
    s8Title: "8. Liens Tiers",
    s8p1: "Le Site peut contenir des liens vers des sites Web tiers. Ces liens sont fournis uniquement pour votre commodité. Revosso n'a aucun contrôle sur le contenu de ces sites et n'accepte aucune responsabilité pour eux ou pour toute perte ou dommage pouvant résulter de votre utilisation.",
    s9Title: "9. Droit Applicable",
    s9p1: "Ces Conditions seront régies et interprétées conformément au droit applicable. Tout litige découlant de ces Conditions ou de votre utilisation du Site sera soumis à la juridiction exclusive des tribunaux compétents.",
    s10Title: "10. Contact",
    s10p1: "Si vous avez des questions sur ces Conditions, veuillez nous contacter :",
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
    title: "Termos de Serviço",
    lastUpdated: "Última atualização:",
    s1Title: "1. Aceitação dos Termos",
    s1p1: `Ao acessar ou usar o site da Revosso em revosso.com ("o Site"), você concorda em se vincular a estes Termos de Serviço ("Termos"). Se você não concordar com estes Termos, por favor não use o Site.`,
    s1p2: "Estes Termos se aplicam a todos os visitantes, usuários e outros que acessam ou usam o Site. A Revosso reserva-se o direito de modificar estes Termos a qualquer momento. O uso continuado do Site após quaisquer modificações constitui aceitação dos Termos revisados.",
    s2Title: "2. Serviços",
    s2p1: "A Revosso fornece serviços de infraestrutura digital e engenharia de plataformas, incluindo desenvolvimento de software personalizado, modernização de plataformas e operações de infraestrutura. O Site serve como recurso informativo e de geração de leads para clientes em potencial.",
    s2p2: "O engajamento dos serviços profissionais da Revosso é regido por acordos de serviço separados firmados entre a Revosso e o cliente. Estes Termos não constituem nem criam qualquer obrigação da Revosso de fornecer quaisquer serviços.",
    s3Title: "3. Propriedade Intelectual",
    s3p1: "Todo o conteúdo do Site, incluindo, mas não limitado a, textos, gráficos, logotipos, imagens e software, é propriedade da Revosso e está protegido pelas leis de propriedade intelectual aplicáveis. Você não pode reproduzir, distribuir, modificar ou criar obras derivadas de qualquer conteúdo do Site sem a permissão prévia por escrito da Revosso.",
    s3p2: "O nome Revosso, o logotipo e todas as marcas relacionadas são marcas registradas da Revosso. Nada nestes Termos concede a você uma licença para usar qualquer marca registrada exibida no Site.",
    s4Title: "4. Uso do Site",
    s4Intro: "Você concorda em usar o Site apenas para fins lícitos. Você não deve:",
    s4Items: [
      "Usar o Site de qualquer forma que viole a lei local, nacional ou internacional aplicável",
      "Transmitir qualquer publicidade ou material promocional não solicitado ou não autorizado",
      "Tentar obter acesso não autorizado a qualquer parte do Site ou seus sistemas",
      "Transmitir quaisquer dados contendo vírus, trojans ou outros códigos maliciosos",
      "Usar ferramentas automatizadas para extrair ou coletar dados do Site sem consentimento prévio",
      "Enviar informações falsas ou enganosas por meio do formulário de contato",
    ],
    s5Title: "5. Envios do Formulário de Contato",
    s5p1: "Ao enviar informações por meio do nosso formulário de contato, você confirma que as informações fornecidas são precisas e que está autorizado a fazer a consulta em nome de qualquer organização que representa. A Revosso usará essas informações exclusivamente para responder à sua consulta de acordo com nossa",
    s5PrivacyLink: "Política de Privacidade",
    s5p2: "O envio de um formulário de contato não cria qualquer relação contratual entre você e a Revosso nem qualquer obrigação da Revosso de responder ou fornecer serviços.",
    s6Title: "6. Isenção de Garantias",
    s6p1: `O Site e seu conteúdo são fornecidos "como estão" e "conforme disponíveis" sem quaisquer garantias de qualquer tipo, expressas ou implícitas, incluindo, mas não se limitando a, garantias de comerciabilidade, adequação a uma finalidade específica ou não violação.`,
    s6p2: "A Revosso não garante que o Site será ininterrupto, sem erros ou livre de vírus ou outros componentes prejudiciais.",
    s7Title: "7. Limitação de Responsabilidade",
    s7p1: "Na máxima extensão permitida pela lei aplicável, a Revosso não será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do uso ou impossibilidade de uso do Site, mesmo que a Revosso tenha sido avisada sobre a possibilidade de tais danos.",
    s8Title: "8. Links de Terceiros",
    s8p1: "O Site pode conter links para sites de terceiros. Esses links são fornecidos apenas por conveniência. A Revosso não tem controle sobre o conteúdo desses sites e não aceita responsabilidade por eles ou por qualquer perda ou dano que possa resultar do seu uso.",
    s9Title: "9. Lei Aplicável",
    s9p1: "Estes Termos serão regidos e interpretados de acordo com a lei aplicável. Quaisquer disputas decorrentes destes Termos ou do uso do Site estarão sujeitas à jurisdição exclusiva dos tribunais competentes.",
    s10Title: "10. Contato",
    s10p1: "Se você tiver dúvidas sobre estes Termos, entre em contato conosco:",
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
    title: "Términos de Servicio",
    lastUpdated: "Última actualización:",
    s1Title: "1. Aceptación de los Términos",
    s1p1: `Al acceder o utilizar el sitio web de Revosso en revosso.com ("el Sitio"), usted acepta estar sujeto a estos Términos de Servicio ("Términos"). Si no está de acuerdo con estos Términos, por favor no use el Sitio.`,
    s1p2: "Estos Términos se aplican a todos los visitantes, usuarios y otros que acceden o utilizan el Sitio. Revosso se reserva el derecho de modificar estos Términos en cualquier momento. El uso continuado del Sitio después de cualquier modificación constituye la aceptación de los Términos revisados.",
    s2Title: "2. Servicios",
    s2p1: "Revosso proporciona servicios de infraestructura digital e ingeniería de plataformas, incluido el desarrollo de software personalizado, la modernización de plataformas y las operaciones de infraestructura. El Sitio sirve como recurso informativo y de generación de clientes potenciales para clientes prospectivos.",
    s2p2: "La contratación de los servicios profesionales de Revosso se rige por acuerdos de servicio separados celebrados entre Revosso y el cliente. Estos Términos no constituyen ni crean ninguna obligación de Revosso de proporcionar ningún servicio.",
    s3Title: "3. Propiedad Intelectual",
    s3p1: "Todo el contenido del Sitio, incluidos, entre otros, textos, gráficos, logotipos, imágenes y software, es propiedad de Revosso y está protegido por las leyes de propiedad intelectual aplicables. No puede reproducir, distribuir, modificar ni crear obras derivadas de ningún contenido del Sitio sin el permiso previo por escrito de Revosso.",
    s3p2: "El nombre Revosso, el logotipo y todas las marcas relacionadas son marcas comerciales de Revosso. Nada en estos Términos le otorga una licencia para usar ninguna marca comercial que aparezca en el Sitio.",
    s4Title: "4. Uso del Sitio",
    s4Intro: "Usted acepta usar el Sitio solo para fines legales. No debe:",
    s4Items: [
      "Usar el Sitio de cualquier manera que viole la ley local, nacional o internacional aplicable",
      "Transmitir cualquier publicidad o material promocional no solicitado o no autorizado",
      "Intentar obtener acceso no autorizado a cualquier parte del Sitio o sus sistemas",
      "Transmitir datos que contengan virus, troyanos u otro código malicioso",
      "Usar herramientas automatizadas para extraer o recopilar datos del Sitio sin consentimiento previo",
      "Enviar información falsa o engañosa a través del formulario de contacto",
    ],
    s5Title: "5. Envíos del Formulario de Contacto",
    s5p1: "Al enviar información a través de nuestro formulario de contacto, confirma que la información proporcionada es precisa y que está autorizado a realizar la consulta en nombre de cualquier organización que represente. Revosso utilizará esta información únicamente para responder a su consulta de acuerdo con nuestra",
    s5PrivacyLink: "Política de Privacidad",
    s5p2: "El envío de un formulario de contacto no crea ninguna relación contractual entre usted y Revosso ni ninguna obligación de Revosso de responder o proporcionar servicios.",
    s6Title: "6. Exclusión de Garantías",
    s6p1: `El Sitio y su contenido se proporcionan "tal cual" y "según disponibilidad" sin garantías de ningún tipo, expresas o implícitas, incluidas, entre otras, garantías de comerciabilidad, idoneidad para un propósito particular o no infracción.`,
    s6p2: "Revosso no garantiza que el Sitio sea ininterrumpido, libre de errores o libre de virus u otros componentes dañinos.",
    s7Title: "7. Limitación de Responsabilidad",
    s7p1: "En la medida máxima permitida por la ley aplicable, Revosso no será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos que surjan de su uso o incapacidad para usar el Sitio, incluso si Revosso ha sido advertido de la posibilidad de tales daños.",
    s8Title: "8. Enlaces de Terceros",
    s8p1: "El Sitio puede contener enlaces a sitios web de terceros. Estos enlaces se proporcionan solo por conveniencia. Revosso no tiene control sobre el contenido de esos sitios y no acepta ninguna responsabilidad por ellos ni por ninguna pérdida o daño que pueda surgir de su uso.",
    s9Title: "9. Ley Aplicable",
    s9p1: "Estos Términos se regirán e interpretarán de acuerdo con la ley aplicable. Cualquier disputa que surja de estos Términos o de su uso del Sitio estará sujeta a la jurisdicción exclusiva de los tribunales competentes.",
    s10Title: "10. Contacto",
    s10p1: "Si tiene preguntas sobre estos Términos, contáctenos:",
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

export default function TermsPage() {
  const [locale, setLocale] = useState<Locale>("en")

  useEffect(() => {
    const saved = localStorage.getItem("revosso-locale") as Locale | null
    if (saved && ["en", "fr", "pt-BR", "es"].includes(saved)) {
      setLocale(saved)
      return
    }
    const l = navigator.language || "en"
    if (l.startsWith("fr")) setLocale("fr")
    else if (l.startsWith("pt")) setLocale("pt-BR")
    else if (l.startsWith("es")) setLocale("es")
    else setLocale("en")
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
              <p>{t.s2p1}</p>
              <p>{t.s2p2}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s3Title}</h2>
              <p>{t.s3p1}</p>
              <p>{t.s3p2}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s4Title}</h2>
              <p>{t.s4Intro}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {t.s4Items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s5Title}</h2>
              <p>
                {t.s5p1}{" "}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                  {t.s5PrivacyLink}
                </Link>.
              </p>
              <p>{t.s5p2}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s6Title}</h2>
              <p>{t.s6p1}</p>
              <p>{t.s6p2}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s7Title}</h2>
              <p>{t.s7p1}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">{t.s8Title}</h2>
              <p>{t.s8p1}</p>
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
          <p className="text-slate-400 text-sm">© {year} Revosso. {t.allRightsReserved}</p>
          <div className="flex gap-4 text-slate-400 text-sm">
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
