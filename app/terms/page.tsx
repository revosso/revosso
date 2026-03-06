"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Code, ArrowLeft } from "lucide-react"

const translations = {
  en: {
    title: "Terms of Service",
    lastUpdated: "Last Updated",
    lastUpdatedDate: "March 5, 2026",
    backToHome: "Back to Home",
    sections: [
      {
        title: "Acceptance of Terms",
        content: [
          "Welcome to Revosso. By accessing or using our website and services, you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree to these Terms, please do not use our website or services.",
          "These Terms apply to all visitors, users, and others who access or use our website. We reserve the right to update or modify these Terms at any time, and any changes will be effective upon posting on this page.",
          "Your continued use of the website after any changes indicates your acceptance of the updated Terms."
        ]
      },
      {
        title: "Description of Services",
        content: [
          "Revosso is a software engineering company that provides:",
          "• Custom software development and platform engineering services",
          "• Platform takeover, optimization, and modernization services",
          "• Infrastructure management and hosting services",
          "• Platform maintenance and technical support",
          "• Software consulting and architectural design",
          "Our website serves as an informational platform where potential clients can learn about our services and submit business inquiries through our contact form.",
          "The specific terms of any software development or service engagement will be governed by separate written agreements between Revosso and the client."
        ]
      },
      {
        title: "Website Use",
        content: [
          "You may use our website for lawful purposes only. You agree not to:",
          "• Use the website in any way that violates any applicable law or regulation",
          "• Attempt to gain unauthorized access to any portion of the website or systems",
          "• Interfere with or disrupt the website or servers",
          "• Transmit any viruses, malware, or harmful code",
          "• Engage in any automated use of the system, such as scraping or unauthorized data collection",
          "• Impersonate any person or entity or falsely represent your affiliation",
          "• Use the website to transmit spam, solicitations, or fraudulent content",
          "We reserve the right to terminate or restrict your access to the website at any time for violations of these Terms."
        ]
      },
      {
        title: "Intellectual Property",
        content: [
          "All content on this website, including but not limited to text, graphics, logos, images, code, and design, is the property of Revosso or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.",
          "You may not reproduce, distribute, modify, create derivative works from, publicly display, or otherwise use any content from this website without our prior written permission.",
          "The Revosso name, logo, and all related names, logos, and slogans are trademarks of Revosso. You may not use these marks without our express written permission.",
          "Any software, tools, or materials developed by Revosso for clients under service agreements will be subject to the intellectual property terms specified in those separate agreements."
        ]
      },
      {
        title: "Business Inquiries and Communications",
        content: [
          "When you submit a business inquiry through our contact form or communicate with us via email:",
          "• You represent that all information provided is accurate and complete",
          "• You grant us permission to contact you regarding your inquiry",
          "• You understand that submission of an inquiry does not create any contractual obligation",
          "• Any formal service engagement requires a separate written agreement",
          "We will use the information you provide solely to respond to your inquiry and assess potential business opportunities, as described in our Privacy Policy."
        ]
      },
      {
        title: "Service Engagements",
        content: [
          "This website and these Terms do not constitute an offer for specific services or pricing. All service engagements, including custom software development, platform engineering, infrastructure management, and related services, require:",
          "• Detailed project scoping and requirements gathering",
          "• A separate written service agreement or statement of work",
          "• Agreed-upon terms regarding deliverables, timelines, pricing, and intellectual property",
          "The service agreement will govern the relationship between Revosso and the client for that specific project."
        ]
      },
      {
        title: "Limitation of Liability",
        content: [
          "To the fullest extent permitted by applicable law:",
          "• This website and its content are provided \"as is\" without warranties of any kind, either express or implied",
          "• We do not guarantee that the website will be uninterrupted, secure, or error-free",
          "• We are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the website",
          "• Our total liability for any claims related to the website shall not exceed the amount paid by you, if any, for accessing the website",
          "These limitations apply even if we have been advised of the possibility of such damages.",
          "Note: Liability terms for contracted software development or service engagements will be specified in separate service agreements."
        ]
      },
      {
        title: "Third-Party Services and Links",
        content: [
          "Our website may contain links to third-party websites or services that are not owned or controlled by Revosso.",
          "We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that Revosso shall not be responsible or liable for any damage or loss caused by your use of any third-party content or services.",
          "We recommend reviewing the terms and privacy policies of any third-party websites you visit."
        ]
      },
      {
        title: "Disclaimer of Warranties",
        content: [
          "Your use of this website is at your sole risk. The website is provided on an \"as is\" and \"as available\" basis without any warranties of any kind, including but not limited to:",
          "• Warranties of merchantability or fitness for a particular purpose",
          "• Warranties regarding accuracy, reliability, or completeness of content",
          "• Warranties that the website will be secure, error-free, or uninterrupted",
          "We make no guarantees about the availability of the website or that it will meet your requirements."
        ]
      },
      {
        title: "Indemnification",
        content: [
          "You agree to indemnify, defend, and hold harmless Revosso, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or related to:",
          "• Your use of the website",
          "• Your violation of these Terms",
          "• Your violation of any rights of another party",
          "• Any content or information you submit through the website"
        ]
      },
      {
        title: "Governing Law and Jurisdiction",
        content: [
          "These Terms are governed by and construed in accordance with the laws of Brazil, where Revosso is registered, without regard to its conflict of law provisions.",
          "Any disputes arising from these Terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Brazil.",
          "For service agreements with international clients, governing law and jurisdiction will be specified in the separate service agreement."
        ]
      },
      {
        title: "Severability",
        content: [
          "If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.",
          "The invalid or unenforceable provision shall be modified to the minimum extent necessary to make it valid and enforceable."
        ]
      },
      {
        title: "Entire Agreement",
        content: [
          "These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and Revosso regarding the use of this website.",
          "These Terms supersede any prior agreements or understandings, whether written or oral, regarding the subject matter.",
          "Note: Separate service agreements for software development or related services will supersede these Terms with respect to those specific engagements."
        ]
      },
      {
        title: "Changes to Terms",
        content: [
          "We reserve the right to modify these Terms at any time. We will notify users of material changes by updating the \"Last Updated\" date at the top of this page.",
          "Your continued use of the website after any changes constitutes your acceptance of the modified Terms. We encourage you to review these Terms periodically."
        ]
      },
      {
        title: "Contact Information",
        content: [
          "If you have any questions about these Terms of Service, please contact us at:",
          "Email: contact@revosso.com",
          "Legal inquiries: legal@revosso.com",
          "We will respond to your inquiry as promptly as possible."
        ]
      }
    ]
  },
  fr: {
    title: "Conditions d'Utilisation",
    lastUpdated: "Dernière mise à jour",
    lastUpdatedDate: "5 mars 2026",
    backToHome: "Retour à l'accueil",
    sections: [
      {
        title: "Acceptation des Conditions",
        content: [
          "Bienvenue chez Revosso. En accédant ou en utilisant notre site web et nos services, vous acceptez d'être lié par ces Conditions d'Utilisation (« Conditions »). Si vous n'acceptez pas ces Conditions, veuillez ne pas utiliser notre site web ou nos services.",
          "Ces Conditions s'appliquent à tous les visiteurs, utilisateurs et autres personnes qui accèdent ou utilisent notre site web. Nous nous réservons le droit de mettre à jour ou de modifier ces Conditions à tout moment, et tout changement sera effectif dès sa publication sur cette page.",
          "Votre utilisation continue du site web après tout changement indique votre acceptation des Conditions mises à jour."
        ]
      },
      {
        title: "Description des Services",
        content: [
          "Revosso est une entreprise d'ingénierie logicielle qui fournit :",
          "• Développement de logiciels personnalisés et services d'ingénierie de plateforme",
          "• Services de reprise, d'optimisation et de modernisation de plateforme",
          "• Services de gestion d'infrastructure et d'hébergement",
          "• Maintenance de plateforme et support technique",
          "• Conseil logiciel et conception architecturale",
          "Notre site web sert de plateforme informative où les clients potentiels peuvent se renseigner sur nos services et soumettre des demandes commerciales via notre formulaire de contact.",
          "Les conditions spécifiques de tout engagement de développement logiciel ou de service seront régies par des accords écrits séparés entre Revosso et le client."
        ]
      },
      {
        title: "Utilisation du Site Web",
        content: [
          "Vous ne pouvez utiliser notre site web qu'à des fins légales. Vous acceptez de ne pas :",
          "• Utiliser le site web d'une manière qui viole toute loi ou réglementation applicable",
          "• Tenter d'obtenir un accès non autorisé à toute partie du site web ou des systèmes",
          "• Interférer avec ou perturber le site web ou les serveurs",
          "• Transmettre des virus, logiciels malveillants ou code nuisible",
          "• S'engager dans toute utilisation automatisée du système, comme le scraping ou la collecte de données non autorisée",
          "• Usurper l'identité de toute personne ou entité ou représenter faussement votre affiliation",
          "• Utiliser le site web pour transmettre du spam, des sollicitations ou du contenu frauduleux",
          "Nous nous réservons le droit de résilier ou de restreindre votre accès au site web à tout moment pour violation de ces Conditions."
        ]
      },
      {
        title: "Propriété Intellectuelle",
        content: [
          "Tout le contenu de ce site web, y compris mais sans s'y limiter le texte, les graphiques, les logos, les images, le code et la conception, est la propriété de Revosso ou de ses fournisseurs de contenu et est protégé par les lois internationales sur le droit d'auteur, les marques de commerce et autres droits de propriété intellectuelle.",
          "Vous ne pouvez pas reproduire, distribuer, modifier, créer des œuvres dérivées, afficher publiquement ou utiliser de toute autre manière tout contenu de ce site web sans notre autorisation écrite préalable.",
          "Le nom Revosso, le logo et tous les noms, logos et slogans associés sont des marques de commerce de Revosso. Vous ne pouvez pas utiliser ces marques sans notre autorisation écrite expresse.",
          "Tout logiciel, outil ou matériel développé par Revosso pour les clients dans le cadre d'accords de service sera soumis aux conditions de propriété intellectuelle spécifiées dans ces accords séparés."
        ]
      },
      {
        title: "Demandes Commerciales et Communications",
        content: [
          "Lorsque vous soumettez une demande commerciale via notre formulaire de contact ou communiquez avec nous par email :",
          "• Vous déclarez que toutes les informations fournies sont exactes et complètes",
          "• Vous nous autorisez à vous contacter concernant votre demande",
          "• Vous comprenez que la soumission d'une demande ne crée aucune obligation contractuelle",
          "• Tout engagement de service formel nécessite un accord écrit séparé",
          "Nous utiliserons les informations que vous fournissez uniquement pour répondre à votre demande et évaluer les opportunités commerciales potentielles, comme décrit dans notre Politique de Confidentialité."
        ]
      },
      {
        title: "Engagements de Service",
        content: [
          "Ce site web et ces Conditions ne constituent pas une offre de services ou de tarifs spécifiques. Tous les engagements de service, y compris le développement de logiciels personnalisés, l'ingénierie de plateforme, la gestion d'infrastructure et les services connexes, nécessitent :",
          "• Une analyse détaillée du projet et une collecte des exigences",
          "• Un accord de service écrit séparé ou un énoncé des travaux",
          "• Des conditions convenues concernant les livrables, les délais, la tarification et la propriété intellectuelle",
          "L'accord de service régira la relation entre Revosso et le client pour ce projet spécifique."
        ]
      },
      {
        title: "Limitation de Responsabilité",
        content: [
          "Dans toute la mesure permise par la loi applicable :",
          "• Ce site web et son contenu sont fournis \"tels quels\" sans garantie d'aucune sorte, expresse ou implicite",
          "• Nous ne garantissons pas que le site web sera ininterrompu, sécurisé ou exempt d'erreurs",
          "• Nous ne sommes pas responsables des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs découlant de votre utilisation du site web",
          "• Notre responsabilité totale pour toute réclamation liée au site web ne doit pas dépasser le montant que vous avez payé, le cas échéant, pour accéder au site web",
          "Ces limitations s'appliquent même si nous avons été informés de la possibilité de tels dommages.",
          "Remarque : Les conditions de responsabilité pour les engagements de développement logiciel ou de service contractés seront spécifiées dans des accords de service séparés."
        ]
      },
      {
        title: "Services et Liens Tiers",
        content: [
          "Notre site web peut contenir des liens vers des sites web ou services tiers qui ne sont pas détenus ou contrôlés par Revosso.",
          "Nous n'avons aucun contrôle et n'assumons aucune responsabilité quant au contenu, aux politiques de confidentialité ou aux pratiques de tout site web ou service tiers. Vous reconnaissez et acceptez que Revosso ne sera pas responsable de tout dommage ou perte causé par votre utilisation de tout contenu ou service tiers.",
          "Nous vous recommandons de consulter les conditions et politiques de confidentialité de tout site web tiers que vous visitez."
        ]
      },
      {
        title: "Exclusion de Garanties",
        content: [
          "Votre utilisation de ce site web est à vos propres risques. Le site web est fourni sur une base \"tel quel\" et \"tel que disponible\" sans aucune garantie d'aucune sorte, y compris mais sans s'y limiter :",
          "• Garanties de qualité marchande ou d'adéquation à un usage particulier",
          "• Garanties concernant l'exactitude, la fiabilité ou l'exhaustivité du contenu",
          "• Garanties que le site web sera sécurisé, exempt d'erreurs ou ininterrompu",
          "Nous ne garantissons pas la disponibilité du site web ni qu'il répondra à vos exigences."
        ]
      },
      {
        title: "Indemnisation",
        content: [
          "Vous acceptez d'indemniser, de défendre et de dégager de toute responsabilité Revosso, ses dirigeants, directeurs, employés et agents contre toute réclamation, responsabilité, dommage, perte et dépense découlant de ou liée à :",
          "• Votre utilisation du site web",
          "• Votre violation de ces Conditions",
          "• Votre violation de tout droit d'une autre partie",
          "• Tout contenu ou information que vous soumettez via le site web"
        ]
      },
      {
        title: "Loi Applicable et Juridiction",
        content: [
          "Ces Conditions sont régies et interprétées conformément aux lois du Brésil, où Revosso est enregistrée, sans égard à ses dispositions relatives aux conflits de lois.",
          "Tout litige découlant de ces Conditions ou de votre utilisation du site web sera soumis à la juridiction exclusive des tribunaux du Brésil.",
          "Pour les accords de service avec des clients internationaux, la loi applicable et la juridiction seront spécifiées dans l'accord de service séparé."
        ]
      },
      {
        title: "Divisibilité",
        content: [
          "Si une disposition de ces Conditions est jugée invalide ou inapplicable par un tribunal compétent, les dispositions restantes continueront de s'appliquer pleinement.",
          "La disposition invalide ou inapplicable sera modifiée dans la mesure minimale nécessaire pour la rendre valide et exécutoire."
        ]
      },
      {
        title: "Accord Complet",
        content: [
          "Ces Conditions, ainsi que notre Politique de Confidentialité et notre Politique de Cookies, constituent l'accord complet entre vous et Revosso concernant l'utilisation de ce site web.",
          "Ces Conditions remplacent tout accord ou entente préalable, écrit ou oral, concernant le sujet.",
          "Remarque : Les accords de service séparés pour le développement de logiciels ou les services connexes remplaceront ces Conditions en ce qui concerne ces engagements spécifiques."
        ]
      },
      {
        title: "Modifications des Conditions",
        content: [
          "Nous nous réservons le droit de modifier ces Conditions à tout moment. Nous informerons les utilisateurs des changements importants en mettant à jour la date \"Dernière mise à jour\" en haut de cette page.",
          "Votre utilisation continue du site web après tout changement constitue votre acceptation des Conditions modifiées. Nous vous encourageons à consulter ces Conditions périodiquement."
        ]
      },
      {
        title: "Informations de Contact",
        content: [
          "Si vous avez des questions concernant ces Conditions d'Utilisation, veuillez nous contacter à :",
          "Email : contact@revosso.com",
          "Demandes légales : legal@revosso.com",
          "Nous répondrons à votre demande dans les meilleurs délais."
        ]
      }
    ]
  },
  "pt-BR": {
    title: "Termos de Serviço",
    lastUpdated: "Última Atualização",
    lastUpdatedDate: "5 de março de 2026",
    backToHome: "Voltar ao Início",
    sections: [
      {
        title: "Aceitação dos Termos",
        content: [
          "Bem-vindo à Revosso. Ao acessar ou usar nosso site e serviços, você concorda em estar vinculado a estes Termos de Serviço (\"Termos\"). Se você não concorda com estes Termos, por favor, não use nosso site ou serviços.",
          "Estes Termos se aplicam a todos os visitantes, usuários e outras pessoas que acessam ou usam nosso site. Reservamos o direito de atualizar ou modificar estes Termos a qualquer momento, e quaisquer alterações serão efetivas após a publicação nesta página.",
          "Seu uso contínuo do site após quaisquer alterações indica sua aceitação dos Termos atualizados."
        ]
      },
      {
        title: "Descrição dos Serviços",
        content: [
          "A Revosso é uma empresa de engenharia de software que fornece:",
          "• Desenvolvimento de software personalizado e serviços de engenharia de plataforma",
          "• Serviços de aquisição, otimização e modernização de plataforma",
          "• Serviços de gerenciamento de infraestrutura e hospedagem",
          "• Manutenção de plataforma e suporte técnico",
          "• Consultoria de software e design arquitetônico",
          "Nosso site serve como uma plataforma informativa onde clientes potenciais podem aprender sobre nossos serviços e enviar consultas comerciais através do nosso formulário de contato.",
          "Os termos específicos de qualquer envolvimento de desenvolvimento de software ou serviço serão regidos por acordos escritos separados entre a Revosso e o cliente."
        ]
      },
      {
        title: "Uso do Site",
        content: [
          "Você pode usar nosso site apenas para fins legais. Você concorda em não:",
          "• Usar o site de qualquer forma que viole qualquer lei ou regulamento aplicável",
          "• Tentar obter acesso não autorizado a qualquer parte do site ou sistemas",
          "• Interferir ou interromper o site ou servidores",
          "• Transmitir qualquer vírus, malware ou código prejudicial",
          "• Envolver-se em qualquer uso automatizado do sistema, como raspagem ou coleta de dados não autorizada",
          "• Personificar qualquer pessoa ou entidade ou representar falsamente sua afiliação",
          "• Usar o site para transmitir spam, solicitações ou conteúdo fraudulento",
          "Reservamos o direito de encerrar ou restringir seu acesso ao site a qualquer momento por violações destes Termos."
        ]
      },
      {
        title: "Propriedade Intelectual",
        content: [
          "Todo o conteúdo deste site, incluindo mas não se limitando a texto, gráficos, logos, imagens, código e design, é propriedade da Revosso ou de seus fornecedores de conteúdo e é protegido por leis internacionais de direitos autorais, marcas registradas e outras propriedades intelectuais.",
          "Você não pode reproduzir, distribuir, modificar, criar obras derivadas, exibir publicamente ou usar de outra forma qualquer conteúdo deste site sem nossa permissão prévia por escrito.",
          "O nome Revosso, logotipo e todos os nomes, logos e slogans relacionados são marcas registradas da Revosso. Você não pode usar essas marcas sem nossa permissão expressa por escrito.",
          "Qualquer software, ferramentas ou materiais desenvolvidos pela Revosso para clientes sob acordos de serviço estará sujeito aos termos de propriedade intelectual especificados nesses acordos separados."
        ]
      },
      {
        title: "Consultas Comerciais e Comunicações",
        content: [
          "Quando você envia uma consulta comercial através do nosso formulário de contato ou se comunica conosco por email:",
          "• Você declara que todas as informações fornecidas são precisas e completas",
          "• Você nos concede permissão para contatá-lo sobre sua consulta",
          "• Você entende que o envio de uma consulta não cria nenhuma obrigação contratual",
          "• Qualquer envolvimento de serviço formal requer um acordo escrito separado",
          "Usaremos as informações fornecidas apenas para responder à sua consulta e avaliar oportunidades de negócios potenciais, conforme descrito em nossa Política de Privacidade."
        ]
      },
      {
        title: "Envolvimentos de Serviço",
        content: [
          "Este site e estes Termos não constituem uma oferta de serviços ou preços específicos. Todos os envolvimentos de serviço, incluindo desenvolvimento de software personalizado, engenharia de plataforma, gerenciamento de infraestrutura e serviços relacionados, requerem:",
          "• Escopo detalhado do projeto e levantamento de requisitos",
          "• Um acordo de serviço escrito separado ou declaração de trabalho",
          "• Termos acordados sobre entregáveis, cronogramas, preços e propriedade intelectual",
          "O acordo de serviço regerá a relação entre a Revosso e o cliente para esse projeto específico."
        ]
      },
      {
        title: "Limitação de Responsabilidade",
        content: [
          "Na medida máxima permitida pela lei aplicável:",
          "• Este site e seu conteúdo são fornecidos \"no estado em que se encontram\" sem garantias de qualquer tipo, expressas ou implícitas",
          "• Não garantimos que o site será ininterrupto, seguro ou livre de erros",
          "• Não somos responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do seu uso do site",
          "• Nossa responsabilidade total por quaisquer reivindicações relacionadas ao site não deve exceder o valor pago por você, se houver, para acessar o site",
          "Essas limitações se aplicam mesmo se formos avisados da possibilidade de tais danos.",
          "Nota: Os termos de responsabilidade para envolvimentos de desenvolvimento de software ou serviço contratados serão especificados em acordos de serviço separados."
        ]
      },
      {
        title: "Serviços e Links de Terceiros",
        content: [
          "Nosso site pode conter links para sites ou serviços de terceiros que não são de propriedade ou controlados pela Revosso.",
          "Não temos controle e não assumimos responsabilidade pelo conteúdo, políticas de privacidade ou práticas de quaisquer sites ou serviços de terceiros. Você reconhece e concorda que a Revosso não será responsável por qualquer dano ou perda causado pelo seu uso de qualquer conteúdo ou serviço de terceiros.",
          "Recomendamos que você revise os termos e políticas de privacidade de quaisquer sites de terceiros que você visitar."
        ]
      },
      {
        title: "Isenção de Garantias",
        content: [
          "Seu uso deste site é por sua conta e risco. O site é fornecido \"no estado em que se encontra\" e \"conforme disponível\" sem quaisquer garantias de qualquer tipo, incluindo mas não se limitando a:",
          "• Garantias de comercialização ou adequação a um propósito específico",
          "• Garantias sobre precisão, confiabilidade ou integralidade do conteúdo",
          "• Garantias de que o site será seguro, livre de erros ou ininterrupto",
          "Não fazemos garantias sobre a disponibilidade do site ou que ele atenderá aos seus requisitos."
        ]
      },
      {
        title: "Indenização",
        content: [
          "Você concorda em indenizar, defender e isentar a Revosso, seus diretores, executivos, funcionários e agentes de e contra quaisquer reivindicações, responsabilidades, danos, perdas e despesas decorrentes de ou relacionadas a:",
          "• Seu uso do site",
          "• Sua violação destes Termos",
          "• Sua violação de quaisquer direitos de outra parte",
          "• Qualquer conteúdo ou informação que você enviar através do site"
        ]
      },
      {
        title: "Lei Aplicável e Jurisdição",
        content: [
          "Estes Termos são regidos e interpretados de acordo com as leis do Brasil, onde a Revosso está registrada, sem considerar suas disposições sobre conflito de leis.",
          "Quaisquer disputas decorrentes destes Termos ou do seu uso do site estarão sujeitas à jurisdição exclusiva dos tribunais do Brasil.",
          "Para acordos de serviço com clientes internacionais, a lei aplicável e jurisdição serão especificadas no acordo de serviço separado."
        ]
      },
      {
        title: "Separabilidade",
        content: [
          "Se qualquer disposição destes Termos for considerada inválida ou inexequível por um tribunal competente, as disposições restantes continuarão em pleno vigor e efeito.",
          "A disposição inválida ou inexequível será modificada na medida mínima necessária para torná-la válida e exequível."
        ]
      },
      {
        title: "Acordo Completo",
        content: [
          "Estes Termos, juntamente com nossa Política de Privacidade e Política de Cookies, constituem o acordo completo entre você e a Revosso em relação ao uso deste site.",
          "Estes Termos substituem quaisquer acordos ou entendimentos anteriores, sejam escritos ou orais, sobre o assunto.",
          "Nota: Acordos de serviço separados para desenvolvimento de software ou serviços relacionados substituirão estes Termos com relação a esses envolvimentos específicos."
        ]
      },
      {
        title: "Alterações aos Termos",
        content: [
          "Reservamos o direito de modificar estes Termos a qualquer momento. Notificaremos os usuários sobre alterações materiais atualizando a data \"Última Atualização\" no topo desta página.",
          "Seu uso contínuo do site após quaisquer alterações constitui sua aceitação dos Termos modificados. Encorajamos você a revisar estes Termos periodicamente."
        ]
      },
      {
        title: "Informações de Contato",
        content: [
          "Se você tiver qualquer dúvida sobre estes Termos de Serviço, entre em contato conosco:",
          "Email: contact@revosso.com",
          "Consultas legais: legal@revosso.com",
          "Responderemos à sua consulta o mais rápido possível."
        ]
      }
    ]
  },
  es: {
    title: "Términos de Servicio",
    lastUpdated: "Última Actualización",
    lastUpdatedDate: "5 de marzo de 2026",
    backToHome: "Volver al Inicio",
    sections: [
      {
        title: "Aceptación de los Términos",
        content: [
          "Bienvenido a Revosso. Al acceder o utilizar nuestro sitio web y servicios, usted acepta estar sujeto a estos Términos de Servicio (\"Términos\"). Si no está de acuerdo con estos Términos, por favor no utilice nuestro sitio web o servicios.",
          "Estos Términos se aplican a todos los visitantes, usuarios y otras personas que acceden o utilizan nuestro sitio web. Nos reservamos el derecho de actualizar o modificar estos Términos en cualquier momento, y cualquier cambio será efectivo al publicarse en esta página.",
          "Su uso continuado del sitio web después de cualquier cambio indica su aceptación de los Términos actualizados."
        ]
      },
      {
        title: "Descripción de los Servicios",
        content: [
          "Revosso es una empresa de ingeniería de software que proporciona:",
          "• Desarrollo de software personalizado y servicios de ingeniería de plataforma",
          "• Servicios de adquisición, optimización y modernización de plataforma",
          "• Servicios de gestión de infraestructura y alojamiento",
          "• Mantenimiento de plataforma y soporte técnico",
          "• Consultoría de software y diseño arquitectónico",
          "Nuestro sitio web sirve como plataforma informativa donde los clientes potenciales pueden conocer nuestros servicios y enviar consultas comerciales a través de nuestro formulario de contacto.",
          "Los términos específicos de cualquier compromiso de desarrollo de software o servicio se regirán por acuerdos escritos separados entre Revosso y el cliente."
        ]
      },
      {
        title: "Uso del Sitio Web",
        content: [
          "Puede utilizar nuestro sitio web solo con fines legales. Usted acepta no:",
          "• Usar el sitio web de cualquier manera que viole cualquier ley o regulación aplicable",
          "• Intentar obtener acceso no autorizado a cualquier parte del sitio web o sistemas",
          "• Interferir o interrumpir el sitio web o servidores",
          "• Transmitir cualquier virus, malware o código dañino",
          "• Participar en cualquier uso automatizado del sistema, como raspado o recopilación de datos no autorizada",
          "• Suplantar a cualquier persona o entidad o representar falsamente su afiliación",
          "• Usar el sitio web para transmitir spam, solicitudes o contenido fraudulento",
          "Nos reservamos el derecho de terminar o restringir su acceso al sitio web en cualquier momento por violaciones de estos Términos."
        ]
      },
      {
        title: "Propiedad Intelectual",
        content: [
          "Todo el contenido de este sitio web, incluidos pero no limitados a texto, gráficos, logotipos, imágenes, código y diseño, es propiedad de Revosso o sus proveedores de contenido y está protegido por leyes internacionales de derechos de autor, marcas registradas y otras propiedades intelectuales.",
          "No puede reproducir, distribuir, modificar, crear obras derivadas, exhibir públicamente o usar de otra manera cualquier contenido de este sitio web sin nuestro permiso previo por escrito.",
          "El nombre Revosso, el logotipo y todos los nombres, logotipos y eslóganes relacionados son marcas comerciales de Revosso. No puede usar estas marcas sin nuestro permiso expreso por escrito.",
          "Cualquier software, herramienta o material desarrollado por Revosso para clientes bajo acuerdos de servicio estará sujeto a los términos de propiedad intelectual especificados en esos acuerdos separados."
        ]
      },
      {
        title: "Consultas Comerciales y Comunicaciones",
        content: [
          "Cuando envía una consulta comercial a través de nuestro formulario de contacto o se comunica con nosotros por correo electrónico:",
          "• Usted declara que toda la información proporcionada es precisa y completa",
          "• Usted nos otorga permiso para contactarlo con respecto a su consulta",
          "• Usted entiende que el envío de una consulta no crea ninguna obligación contractual",
          "• Cualquier compromiso de servicio formal requiere un acuerdo escrito separado",
          "Utilizaremos la información que proporcione únicamente para responder a su consulta y evaluar oportunidades comerciales potenciales, como se describe en nuestra Política de Privacidad."
        ]
      },
      {
        title: "Compromisos de Servicio",
        content: [
          "Este sitio web y estos Términos no constituyen una oferta de servicios o precios específicos. Todos los compromisos de servicio, incluido el desarrollo de software personalizado, ingeniería de plataforma, gestión de infraestructura y servicios relacionados, requieren:",
          "• Alcance detallado del proyecto y recopilación de requisitos",
          "• Un acuerdo de servicio escrito separado o declaración de trabajo",
          "• Términos acordados sobre entregables, plazos, precios y propiedad intelectual",
          "El acuerdo de servicio regirá la relación entre Revosso y el cliente para ese proyecto específico."
        ]
      },
      {
        title: "Limitación de Responsabilidad",
        content: [
          "En la máxima medida permitida por la ley aplicable:",
          "• Este sitio web y su contenido se proporcionan \"tal cual\" sin garantías de ningún tipo, ya sean expresas o implícitas",
          "• No garantizamos que el sitio web sea ininterrumpido, seguro o libre de errores",
          "• No somos responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo que surja de su uso del sitio web",
          "• Nuestra responsabilidad total por cualquier reclamo relacionado con el sitio web no excederá la cantidad pagada por usted, si corresponde, para acceder al sitio web",
          "Estas limitaciones se aplican incluso si hemos sido informados de la posibilidad de tales daños.",
          "Nota: Los términos de responsabilidad para compromisos de desarrollo de software o servicio contratados se especificarán en acuerdos de servicio separados."
        ]
      },
      {
        title: "Servicios y Enlaces de Terceros",
        content: [
          "Nuestro sitio web puede contener enlaces a sitios web o servicios de terceros que no son propiedad ni están controlados por Revosso.",
          "No tenemos control y no asumimos responsabilidad por el contenido, las políticas de privacidad o las prácticas de cualquier sitio web o servicio de terceros. Usted reconoce y acepta que Revosso no será responsable de ningún daño o pérdida causado por su uso de cualquier contenido o servicio de terceros.",
          "Recomendamos revisar los términos y políticas de privacidad de cualquier sitio web de terceros que visite."
        ]
      },
      {
        title: "Renuncia de Garantías",
        content: [
          "Su uso de este sitio web es bajo su propio riesgo. El sitio web se proporciona \"tal cual\" y \"según disponibilidad\" sin ninguna garantía de ningún tipo, incluidas pero no limitadas a:",
          "• Garantías de comerciabilidad o idoneidad para un propósito particular",
          "• Garantías sobre precisión, confiabilidad o integridad del contenido",
          "• Garantías de que el sitio web será seguro, libre de errores o ininterrumpido",
          "No garantizamos la disponibilidad del sitio web ni que cumpla con sus requisitos."
        ]
      },
      {
        title: "Indemnización",
        content: [
          "Usted acepta indemnizar, defender y eximir a Revosso, sus funcionarios, directores, empleados y agentes de y contra cualquier reclamo, responsabilidad, daño, pérdida y gasto que surja de o esté relacionado con:",
          "• Su uso del sitio web",
          "• Su violación de estos Términos",
          "• Su violación de cualquier derecho de otra parte",
          "• Cualquier contenido o información que envíe a través del sitio web"
        ]
      },
      {
        title: "Ley Aplicable y Jurisdicción",
        content: [
          "Estos Términos se rigen e interpretan de acuerdo con las leyes de Brasil, donde Revosso está registrada, sin considerar sus disposiciones sobre conflicto de leyes.",
          "Cualquier disputa que surja de estos Términos o su uso del sitio web estará sujeta a la jurisdicción exclusiva de los tribunales de Brasil.",
          "Para acuerdos de servicio con clientes internacionales, la ley aplicable y la jurisdicción se especificarán en el acuerdo de servicio separado."
        ]
      },
      {
        title: "Separabilidad",
        content: [
          "Si alguna disposición de estos Términos es considerada inválida o inaplicable por un tribunal competente, las disposiciones restantes continuarán en pleno vigor y efecto.",
          "La disposición inválida o inaplicable se modificará en la medida mínima necesaria para hacerla válida y aplicable."
        ]
      },
      {
        title: "Acuerdo Completo",
        content: [
          "Estos Términos, junto con nuestra Política de Privacidad y Política de Cookies, constituyen el acuerdo completo entre usted y Revosso con respecto al uso de este sitio web.",
          "Estos Términos reemplazan cualquier acuerdo o entendimiento previo, ya sea escrito u oral, sobre el tema.",
          "Nota: Los acuerdos de servicio separados para desarrollo de software o servicios relacionados reemplazarán estos Términos con respecto a esos compromisos específicos."
        ]
      },
      {
        title: "Cambios a los Términos",
        content: [
          "Nos reservamos el derecho de modificar estos Términos en cualquier momento. Notificaremos a los usuarios de cambios importantes actualizando la fecha \"Última Actualización\" en la parte superior de esta página.",
          "Su uso continuado del sitio web después de cualquier cambio constituye su aceptación de los Términos modificados. Le recomendamos que revise estos Términos periódicamente."
        ]
      },
      {
        title: "Información de Contacto",
        content: [
          "Si tiene alguna pregunta sobre estos Términos de Servicio, contáctenos:",
          "Email: contact@revosso.com",
          "Consultas legales: legal@revosso.com",
          "Responderemos a su consulta lo antes posible."
        ]
      }
    ]
  }
}

export default function TermsPage() {
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
