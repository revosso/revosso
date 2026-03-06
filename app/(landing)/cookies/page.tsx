"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Code, ArrowLeft } from "lucide-react"

const translations = {
  en: {
    title: "Cookie Policy",
    lastUpdated: "Last Updated",
    lastUpdatedDate: "March 5, 2026",
    backToHome: "Back to Home",
    sections: [
      {
        title: "Introduction",
        content: [
          "This Cookie Policy explains how Revosso (\"we,\" \"us,\" or \"our\") uses cookies and similar tracking technologies on our website.",
          "By using our website, you consent to the use of cookies as described in this policy. If you do not agree with our use of cookies, you can adjust your browser settings or discontinue use of our website."
        ]
      },
      {
        title: "What Are Cookies",
        content: [
          "Cookies are small text files that are placed on your device (computer, smartphone, tablet) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.",
          "Cookies help improve your browsing experience by:",
          "• Remembering your preferences and settings",
          "• Enabling website functionality",
          "• Understanding how you use the website",
          "• Improving website performance and user experience",
          "Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer."
        ]
      },
      {
        title: "How We Use Cookies",
        content: [
          "We use cookies on our website for the following purposes:",
          "• To remember your language preference",
          "• To analyze website traffic and user behavior",
          "• To understand which pages are most visited and how users navigate the site",
          "• To improve website functionality and user experience",
          "• To maintain website security",
          "We do not use cookies to track you across other websites or to serve targeted advertising."
        ]
      },
      {
        title: "Types of Cookies We Use",
        content: [
          "Essential Cookies:",
          "These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.",
          "Preference Cookies:",
          "These cookies allow the website to remember your choices, such as your preferred language. This provides a more personalized experience and saves you from having to re-enter your preferences each time you visit.",
          "Analytics Cookies:",
          "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the website and understand which sections are most useful to our visitors.",
          "We use analytics cookies to track:",
          "• Number of visitors",
          "• Pages visited",
          "• Time spent on pages",
          "• User flow and navigation patterns",
          "• Geographic location (country/region level)",
          "This information is aggregated and does not identify individual users."
        ]
      },
      {
        title: "Third-Party Cookies",
        content: [
          "We may use third-party services that set cookies on your device to help us analyze website usage and improve our services. These third parties may include:",
          "• Analytics services (e.g., Google Analytics or similar tools)",
          "These third-party services may collect information about your online activities over time and across different websites. We do not control these third-party cookies, and they are subject to the respective third party's privacy policy.",
          "We carefully select third-party services and only work with reputable providers that comply with applicable data protection laws."
        ]
      },
      {
        title: "Managing Cookies",
        content: [
          "You have control over cookies and can manage them in several ways:",
          "Browser Settings:",
          "Most web browsers allow you to control cookies through their settings. You can:",
          "• Block all cookies",
          "• Block third-party cookies only",
          "• Delete cookies after each browsing session",
          "• Allow cookies only from specific websites",
          "Please note that blocking or deleting cookies may affect your experience on our website and limit certain functionalities.",
          "To learn how to manage cookies in your specific browser, please consult your browser's help documentation:",
          "• Google Chrome: Settings > Privacy and security > Cookies",
          "• Mozilla Firefox: Settings > Privacy & Security > Cookies",
          "• Safari: Preferences > Privacy > Cookies",
          "• Microsoft Edge: Settings > Privacy and security > Cookies",
          "Opt-Out Tools:",
          "For analytics cookies, you may be able to opt out through the third-party service provider's opt-out mechanism. For example, Google Analytics provides an opt-out browser add-on."
        ]
      },
      {
        title: "Cookie Duration",
        content: [
          "Cookies can be either session cookies or persistent cookies:",
          "Session Cookies:",
          "These are temporary cookies that are deleted when you close your browser. They help the website remember what you're doing as you move between pages.",
          "Persistent Cookies:",
          "These cookies remain on your device for a set period or until you manually delete them. They remember your preferences for future visits.",
          "We use both session and persistent cookies. Our persistent cookies typically expire after 12 months, though this may vary depending on the specific cookie's purpose."
        ]
      },
      {
        title: "Cookies and Personal Information",
        content: [
          "Most cookies we use do not collect personal information that identifies you as an individual. They collect aggregated, anonymous data about website usage.",
          "However, some cookies may be linked to other information you provide, such as when you submit a contact form. In such cases, the data is handled according to our Privacy Policy.",
          "We do not use cookies to:",
          "• Collect sensitive personal information",
          "• Track you across unrelated websites",
          "• Serve targeted advertising based on your browsing behavior",
          "• Share cookie data with third parties for their marketing purposes"
        ]
      },
      {
        title: "Do Not Track Signals",
        content: [
          "Some browsers support a \"Do Not Track\" (DNT) feature that signals to websites that you do not want to be tracked. Currently, there is no industry-wide standard for responding to DNT signals.",
          "While we respect user privacy, our website does not currently respond to DNT signals. You can manage cookies through your browser settings as described above."
        ]
      },
      {
        title: "Updates to This Cookie Policy",
        content: [
          "We may update this Cookie Policy from time to time to reflect changes in our practices, technologies, or legal requirements.",
          "Any changes will be posted on this page with an updated \"Last Updated\" date. We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies."
        ]
      },
      {
        title: "Contact Us",
        content: [
          "If you have questions or concerns about our use of cookies, please contact us at:",
          "Email: privacy@revosso.com",
          "General Contact: contact@revosso.com",
          "For more information about how we handle your personal data, please see our Privacy Policy."
        ]
      }
    ]
  },
  fr: {
    title: "Politique de Cookies",
    lastUpdated: "Dernière mise à jour",
    lastUpdatedDate: "5 mars 2026",
    backToHome: "Retour à l'accueil",
    sections: [
      {
        title: "Introduction",
        content: [
          "Cette Politique de Cookies explique comment Revosso (« nous », « notre ») utilise les cookies et technologies de suivi similaires sur notre site web.",
          "En utilisant notre site web, vous consentez à l'utilisation de cookies comme décrit dans cette politique. Si vous n'êtes pas d'accord avec notre utilisation des cookies, vous pouvez ajuster les paramètres de votre navigateur ou cesser d'utiliser notre site web."
        ]
      },
      {
        title: "Que Sont les Cookies",
        content: [
          "Les cookies sont de petits fichiers texte placés sur votre appareil (ordinateur, smartphone, tablette) lorsque vous visitez un site web. Ils sont largement utilisés pour faire fonctionner les sites web plus efficacement et fournir des informations aux propriétaires de sites.",
          "Les cookies aident à améliorer votre expérience de navigation en :",
          "• Mémorisant vos préférences et paramètres",
          "• Activant les fonctionnalités du site web",
          "• Comprenant comment vous utilisez le site web",
          "• Améliorant les performances et l'expérience utilisateur du site web",
          "La plupart des navigateurs web acceptent automatiquement les cookies, mais vous pouvez généralement modifier les paramètres de votre navigateur pour refuser les cookies si vous le préférez."
        ]
      },
      {
        title: "Comment Nous Utilisons les Cookies",
        content: [
          "Nous utilisons des cookies sur notre site web aux fins suivantes :",
          "• Pour mémoriser votre préférence linguistique",
          "• Pour analyser le trafic du site web et le comportement des utilisateurs",
          "• Pour comprendre quelles pages sont les plus visitées et comment les utilisateurs naviguent sur le site",
          "• Pour améliorer la fonctionnalité du site web et l'expérience utilisateur",
          "• Pour maintenir la sécurité du site web",
          "Nous n'utilisons pas de cookies pour vous suivre sur d'autres sites web ou pour diffuser de la publicité ciblée."
        ]
      },
      {
        title: "Types de Cookies que Nous Utilisons",
        content: [
          "Cookies Essentiels :",
          "Ces cookies sont nécessaires au bon fonctionnement du site web. Ils activent des fonctions de base telles que la navigation sur les pages et l'accès aux zones sécurisées du site web. Le site web ne peut pas fonctionner correctement sans ces cookies.",
          "Cookies de Préférence :",
          "Ces cookies permettent au site web de se souvenir de vos choix, tels que votre langue préférée. Cela fournit une expérience plus personnalisée et vous évite de ressaisir vos préférences à chaque visite.",
          "Cookies d'Analyse :",
          "Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site web en collectant et en rapportant des informations de manière anonyme. Cela nous aide à améliorer le site web et à comprendre quelles sections sont les plus utiles pour nos visiteurs.",
          "Nous utilisons des cookies d'analyse pour suivre :",
          "• Nombre de visiteurs",
          "• Pages visitées",
          "• Temps passé sur les pages",
          "• Flux d'utilisateurs et modèles de navigation",
          "• Localisation géographique (au niveau pays/région)",
          "Ces informations sont agrégées et n'identifient pas les utilisateurs individuels."
        ]
      },
      {
        title: "Cookies Tiers",
        content: [
          "Nous pouvons utiliser des services tiers qui placent des cookies sur votre appareil pour nous aider à analyser l'utilisation du site web et à améliorer nos services. Ces tiers peuvent inclure :",
          "• Services d'analyse (par exemple, Google Analytics ou outils similaires)",
          "Ces services tiers peuvent collecter des informations sur vos activités en ligne au fil du temps et sur différents sites web. Nous ne contrôlons pas ces cookies tiers, et ils sont soumis à la politique de confidentialité du tiers respectif.",
          "Nous sélectionnons soigneusement les services tiers et ne travaillons qu'avec des fournisseurs réputés qui respectent les lois applicables en matière de protection des données."
        ]
      },
      {
        title: "Gestion des Cookies",
        content: [
          "Vous avez le contrôle sur les cookies et pouvez les gérer de plusieurs façons :",
          "Paramètres du Navigateur :",
          "La plupart des navigateurs web vous permettent de contrôler les cookies via leurs paramètres. Vous pouvez :",
          "• Bloquer tous les cookies",
          "• Bloquer uniquement les cookies tiers",
          "• Supprimer les cookies après chaque session de navigation",
          "• Autoriser les cookies uniquement de sites web spécifiques",
          "Veuillez noter que le blocage ou la suppression de cookies peut affecter votre expérience sur notre site web et limiter certaines fonctionnalités.",
          "Pour apprendre à gérer les cookies dans votre navigateur spécifique, veuillez consulter la documentation d'aide de votre navigateur :",
          "• Google Chrome : Paramètres > Confidentialité et sécurité > Cookies",
          "• Mozilla Firefox : Paramètres > Vie privée et sécurité > Cookies",
          "• Safari : Préférences > Confidentialité > Cookies",
          "• Microsoft Edge : Paramètres > Confidentialité et sécurité > Cookies",
          "Outils de Désactivation :",
          "Pour les cookies d'analyse, vous pourrez peut-être vous désabonner via le mécanisme de désactivation du fournisseur de services tiers. Par exemple, Google Analytics fournit un module complémentaire de navigateur pour se désabonner."
        ]
      },
      {
        title: "Durée des Cookies",
        content: [
          "Les cookies peuvent être des cookies de session ou des cookies persistants :",
          "Cookies de Session :",
          "Ce sont des cookies temporaires qui sont supprimés lorsque vous fermez votre navigateur. Ils aident le site web à se souvenir de ce que vous faites lorsque vous naviguez entre les pages.",
          "Cookies Persistants :",
          "Ces cookies restent sur votre appareil pendant une période définie ou jusqu'à ce que vous les supprimiez manuellement. Ils mémorisent vos préférences pour les visites futures.",
          "Nous utilisons à la fois des cookies de session et des cookies persistants. Nos cookies persistants expirent généralement après 12 mois, bien que cela puisse varier en fonction de l'objectif spécifique du cookie."
        ]
      },
      {
        title: "Cookies et Informations Personnelles",
        content: [
          "La plupart des cookies que nous utilisons ne collectent pas d'informations personnelles qui vous identifient en tant qu'individu. Ils collectent des données agrégées et anonymes sur l'utilisation du site web.",
          "Cependant, certains cookies peuvent être liés à d'autres informations que vous fournissez, par exemple lorsque vous soumettez un formulaire de contact. Dans de tels cas, les données sont traitées conformément à notre Politique de Confidentialité.",
          "Nous n'utilisons pas de cookies pour :",
          "• Collecter des informations personnelles sensibles",
          "• Vous suivre sur des sites web non liés",
          "• Diffuser de la publicité ciblée basée sur votre comportement de navigation",
          "• Partager des données de cookies avec des tiers à des fins de marketing"
        ]
      },
      {
        title: "Signaux « Ne Pas Suivre »",
        content: [
          "Certains navigateurs prennent en charge une fonctionnalité « Ne Pas Suivre » (DNT) qui signale aux sites web que vous ne souhaitez pas être suivi. Actuellement, il n'y a pas de norme industrielle pour répondre aux signaux DNT.",
          "Bien que nous respections la confidentialité des utilisateurs, notre site web ne répond actuellement pas aux signaux DNT. Vous pouvez gérer les cookies via les paramètres de votre navigateur comme décrit ci-dessus."
        ]
      },
      {
        title: "Mises à Jour de Cette Politique de Cookies",
        content: [
          "Nous pouvons mettre à jour cette Politique de Cookies de temps à autre pour refléter les changements dans nos pratiques, technologies ou exigences légales.",
          "Tout changement sera publié sur cette page avec une date \"Dernière mise à jour\" révisée. Nous vous encourageons à consulter cette Politique de Cookies périodiquement pour rester informé de la manière dont nous utilisons les cookies."
        ]
      },
      {
        title: "Nous Contacter",
        content: [
          "Si vous avez des questions ou des préoccupations concernant notre utilisation des cookies, veuillez nous contacter à :",
          "Email : privacy@revosso.com",
          "Contact général : contact@revosso.com",
          "Pour plus d'informations sur la manière dont nous traitons vos données personnelles, veuillez consulter notre Politique de Confidentialité."
        ]
      }
    ]
  },
  "pt-BR": {
    title: "Política de Cookies",
    lastUpdated: "Última Atualização",
    lastUpdatedDate: "5 de março de 2026",
    backToHome: "Voltar ao Início",
    sections: [
      {
        title: "Introdução",
        content: [
          "Esta Política de Cookies explica como a Revosso (\"nós\", \"nosso\") usa cookies e tecnologias de rastreamento similares em nosso site.",
          "Ao usar nosso site, você consente com o uso de cookies conforme descrito nesta política. Se você não concorda com nosso uso de cookies, você pode ajustar as configurações do seu navegador ou descontinuar o uso do nosso site."
        ]
      },
      {
        title: "O Que São Cookies",
        content: [
          "Cookies são pequenos arquivos de texto que são colocados em seu dispositivo (computador, smartphone, tablet) quando você visita um site. Eles são amplamente usados para fazer os sites funcionarem de forma mais eficiente e fornecer informações aos proprietários dos sites.",
          "Os cookies ajudam a melhorar sua experiência de navegação ao:",
          "• Lembrar suas preferências e configurações",
          "• Habilitar funcionalidades do site",
          "• Entender como você usa o site",
          "• Melhorar o desempenho e a experiência do usuário do site",
          "A maioria dos navegadores web aceita cookies automaticamente, mas você geralmente pode modificar as configurações do seu navegador para recusar cookies se preferir."
        ]
      },
      {
        title: "Como Usamos Cookies",
        content: [
          "Usamos cookies em nosso site para os seguintes propósitos:",
          "• Para lembrar sua preferência de idioma",
          "• Para analisar o tráfego do site e o comportamento do usuário",
          "• Para entender quais páginas são mais visitadas e como os usuários navegam no site",
          "• Para melhorar a funcionalidade do site e a experiência do usuário",
          "• Para manter a segurança do site",
          "Não usamos cookies para rastreá-lo em outros sites ou para veicular publicidade direcionada."
        ]
      },
      {
        title: "Tipos de Cookies que Usamos",
        content: [
          "Cookies Essenciais:",
          "Esses cookies são necessários para o site funcionar corretamente. Eles habilitam recursos básicos como navegação de páginas e acesso a áreas seguras do site. O site não pode funcionar corretamente sem esses cookies.",
          "Cookies de Preferência:",
          "Esses cookies permitem que o site se lembre de suas escolhas, como seu idioma preferido. Isso fornece uma experiência mais personalizada e evita que você tenha que reinserir suas preferências cada vez que visitar.",
          "Cookies de Análise:",
          "Esses cookies nos ajudam a entender como os visitantes interagem com nosso site coletando e relatando informações anonimamente. Isso nos ajuda a melhorar o site e entender quais seções são mais úteis para nossos visitantes.",
          "Usamos cookies de análise para rastrear:",
          "• Número de visitantes",
          "• Páginas visitadas",
          "• Tempo gasto em páginas",
          "• Fluxo do usuário e padrões de navegação",
          "• Localização geográfica (nível de país/região)",
          "Essas informações são agregadas e não identificam usuários individuais."
        ]
      },
      {
        title: "Cookies de Terceiros",
        content: [
          "Podemos usar serviços de terceiros que definem cookies em seu dispositivo para nos ajudar a analisar o uso do site e melhorar nossos serviços. Esses terceiros podem incluir:",
          "• Serviços de análise (por exemplo, Google Analytics ou ferramentas similares)",
          "Esses serviços de terceiros podem coletar informações sobre suas atividades online ao longo do tempo e em diferentes sites. Não controlamos esses cookies de terceiros, e eles estão sujeitos à política de privacidade do respectivo terceiro.",
          "Selecionamos cuidadosamente os serviços de terceiros e trabalhamos apenas com provedores respeitáveis que cumprem as leis aplicáveis de proteção de dados."
        ]
      },
      {
        title: "Gerenciando Cookies",
        content: [
          "Você tem controle sobre os cookies e pode gerenciá-los de várias maneiras:",
          "Configurações do Navegador:",
          "A maioria dos navegadores web permite que você controle os cookies através de suas configurações. Você pode:",
          "• Bloquear todos os cookies",
          "• Bloquear apenas cookies de terceiros",
          "• Excluir cookies após cada sessão de navegação",
          "• Permitir cookies apenas de sites específicos",
          "Observe que bloquear ou excluir cookies pode afetar sua experiência em nosso site e limitar certas funcionalidades.",
          "Para aprender como gerenciar cookies em seu navegador específico, consulte a documentação de ajuda do seu navegador:",
          "• Google Chrome: Configurações > Privacidade e segurança > Cookies",
          "• Mozilla Firefox: Configurações > Privacidade e Segurança > Cookies",
          "• Safari: Preferências > Privacidade > Cookies",
          "• Microsoft Edge: Configurações > Privacidade e segurança > Cookies",
          "Ferramentas de Exclusão:",
          "Para cookies de análise, você pode optar por não participar através do mecanismo de exclusão do provedor de serviços de terceiros. Por exemplo, o Google Analytics fornece um complemento de navegador para exclusão."
        ]
      },
      {
        title: "Duração dos Cookies",
        content: [
          "Os cookies podem ser cookies de sessão ou cookies persistentes:",
          "Cookies de Sessão:",
          "São cookies temporários que são excluídos quando você fecha seu navegador. Eles ajudam o site a lembrar o que você está fazendo enquanto navega entre as páginas.",
          "Cookies Persistentes:",
          "Esses cookies permanecem em seu dispositivo por um período definido ou até que você os exclua manualmente. Eles lembram suas preferências para visitas futuras.",
          "Usamos cookies de sessão e persistentes. Nossos cookies persistentes normalmente expiram após 12 meses, embora isso possa variar dependendo do propósito específico do cookie."
        ]
      },
      {
        title: "Cookies e Informações Pessoais",
        content: [
          "A maioria dos cookies que usamos não coleta informações pessoais que o identifiquem como indivíduo. Eles coletam dados agregados e anônimos sobre o uso do site.",
          "No entanto, alguns cookies podem estar vinculados a outras informações que você fornece, como quando você envia um formulário de contato. Nesses casos, os dados são tratados de acordo com nossa Política de Privacidade.",
          "Não usamos cookies para:",
          "• Coletar informações pessoais sensíveis",
          "• Rastreá-lo em sites não relacionados",
          "• Veicular publicidade direcionada com base em seu comportamento de navegação",
          "• Compartilhar dados de cookies com terceiros para fins de marketing"
        ]
      },
      {
        title: "Sinais \"Não Rastrear\"",
        content: [
          "Alguns navegadores suportam um recurso \"Não Rastrear\" (DNT) que sinaliza aos sites que você não deseja ser rastreado. Atualmente, não há um padrão industrial para responder aos sinais DNT.",
          "Embora respeitemos a privacidade do usuário, nosso site atualmente não responde aos sinais DNT. Você pode gerenciar cookies através das configurações do seu navegador conforme descrito acima."
        ]
      },
      {
        title: "Atualizações Desta Política de Cookies",
        content: [
          "Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças em nossas práticas, tecnologias ou requisitos legais.",
          "Quaisquer alterações serão publicadas nesta página com uma data \"Última Atualização\" revisada. Encorajamos você a revisar esta Política de Cookies periodicamente para se manter informado sobre como usamos cookies."
        ]
      },
      {
        title: "Entre em Contato",
        content: [
          "Se você tiver dúvidas ou preocupações sobre nosso uso de cookies, entre em contato conosco:",
          "Email: privacy@revosso.com",
          "Contato geral: contact@revosso.com",
          "Para mais informações sobre como tratamos seus dados pessoais, consulte nossa Política de Privacidade."
        ]
      }
    ]
  },
  es: {
    title: "Política de Cookies",
    lastUpdated: "Última Actualización",
    lastUpdatedDate: "5 de marzo de 2026",
    backToHome: "Volver al Inicio",
    sections: [
      {
        title: "Introducción",
        content: [
          "Esta Política de Cookies explica cómo Revosso (\"nosotros\", \"nuestro\") utiliza cookies y tecnologías de rastreo similares en nuestro sitio web.",
          "Al usar nuestro sitio web, usted consiente el uso de cookies como se describe en esta política. Si no está de acuerdo con nuestro uso de cookies, puede ajustar la configuración de su navegador o dejar de usar nuestro sitio web."
        ]
      },
      {
        title: "Qué Son las Cookies",
        content: [
          "Las cookies son pequeños archivos de texto que se colocan en su dispositivo (computadora, smartphone, tablet) cuando visita un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente y proporcionar información a los propietarios del sitio.",
          "Las cookies ayudan a mejorar su experiencia de navegación al:",
          "• Recordar sus preferencias y configuraciones",
          "• Habilitar la funcionalidad del sitio web",
          "• Comprender cómo usa el sitio web",
          "• Mejorar el rendimiento y la experiencia del usuario del sitio web",
          "La mayoría de los navegadores web aceptan cookies automáticamente, pero generalmente puede modificar la configuración de su navegador para rechazar cookies si lo prefiere."
        ]
      },
      {
        title: "Cómo Usamos las Cookies",
        content: [
          "Utilizamos cookies en nuestro sitio web para los siguientes propósitos:",
          "• Para recordar su preferencia de idioma",
          "• Para analizar el tráfico del sitio web y el comportamiento del usuario",
          "• Para comprender qué páginas son más visitadas y cómo los usuarios navegan por el sitio",
          "• Para mejorar la funcionalidad del sitio web y la experiencia del usuario",
          "• Para mantener la seguridad del sitio web",
          "No utilizamos cookies para rastrearlo en otros sitios web o para mostrar publicidad dirigida."
        ]
      },
      {
        title: "Tipos de Cookies que Utilizamos",
        content: [
          "Cookies Esenciales:",
          "Estas cookies son necesarias para que el sitio web funcione correctamente. Permiten funciones básicas como la navegación de páginas y el acceso a áreas seguras del sitio web. El sitio web no puede funcionar correctamente sin estas cookies.",
          "Cookies de Preferencia:",
          "Estas cookies permiten que el sitio web recuerde sus elecciones, como su idioma preferido. Esto proporciona una experiencia más personalizada y le evita tener que volver a ingresar sus preferencias cada vez que visita.",
          "Cookies de Análisis:",
          "Estas cookies nos ayudan a comprender cómo los visitantes interactúan con nuestro sitio web al recopilar e informar información de forma anónima. Esto nos ayuda a mejorar el sitio web y comprender qué secciones son más útiles para nuestros visitantes.",
          "Utilizamos cookies de análisis para rastrear:",
          "• Número de visitantes",
          "• Páginas visitadas",
          "• Tiempo pasado en las páginas",
          "• Flujo de usuarios y patrones de navegación",
          "• Ubicación geográfica (nivel país/región)",
          "Esta información se agrega y no identifica a usuarios individuales."
        ]
      },
      {
        title: "Cookies de Terceros",
        content: [
          "Podemos utilizar servicios de terceros que establecen cookies en su dispositivo para ayudarnos a analizar el uso del sitio web y mejorar nuestros servicios. Estos terceros pueden incluir:",
          "• Servicios de análisis (por ejemplo, Google Analytics o herramientas similares)",
          "Estos servicios de terceros pueden recopilar información sobre sus actividades en línea a lo largo del tiempo y en diferentes sitios web. No controlamos estas cookies de terceros, y están sujetas a la política de privacidad del tercero respectivo.",
          "Seleccionamos cuidadosamente los servicios de terceros y solo trabajamos con proveedores de buena reputación que cumplen con las leyes aplicables de protección de datos."
        ]
      },
      {
        title: "Gestión de Cookies",
        content: [
          "Usted tiene control sobre las cookies y puede gestionarlas de varias maneras:",
          "Configuración del Navegador:",
          "La mayoría de los navegadores web le permiten controlar las cookies a través de su configuración. Puede:",
          "• Bloquear todas las cookies",
          "• Bloquear solo las cookies de terceros",
          "• Eliminar las cookies después de cada sesión de navegación",
          "• Permitir cookies solo de sitios web específicos",
          "Tenga en cuenta que bloquear o eliminar cookies puede afectar su experiencia en nuestro sitio web y limitar ciertas funcionalidades.",
          "Para aprender cómo gestionar las cookies en su navegador específico, consulte la documentación de ayuda de su navegador:",
          "• Google Chrome: Configuración > Privacidad y seguridad > Cookies",
          "• Mozilla Firefox: Configuración > Privacidad y Seguridad > Cookies",
          "• Safari: Preferencias > Privacidad > Cookies",
          "• Microsoft Edge: Configuración > Privacidad y seguridad > Cookies",
          "Herramientas de Exclusión:",
          "Para las cookies de análisis, puede optar por no participar a través del mecanismo de exclusión del proveedor de servicios de terceros. Por ejemplo, Google Analytics proporciona un complemento de navegador para excluirse."
        ]
      },
      {
        title: "Duración de las Cookies",
        content: [
          "Las cookies pueden ser cookies de sesión o cookies persistentes:",
          "Cookies de Sesión:",
          "Son cookies temporales que se eliminan cuando cierra su navegador. Ayudan al sitio web a recordar lo que está haciendo mientras navega entre páginas.",
          "Cookies Persistentes:",
          "Estas cookies permanecen en su dispositivo durante un período establecido o hasta que las elimine manualmente. Recuerdan sus preferencias para visitas futuras.",
          "Utilizamos cookies de sesión y persistentes. Nuestras cookies persistentes generalmente expiran después de 12 meses, aunque esto puede variar según el propósito específico de la cookie."
        ]
      },
      {
        title: "Cookies e Información Personal",
        content: [
          "La mayoría de las cookies que utilizamos no recopilan información personal que lo identifique como individuo. Recopilan datos agregados y anónimos sobre el uso del sitio web.",
          "Sin embargo, algunas cookies pueden estar vinculadas a otra información que usted proporciona, como cuando envía un formulario de contacto. En tales casos, los datos se manejan de acuerdo con nuestra Política de Privacidad.",
          "No utilizamos cookies para:",
          "• Recopilar información personal sensible",
          "• Rastrearlo en sitios web no relacionados",
          "• Mostrar publicidad dirigida basada en su comportamiento de navegación",
          "• Compartir datos de cookies con terceros para fines de marketing"
        ]
      },
      {
        title: "Señales \"No Rastrear\"",
        content: [
          "Algunos navegadores admiten una función \"No Rastrear\" (DNT) que señala a los sitios web que no desea ser rastreado. Actualmente, no existe un estándar industrial para responder a las señales DNT.",
          "Si bien respetamos la privacidad del usuario, nuestro sitio web actualmente no responde a las señales DNT. Puede gestionar las cookies a través de la configuración de su navegador como se describe arriba."
        ]
      },
      {
        title: "Actualizaciones de Esta Política de Cookies",
        content: [
          "Podemos actualizar esta Política de Cookies ocasionalmente para reflejar cambios en nuestras prácticas, tecnologías o requisitos legales.",
          "Cualquier cambio se publicará en esta página con una fecha \"Última Actualización\" revisada. Le recomendamos que revise esta Política de Cookies periódicamente para mantenerse informado sobre cómo usamos las cookies."
        ]
      },
      {
        title: "Contáctenos",
        content: [
          "Si tiene preguntas o inquietudes sobre nuestro uso de cookies, contáctenos en:",
          "Email: privacy@revosso.com",
          "Contacto general: contact@revosso.com",
          "Para más información sobre cómo manejamos sus datos personales, consulte nuestra Política de Privacidad."
        ]
      }
    ]
  }
}

export default function CookiesPage() {
  const [locale, setLocale] = useState<"en" | "fr" | "pt-BR" | "es">("en")

  useEffect(() => {
    const browserLang = navigator.language
    if (browserLang.startsWith("pt")) {
      setLocale("pt-BR")
    } else if (browserLang.startsWith("es")) {
      setLocale("es")
    } else if (browserLang.startsWith("fr")) {
      setLocale("fr")
    } else {
      setLocale("en")
    }
  }, [])

  const t = translations[locale]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
              <Code className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              REVOSSO
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="en">English</option>
              <option value="pt-BR">Português</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            {t.backToHome}
          </Link>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-slate-400">
                {t.lastUpdated}: {t.lastUpdatedDate}
              </p>
            </div>

            {t.sections.map((section, index) => (
              <section key={index} className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                <div className="space-y-3 text-slate-300 leading-relaxed">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Revosso. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
