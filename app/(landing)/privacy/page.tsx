"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Code, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const translations = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last Updated",
    lastUpdatedDate: "March 5, 2026",
    backToHome: "Back to Home",
    sections: [
      {
        title: "Introduction",
        content: [
          'Revosso ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.',
          "By using our website and services, you agree to the collection and use of information in accordance with this policy. If you do not agree with this policy, please do not use our website or services."
        ]
      },
      {
        title: "Information We Collect",
        content: [
          "We collect information that you provide directly to us when you:",
          "• Submit a business inquiry through our contact form",
          "• Communicate with us via email",
          "• Request information about our services",
          "The types of personal information we may collect include:",
          "• Name and contact information (email address, phone number)",
          "• Company name and business details",
          "• Project requirements and technical needs",
          "• Preferred language for communication",
          "• Any other information you choose to provide in your message",
          "We also automatically collect certain technical information when you visit our website, including IP address, browser type, device information, and usage data through cookies and similar technologies."
        ]
      },
      {
        title: "How We Use Your Information",
        content: [
          "We use the information we collect for the following purposes:",
          "• To respond to your inquiries and provide information about our services",
          "• To communicate with you about potential projects and business opportunities",
          "• To improve our website and services",
          "• To analyze website usage and optimize user experience",
          "• To detect, prevent, and address technical issues or security threats",
          "• To comply with legal obligations",
          "We do not sell, rent, or share your personal information with third parties for their marketing purposes."
        ]
      },
      {
        title: "Lead Submission and Contact Forms",
        content: [
          "When you submit a business inquiry through our contact form, we collect and process the information you provide to:",
          "• Respond to your specific inquiry",
          "• Assess how we can best serve your business needs",
          "• Maintain a record of our communications",
          "• Follow up on potential business opportunities",
          "Your submitted information is stored securely and is only accessed by authorized Revosso personnel for legitimate business purposes. We retain this information for as long as necessary to fulfill the purposes outlined in this policy or as required by law."
        ]
      },
      {
        title: "Cookies and Tracking Technologies",
        content: [
          "We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us:",
          "• Remember your language preference",
          "• Analyze website traffic and usage patterns",
          "• Improve website functionality",
          "You can control cookies through your browser settings. However, disabling cookies may limit certain functionalities of our website. For more information, please see our Cookie Policy."
        ]
      },
      {
        title: "Data Security",
        content: [
          "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:",
          "• Encrypted data transmission (HTTPS/TLS)",
          "• Secure data storage with access controls",
          "• Regular security assessments and updates",
          "• Limited access to personal information on a need-to-know basis",
          "While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to maintaining industry-standard protections."
        ]
      },
      {
        title: "International Data Transfers",
        content: [
          "Revosso is registered in Brazil and operates internationally. Your information may be transferred to and processed in Brazil or other countries where we or our service providers operate.",
          "When we transfer personal information internationally, we ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable data protection laws."
        ]
      },
      {
        title: "Data Retention",
        content: [
          "We retain your personal information for as long as necessary to:",
          "• Fulfill the purposes for which it was collected",
          "• Respond to your inquiries and provide services",
          "• Comply with legal, accounting, or reporting requirements",
          "• Resolve disputes and enforce our agreements",
          "When your information is no longer needed, we will securely delete or anonymize it."
        ]
      },
      {
        title: "Your Rights",
        content: [
          "Depending on your location, you may have certain rights regarding your personal information, including:",
          "• Access: Request access to the personal information we hold about you",
          "• Correction: Request correction of inaccurate or incomplete information",
          "• Deletion: Request deletion of your personal information",
          "• Objection: Object to the processing of your information",
          "• Data Portability: Request a copy of your information in a structured format",
          "• Withdrawal of Consent: Withdraw consent where processing is based on consent",
          "To exercise these rights, please contact us at privacy@revosso.com. We will respond to your request within a reasonable timeframe and in accordance with applicable law."
        ]
      },
      {
        title: "Third-Party Services",
        content: [
          "Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit."
        ]
      },
      {
        title: "Children's Privacy",
        content: [
          "Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately."
        ]
      },
      {
        title: "Changes to This Privacy Policy",
        content: [
          "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website with a revised \"Last Updated\" date.",
          "We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information."
        ]
      },
      {
        title: "Contact Us",
        content: [
          "If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:",
          "Email: privacy@revosso.com",
          "General Contact: contact@revosso.com",
          "We will do our best to respond to your inquiry within a reasonable timeframe."
        ]
      }
    ]
  },
  fr: {
    title: "Politique de Confidentialité",
    lastUpdated: "Dernière mise à jour",
    lastUpdatedDate: "5 mars 2026",
    backToHome: "Retour à l'accueil",
    sections: [
      {
        title: "Introduction",
        content: [
          "Revosso (« nous », « notre ») s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site web ou utilisez nos services.",
          "En utilisant notre site web et nos services, vous acceptez la collecte et l'utilisation des informations conformément à cette politique. Si vous n'êtes pas d'accord avec cette politique, veuillez ne pas utiliser notre site web ou nos services."
        ]
      },
      {
        title: "Informations que Nous Collectons",
        content: [
          "Nous collectons les informations que vous nous fournissez directement lorsque vous :",
          "• Soumettez une demande commerciale via notre formulaire de contact",
          "• Communiquez avec nous par email",
          "• Demandez des informations sur nos services",
          "Les types d'informations personnelles que nous pouvons collecter incluent :",
          "• Nom et coordonnées (adresse email, numéro de téléphone)",
          "• Nom de l'entreprise et détails commerciaux",
          "• Exigences du projet et besoins techniques",
          "• Langue préférée pour la communication",
          "• Toute autre information que vous choisissez de fournir dans votre message",
          "Nous collectons également automatiquement certaines informations techniques lorsque vous visitez notre site web, notamment l'adresse IP, le type de navigateur, les informations sur l'appareil et les données d'utilisation via des cookies et technologies similaires."
        ]
      },
      {
        title: "Comment Nous Utilisons Vos Informations",
        content: [
          "Nous utilisons les informations que nous collectons aux fins suivantes :",
          "• Répondre à vos demandes et fournir des informations sur nos services",
          "• Communiquer avec vous concernant des projets potentiels et des opportunités commerciales",
          "• Améliorer notre site web et nos services",
          "• Analyser l'utilisation du site web et optimiser l'expérience utilisateur",
          "• Détecter, prévenir et résoudre les problèmes techniques ou les menaces de sécurité",
          "• Respecter les obligations légales",
          "Nous ne vendons, ne louons ni ne partageons vos informations personnelles avec des tiers à des fins de marketing."
        ]
      },
      {
        title: "Soumission de Demandes et Formulaires de Contact",
        content: [
          "Lorsque vous soumettez une demande commerciale via notre formulaire de contact, nous collectons et traitons les informations que vous fournissez pour :",
          "• Répondre à votre demande spécifique",
          "• Évaluer comment nous pouvons mieux répondre à vos besoins commerciaux",
          "• Maintenir un enregistrement de nos communications",
          "• Assurer le suivi des opportunités commerciales potentielles",
          "Vos informations soumises sont stockées en toute sécurité et ne sont accessibles que par le personnel autorisé de Revosso à des fins commerciales légitimes. Nous conservons ces informations aussi longtemps que nécessaire pour remplir les objectifs décrits dans cette politique ou selon les exigences légales."
        ]
      },
      {
        title: "Cookies et Technologies de Suivi",
        content: [
          "Nous utilisons des cookies et des technologies de suivi similaires pour améliorer votre expérience sur notre site web. Les cookies sont de petits fichiers de données stockés sur votre appareil qui nous aident à :",
          "• Mémoriser votre préférence linguistique",
          "• Analyser le trafic et les modèles d'utilisation du site web",
          "• Améliorer les fonctionnalités du site web",
          "Vous pouvez contrôler les cookies via les paramètres de votre navigateur. Cependant, la désactivation des cookies peut limiter certaines fonctionnalités de notre site web. Pour plus d'informations, veuillez consulter notre Politique de Cookies."
        ]
      },
      {
        title: "Sécurité des Données",
        content: [
          "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos informations personnelles contre l'accès, la modification, la divulgation ou la destruction non autorisés. Ces mesures incluent :",
          "• Transmission de données cryptées (HTTPS/TLS)",
          "• Stockage sécurisé des données avec contrôles d'accès",
          "• Évaluations et mises à jour régulières de la sécurité",
          "• Accès limité aux informations personnelles selon le principe du besoin de savoir",
          "Bien que nous nous efforcions de protéger vos informations, aucune méthode de transmission sur Internet ou de stockage électronique n'est sûre à 100%. Nous ne pouvons garantir une sécurité absolue mais nous nous engageons à maintenir des protections conformes aux normes de l'industrie."
        ]
      },
      {
        title: "Transferts Internationaux de Données",
        content: [
          "Revosso est enregistrée au Brésil et opère à l'international. Vos informations peuvent être transférées et traitées au Brésil ou dans d'autres pays où nous ou nos prestataires de services opérons.",
          "Lorsque nous transférons des informations personnelles à l'international, nous veillons à ce que des garanties appropriées soient en place pour protéger vos données conformément à cette Politique de Confidentialité et aux lois applicables sur la protection des données."
        ]
      },
      {
        title: "Conservation des Données",
        content: [
          "Nous conservons vos informations personnelles aussi longtemps que nécessaire pour :",
          "• Remplir les objectifs pour lesquels elles ont été collectées",
          "• Répondre à vos demandes et fournir des services",
          "• Respecter les exigences légales, comptables ou de reporting",
          "• Résoudre les litiges et faire respecter nos accords",
          "Lorsque vos informations ne sont plus nécessaires, nous les supprimerons ou les anonymiserons de manière sécurisée."
        ]
      },
      {
        title: "Vos Droits",
        content: [
          "Selon votre localisation, vous pouvez avoir certains droits concernant vos informations personnelles, notamment :",
          "• Accès : Demander l'accès aux informations personnelles que nous détenons à votre sujet",
          "• Correction : Demander la correction d'informations inexactes ou incomplètes",
          "• Suppression : Demander la suppression de vos informations personnelles",
          "• Objection : Vous opposer au traitement de vos informations",
          "• Portabilité des données : Demander une copie de vos informations dans un format structuré",
          "• Retrait du consentement : Retirer votre consentement lorsque le traitement est basé sur le consentement",
          "Pour exercer ces droits, veuillez nous contacter à privacy@revosso.com. Nous répondrons à votre demande dans un délai raisonnable et conformément à la loi applicable."
        ]
      },
      {
        title: "Services Tiers",
        content: [
          "Notre site web peut contenir des liens vers des sites web ou services tiers. Nous ne sommes pas responsables des pratiques de confidentialité de ces tiers. Nous vous encourageons à consulter les politiques de confidentialité de tout site tiers que vous visitez."
        ]
      },
      {
        title: "Confidentialité des Enfants",
        content: [
          "Nos services ne sont pas destinés aux personnes de moins de 18 ans. Nous ne collectons pas sciemment d'informations personnelles auprès d'enfants. Si vous pensez que nous avons collecté des informations auprès d'un enfant, veuillez nous contacter immédiatement."
        ]
      },
      {
        title: "Modifications de Cette Politique de Confidentialité",
        content: [
          "Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre pour refléter les changements dans nos pratiques ou les exigences légales. Nous vous informerons de tout changement important en publiant la politique mise à jour sur notre site web avec une date « Dernière mise à jour » révisée.",
          "Nous vous encourageons à consulter périodiquement cette Politique de Confidentialité pour rester informé de la manière dont nous protégeons vos informations."
        ]
      },
      {
        title: "Nous Contacter",
        content: [
          "Si vous avez des questions, des préoccupations ou des demandes concernant cette Politique de Confidentialité ou nos pratiques de confidentialité, veuillez nous contacter à :",
          "Email : privacy@revosso.com",
          "Contact général : contact@revosso.com",
          "Nous ferons de notre mieux pour répondre à votre demande dans un délai raisonnable."
        ]
      }
    ]
  },
  "pt-BR": {
    title: "Política de Privacidade",
    lastUpdated: "Última Atualização",
    lastUpdatedDate: "5 de março de 2026",
    backToHome: "Voltar ao Início",
    sections: [
      {
        title: "Introdução",
        content: [
          "A Revosso (\"nós\", \"nosso\") está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você visita nosso site ou usa nossos serviços.",
          "Ao usar nosso site e serviços, você concorda com a coleta e uso de informações de acordo com esta política. Se você não concorda com esta política, por favor, não use nosso site ou serviços."
        ]
      },
      {
        title: "Informações que Coletamos",
        content: [
          "Coletamos informações que você nos fornece diretamente quando você:",
          "• Envia uma consulta comercial através do nosso formulário de contato",
          "• Se comunica conosco por email",
          "• Solicita informações sobre nossos serviços",
          "Os tipos de informações pessoais que podemos coletar incluem:",
          "• Nome e informações de contato (endereço de email, telefone)",
          "• Nome da empresa e detalhes comerciais",
          "• Requisitos do projeto e necessidades técnicas",
          "• Idioma preferido para comunicação",
          "• Qualquer outra informação que você escolha fornecer em sua mensagem",
          "Também coletamos automaticamente certas informações técnicas quando você visita nosso site, incluindo endereço IP, tipo de navegador, informações do dispositivo e dados de uso através de cookies e tecnologias similares."
        ]
      },
      {
        title: "Como Usamos Suas Informações",
        content: [
          "Usamos as informações que coletamos para os seguintes propósitos:",
          "• Responder às suas consultas e fornecer informações sobre nossos serviços",
          "• Comunicar com você sobre projetos potenciais e oportunidades de negócios",
          "• Melhorar nosso site e serviços",
          "• Analisar o uso do site e otimizar a experiência do usuário",
          "• Detectar, prevenir e resolver problemas técnicos ou ameaças de segurança",
          "• Cumprir obrigações legais",
          "Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing."
        ]
      },
      {
        title: "Envio de Consultas e Formulários de Contato",
        content: [
          "Quando você envia uma consulta comercial através do nosso formulário de contato, coletamos e processamos as informações que você fornece para:",
          "• Responder à sua consulta específica",
          "• Avaliar como podemos melhor atender às suas necessidades comerciais",
          "• Manter um registro de nossas comunicações",
          "• Fazer acompanhamento de oportunidades comerciais potenciais",
          "Suas informações enviadas são armazenadas com segurança e são acessadas apenas por pessoal autorizado da Revosso para fins comerciais legítimos. Retemos essas informações pelo tempo necessário para cumprir os propósitos descritos nesta política ou conforme exigido por lei."
        ]
      },
      {
        title: "Cookies e Tecnologias de Rastreamento",
        content: [
          "Usamos cookies e tecnologias de rastreamento similares para melhorar sua experiência em nosso site. Cookies são pequenos arquivos de dados armazenados em seu dispositivo que nos ajudam a:",
          "• Lembrar sua preferência de idioma",
          "• Analisar o tráfego e padrões de uso do site",
          "• Melhorar a funcionalidade do site",
          "Você pode controlar os cookies através das configurações do seu navegador. No entanto, desabilitar cookies pode limitar certas funcionalidades do nosso site. Para mais informações, consulte nossa Política de Cookies."
        ]
      },
      {
        title: "Segurança de Dados",
        content: [
          "Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações pessoais contra acesso, alteração, divulgação ou destruição não autorizados. Essas medidas incluem:",
          "• Transmissão de dados criptografada (HTTPS/TLS)",
          "• Armazenamento seguro de dados com controles de acesso",
          "• Avaliações e atualizações regulares de segurança",
          "• Acesso limitado a informações pessoais com base na necessidade de saber",
          "Embora nos esforcemos para proteger suas informações, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro. Não podemos garantir segurança absoluta, mas estamos comprometidos em manter proteções padrão da indústria."
        ]
      },
      {
        title: "Transferências Internacionais de Dados",
        content: [
          "A Revosso está registrada no Brasil e opera internacionalmente. Suas informações podem ser transferidas e processadas no Brasil ou em outros países onde nós ou nossos provedores de serviços operam.",
          "Quando transferimos informações pessoais internacionalmente, garantimos que salvaguardas apropriadas estejam em vigor para proteger seus dados de acordo com esta Política de Privacidade e leis aplicáveis de proteção de dados."
        ]
      },
      {
        title: "Retenção de Dados",
        content: [
          "Retemos suas informações pessoais pelo tempo necessário para:",
          "• Cumprir os propósitos para os quais foram coletadas",
          "• Responder às suas consultas e fornecer serviços",
          "• Cumprir requisitos legais, contábeis ou de relatórios",
          "• Resolver disputas e fazer cumprir nossos acordos",
          "Quando suas informações não forem mais necessárias, as excluiremos ou anonimizaremos de forma segura."
        ]
      },
      {
        title: "Seus Direitos",
        content: [
          "Dependendo da sua localização, você pode ter certos direitos em relação às suas informações pessoais, incluindo:",
          "• Acesso: Solicitar acesso às informações pessoais que mantemos sobre você",
          "• Correção: Solicitar correção de informações imprecisas ou incompletas",
          "• Exclusão: Solicitar exclusão de suas informações pessoais",
          "• Objeção: Objetar o processamento de suas informações",
          "• Portabilidade de Dados: Solicitar uma cópia de suas informações em formato estruturado",
          "• Retirada de Consentimento: Retirar consentimento onde o processamento é baseado em consentimento",
          "Para exercer esses direitos, entre em contato conosco em privacy@revosso.com. Responderemos à sua solicitação dentro de um prazo razoável e de acordo com a lei aplicável."
        ]
      },
      {
        title: "Serviços de Terceiros",
        content: [
          "Nosso site pode conter links para sites ou serviços de terceiros. Não somos responsáveis pelas práticas de privacidade desses terceiros. Encorajamos você a revisar as políticas de privacidade de quaisquer sites de terceiros que você visitar."
        ]
      },
      {
        title: "Privacidade de Crianças",
        content: [
          "Nossos serviços não são direcionados a indivíduos menores de 18 anos. Não coletamos intencionalmente informações pessoais de crianças. Se você acredita que coletamos informações de uma criança, entre em contato conosco imediatamente."
        ]
      },
      {
        title: "Alterações a Esta Política de Privacidade",
        content: [
          "Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou requisitos legais. Notificaremos você sobre quaisquer mudanças materiais publicando a política atualizada em nosso site com uma data \"Última Atualização\" revisada.",
          "Encorajamos você a revisar esta Política de Privacidade periodicamente para se manter informado sobre como protegemos suas informações."
        ]
      },
      {
        title: "Entre em Contato",
        content: [
          "Se você tiver dúvidas, preocupações ou solicitações sobre esta Política de Privacidade ou nossas práticas de privacidade, entre em contato conosco:",
          "Email: privacy@revosso.com",
          "Contato geral: contact@revosso.com",
          "Faremos o nosso melhor para responder à sua consulta dentro de um prazo razoável."
        ]
      }
    ]
  },
  es: {
    title: "Política de Privacidad",
    lastUpdated: "Última Actualización",
    lastUpdatedDate: "5 de marzo de 2026",
    backToHome: "Volver al Inicio",
    sections: [
      {
        title: "Introducción",
        content: [
          "Revosso (\"nosotros\", \"nuestro\") está comprometida a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando visita nuestro sitio web o utiliza nuestros servicios.",
          "Al usar nuestro sitio web y servicios, usted acepta la recopilación y el uso de información de acuerdo con esta política. Si no está de acuerdo con esta política, por favor no utilice nuestro sitio web o servicios."
        ]
      },
      {
        title: "Información que Recopilamos",
        content: [
          "Recopilamos información que usted nos proporciona directamente cuando:",
          "• Envía una consulta comercial a través de nuestro formulario de contacto",
          "• Se comunica con nosotros por correo electrónico",
          "• Solicita información sobre nuestros servicios",
          "Los tipos de información personal que podemos recopilar incluyen:",
          "• Nombre e información de contacto (dirección de correo electrónico, teléfono)",
          "• Nombre de la empresa y detalles comerciales",
          "• Requisitos del proyecto y necesidades técnicas",
          "• Idioma preferido para la comunicación",
          "• Cualquier otra información que elija proporcionar en su mensaje",
          "También recopilamos automáticamente cierta información técnica cuando visita nuestro sitio web, incluyendo dirección IP, tipo de navegador, información del dispositivo y datos de uso a través de cookies y tecnologías similares."
        ]
      },
      {
        title: "Cómo Usamos Su Información",
        content: [
          "Usamos la información que recopilamos para los siguientes propósitos:",
          "• Responder a sus consultas y proporcionar información sobre nuestros servicios",
          "• Comunicarnos con usted sobre proyectos potenciales y oportunidades comerciales",
          "• Mejorar nuestro sitio web y servicios",
          "• Analizar el uso del sitio web y optimizar la experiencia del usuario",
          "• Detectar, prevenir y abordar problemas técnicos o amenazas de seguridad",
          "• Cumplir con obligaciones legales",
          "No vendemos, alquilamos ni compartimos su información personal con terceros para fines de marketing."
        ]
      },
      {
        title: "Envío de Consultas y Formularios de Contacto",
        content: [
          "Cuando envía una consulta comercial a través de nuestro formulario de contacto, recopilamos y procesamos la información que proporciona para:",
          "• Responder a su consulta específica",
          "• Evaluar cómo podemos atender mejor sus necesidades comerciales",
          "• Mantener un registro de nuestras comunicaciones",
          "• Hacer seguimiento de oportunidades comerciales potenciales",
          "Su información enviada se almacena de forma segura y solo es accesible por personal autorizado de Revosso para fines comerciales legítimos. Retenemos esta información durante el tiempo necesario para cumplir con los propósitos descritos en esta política o según lo exija la ley."
        ]
      },
      {
        title: "Cookies y Tecnologías de Rastreo",
        content: [
          "Utilizamos cookies y tecnologías de rastreo similares para mejorar su experiencia en nuestro sitio web. Las cookies son pequeños archivos de datos almacenados en su dispositivo que nos ayudan a:",
          "• Recordar su preferencia de idioma",
          "• Analizar el tráfico y los patrones de uso del sitio web",
          "• Mejorar la funcionalidad del sitio web",
          "Puede controlar las cookies a través de la configuración de su navegador. Sin embargo, deshabilitar las cookies puede limitar ciertas funcionalidades de nuestro sitio web. Para más información, consulte nuestra Política de Cookies."
        ]
      },
      {
        title: "Seguridad de Datos",
        content: [
          "Implementamos medidas técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Estas medidas incluyen:",
          "• Transmisión de datos cifrada (HTTPS/TLS)",
          "• Almacenamiento seguro de datos con controles de acceso",
          "• Evaluaciones y actualizaciones regulares de seguridad",
          "• Acceso limitado a información personal según la necesidad de saber",
          "Si bien nos esforzamos por proteger su información, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro. No podemos garantizar seguridad absoluta, pero estamos comprometidos a mantener protecciones estándar de la industria."
        ]
      },
      {
        title: "Transferencias Internacionales de Datos",
        content: [
          "Revosso está registrada en Brasil y opera internacionalmente. Su información puede ser transferida y procesada en Brasil u otros países donde nosotros o nuestros proveedores de servicios operamos.",
          "Cuando transferimos información personal internacionalmente, nos aseguramos de que existan salvaguardias apropiadas para proteger sus datos de acuerdo con esta Política de Privacidad y las leyes aplicables de protección de datos."
        ]
      },
      {
        title: "Retención de Datos",
        content: [
          "Retenemos su información personal durante el tiempo necesario para:",
          "• Cumplir con los propósitos para los que fue recopilada",
          "• Responder a sus consultas y proporcionar servicios",
          "• Cumplir con requisitos legales, contables o de informes",
          "• Resolver disputas y hacer cumplir nuestros acuerdos",
          "Cuando su información ya no sea necesaria, la eliminaremos o anonimizaremos de forma segura."
        ]
      },
      {
        title: "Sus Derechos",
        content: [
          "Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, incluyendo:",
          "• Acceso: Solicitar acceso a la información personal que tenemos sobre usted",
          "• Corrección: Solicitar corrección de información inexacta o incompleta",
          "• Eliminación: Solicitar eliminación de su información personal",
          "• Objeción: Objetar el procesamiento de su información",
          "• Portabilidad de Datos: Solicitar una copia de su información en formato estructurado",
          "• Retiro del Consentimiento: Retirar el consentimiento donde el procesamiento se basa en el consentimiento",
          "Para ejercer estos derechos, contáctenos en privacy@revosso.com. Responderemos a su solicitud dentro de un plazo razonable y de acuerdo con la ley aplicable."
        ]
      },
      {
        title: "Servicios de Terceros",
        content: [
          "Nuestro sitio web puede contener enlaces a sitios web o servicios de terceros. No somos responsables de las prácticas de privacidad de estos terceros. Le recomendamos que revise las políticas de privacidad de cualquier sitio de terceros que visite."
        ]
      },
      {
        title: "Privacidad de Menores",
        content: [
          "Nuestros servicios no están dirigidos a personas menores de 18 años. No recopilamos intencionalmente información personal de niños. Si cree que hemos recopilado información de un niño, contáctenos de inmediato."
        ]
      },
      {
        title: "Cambios a Esta Política de Privacidad",
        content: [
          "Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en nuestras prácticas o requisitos legales. Le notificaremos sobre cualquier cambio material publicando la política actualizada en nuestro sitio web con una fecha \"Última Actualización\" revisada.",
          "Le recomendamos que revise esta Política de Privacidad periódicamente para mantenerse informado sobre cómo protegemos su información."
        ]
      },
      {
        title: "Contáctenos",
        content: [
          "Si tiene preguntas, inquietudes o solicitudes sobre esta Política de Privacidad o nuestras prácticas de privacidad, contáctenos en:",
          "Email: privacy@revosso.com",
          "Contacto general: contact@revosso.com",
          "Haremos nuestro mejor esfuerzo para responder a su consulta dentro de un plazo razonable."
        ]
      }
    ]
  }
}

export default function PrivacyPage() {
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
