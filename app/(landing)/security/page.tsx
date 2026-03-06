"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Code, ArrowLeft, Shield, Lock, Server, AlertTriangle } from "lucide-react"

const translations = {
  en: {
    title: "Security",
    subtitle: "Our commitment to protecting your information and infrastructure",
    backToHome: "Back to Home",
    sections: [
      {
        icon: "shield",
        title: "Our Security Approach",
        content: [
          "At Revosso, security is fundamental to everything we do. As a software engineering company that builds, operates, and maintains critical business platforms, we understand that security is not optional—it's essential.",
          "We apply security best practices across all aspects of our work: from writing code to deploying infrastructure, from handling data to communicating with clients.",
          "Our security approach is built on industry-standard principles and continuously evolves to address emerging threats and technologies."
        ]
      },
      {
        icon: "server",
        title: "Infrastructure Security",
        content: [
          "We leverage modern cloud infrastructure provided by reputable providers with proven security track records. Our infrastructure practices include:",
          "• Encrypted data transmission using HTTPS/TLS protocols",
          "• Secure authentication and access control systems",
          "• Regular security updates and patch management",
          "• Network isolation and firewall protection",
          "• Automated backup systems with encryption at rest",
          "• Monitoring and logging for security events",
          "For client projects, we design and implement infrastructure tailored to specific security requirements, compliance needs, and risk profiles."
        ]
      },
      {
        icon: "lock",
        title: "Application Security",
        content: [
          "Security is integrated into every phase of our software development process:",
          "Development Practices:",
          "• Secure coding standards and code reviews",
          "• Input validation and sanitization",
          "• Protection against common vulnerabilities (SQL injection, XSS, CSRF, etc.)",
          "• Secure authentication and session management",
          "• Proper error handling without exposing sensitive information",
          "Testing & Validation:",
          "• Security testing during development",
          "• Dependency scanning for known vulnerabilities",
          "• Regular updates of libraries and frameworks",
          "Deployment:",
          "• Secure deployment pipelines",
          "• Environment separation (development, staging, production)",
          "• Secrets management and configuration security"
        ]
      },
      {
        icon: "database",
        title: "Data Protection",
        content: [
          "We implement appropriate measures to protect data confidentiality, integrity, and availability:",
          "• Encryption of sensitive data in transit and at rest",
          "• Access controls based on the principle of least privilege",
          "• Data backup and disaster recovery procedures",
          "• Secure data disposal when no longer needed",
          "• Compliance with applicable data protection regulations",
          "For our website, we collect minimal personal information (primarily through contact forms) and handle it according to our Privacy Policy.",
          "For client projects, data protection measures are tailored to the specific requirements, sensitivity level, and regulatory obligations of each project."
        ]
      },
      {
        icon: "users",
        title: "Access Control & Authentication",
        content: [
          "We employ robust access control mechanisms:",
          "• Strong authentication requirements",
          "• Multi-factor authentication where appropriate",
          "• Role-based access control (RBAC)",
          "• Regular review and audit of access permissions",
          "• Secure credential storage and management",
          "• Session security and timeout policies",
          "For systems we build and operate, authentication and authorization mechanisms are designed according to security requirements and industry best practices."
        ]
      },
      {
        icon: "monitor",
        title: "Monitoring & Incident Response",
        content: [
          "We maintain visibility into our systems and respond promptly to security concerns:",
          "• Continuous monitoring of infrastructure and applications",
          "• Automated alerting for suspicious activities",
          "• Regular security log review",
          "• Incident response procedures",
          "• Post-incident analysis and improvement",
          "While we strive to prevent security incidents, we recognize that rapid detection and response are critical components of a comprehensive security posture."
        ]
      },
      {
        icon: "update",
        title: "Security Updates & Maintenance",
        content: [
          "Technology evolves, and so do security threats. We maintain security through:",
          "• Regular security updates and patches",
          "• Monitoring for vulnerabilities in dependencies",
          "• Staying informed about emerging threats and security best practices",
          "• Periodic security reviews and improvements",
          "• Updating security policies and procedures as needed",
          "For platforms we operate and maintain for clients, we provide ongoing security maintenance as part of our service agreements."
        ]
      },
      {
        icon: "alert",
        title: "Responsible Disclosure",
        content: [
          "We value the security research community and welcome responsible disclosure of potential security vulnerabilities.",
          "If you discover a security issue in our website or systems, please report it to us responsibly:",
          "• Email: security@revosso.com",
          "• Provide detailed information about the vulnerability",
          "• Allow reasonable time for us to investigate and address the issue before public disclosure",
          "• Do not access or modify data that doesn't belong to you",
          "• Do not perform destructive testing",
          "We commit to:",
          "• Acknowledge receipt of your report promptly",
          "• Keep you informed about our investigation and remediation",
          "• Treat you fairly and with respect",
          "• Credit you for the discovery if you wish (or remain anonymous)",
          "We do not currently have a formal bug bounty program, but we deeply appreciate responsible security research that helps us improve our security posture."
        ]
      },
      {
        icon: "compliance",
        title: "Compliance & Standards",
        content: [
          "While we are a software engineering company and not subject to industry-specific certifications, we follow recognized security standards and best practices:",
          "• OWASP guidelines for application security",
          "• Industry-standard encryption protocols",
          "• Data protection principles aligned with GDPR and similar regulations",
          "• Secure development lifecycle practices",
          "For client projects with specific compliance requirements (e.g., financial regulations, healthcare standards, or data protection laws), we design and implement solutions that meet those requirements."
        ]
      },
      {
        icon: "team",
        title: "Team Security Awareness",
        content: [
          "Security is a team responsibility. We foster a security-conscious culture through:",
          "• Ongoing security training and awareness",
          "• Secure development practices and guidelines",
          "• Code review processes that include security considerations",
          "• Clear security policies and procedures",
          "• Secure handling of credentials and sensitive information",
          "Every team member understands their role in maintaining security and protecting client data."
        ]
      },
      {
        icon: "limitations",
        title: "Security Limitations",
        content: [
          "We are committed to maintaining strong security, but we also believe in transparency:",
          "• No system is completely immune to security threats",
          "• Security is a continuous process, not a one-time achievement",
          "• New vulnerabilities and attack vectors emerge regularly",
          "• Human error can never be completely eliminated",
          "We continuously work to minimize security risks, but we cannot guarantee absolute security. What we can promise is:",
          "• Ongoing commitment to security best practices",
          "• Prompt response to identified vulnerabilities",
          "• Transparency about security incidents that may affect you",
          "• Continuous improvement of our security posture"
        ]
      },
      {
        icon: "contact",
        title: "Contact Us",
        content: [
          "For security-related inquiries, vulnerability reports, or questions about our security practices:",
          "Security Issues: security@revosso.com",
          "General Contact: contact@revosso.com",
          "Privacy Questions: privacy@revosso.com",
          "We take security seriously and will respond to legitimate security concerns as quickly as possible."
        ]
      }
    ]
  },
  fr: {
    title: "Sécurité",
    subtitle: "Notre engagement à protéger vos informations et votre infrastructure",
    backToHome: "Retour à l'accueil",
    sections: [
      {
        icon: "shield",
        title: "Notre Approche de la Sécurité",
        content: [
          "Chez Revosso, la sécurité est fondamentale dans tout ce que nous faisons. En tant qu'entreprise d'ingénierie logicielle qui construit, exploite et maintient des plateformes d'affaires critiques, nous comprenons que la sécurité n'est pas optionnelle—elle est essentielle.",
          "Nous appliquons les meilleures pratiques de sécurité dans tous les aspects de notre travail : de l'écriture de code au déploiement d'infrastructure, du traitement des données à la communication avec les clients.",
          "Notre approche de la sécurité est basée sur des principes standards de l'industrie et évolue continuellement pour faire face aux menaces et technologies émergentes."
        ]
      },
      {
        icon: "server",
        title: "Sécurité de l'Infrastructure",
        content: [
          "Nous exploitons une infrastructure cloud moderne fournie par des fournisseurs réputés avec des antécédents de sécurité prouvés. Nos pratiques d'infrastructure incluent :",
          "• Transmission de données cryptée utilisant les protocoles HTTPS/TLS",
          "• Systèmes d'authentification sécurisée et de contrôle d'accès",
          "• Mises à jour de sécurité régulières et gestion des correctifs",
          "• Isolation réseau et protection par pare-feu",
          "• Systèmes de sauvegarde automatisés avec cryptage au repos",
          "• Surveillance et journalisation des événements de sécurité",
          "Pour les projets clients, nous concevons et mettons en œuvre une infrastructure adaptée aux exigences de sécurité spécifiques, aux besoins de conformité et aux profils de risque."
        ]
      },
      {
        icon: "lock",
        title: "Sécurité des Applications",
        content: [
          "La sécurité est intégrée à chaque phase de notre processus de développement logiciel :",
          "Pratiques de Développement :",
          "• Standards de codage sécurisé et révisions de code",
          "• Validation et assainissement des entrées",
          "• Protection contre les vulnérabilités courantes (injection SQL, XSS, CSRF, etc.)",
          "• Authentification sécurisée et gestion des sessions",
          "• Gestion appropriée des erreurs sans exposer d'informations sensibles",
          "Tests et Validation :",
          "• Tests de sécurité pendant le développement",
          "• Analyse des dépendances pour les vulnérabilités connues",
          "• Mises à jour régulières des bibliothèques et frameworks",
          "Déploiement :",
          "• Pipelines de déploiement sécurisés",
          "• Séparation des environnements (développement, staging, production)",
          "• Gestion des secrets et sécurité de la configuration"
        ]
      },
      {
        icon: "database",
        title: "Protection des Données",
        content: [
          "Nous mettons en œuvre des mesures appropriées pour protéger la confidentialité, l'intégrité et la disponibilité des données :",
          "• Cryptage des données sensibles en transit et au repos",
          "• Contrôles d'accès basés sur le principe du moindre privilège",
          "• Procédures de sauvegarde des données et de reprise après sinistre",
          "• Élimination sécurisée des données lorsqu'elles ne sont plus nécessaires",
          "• Conformité aux réglementations applicables en matière de protection des données",
          "Pour notre site web, nous collectons un minimum d'informations personnelles (principalement via des formulaires de contact) et les traitons conformément à notre Politique de Confidentialité.",
          "Pour les projets clients, les mesures de protection des données sont adaptées aux exigences spécifiques, au niveau de sensibilité et aux obligations réglementaires de chaque projet."
        ]
      },
      {
        icon: "users",
        title: "Contrôle d'Accès et Authentification",
        content: [
          "Nous employons des mécanismes de contrôle d'accès robustes :",
          "• Exigences d'authentification forte",
          "• Authentification multifacteur le cas échéant",
          "• Contrôle d'accès basé sur les rôles (RBAC)",
          "• Révision et audit réguliers des permissions d'accès",
          "• Stockage et gestion sécurisés des identifiants",
          "• Sécurité des sessions et politiques de timeout",
          "Pour les systèmes que nous construisons et exploitons, les mécanismes d'authentification et d'autorisation sont conçus selon les exigences de sécurité et les meilleures pratiques de l'industrie."
        ]
      },
      {
        icon: "monitor",
        title: "Surveillance et Réponse aux Incidents",
        content: [
          "Nous maintenons une visibilité sur nos systèmes et répondons rapidement aux préoccupations de sécurité :",
          "• Surveillance continue de l'infrastructure et des applications",
          "• Alertes automatisées pour les activités suspectes",
          "• Révision régulière des journaux de sécurité",
          "• Procédures de réponse aux incidents",
          "• Analyse post-incident et amélioration",
          "Bien que nous nous efforcions de prévenir les incidents de sécurité, nous reconnaissons que la détection et la réponse rapides sont des composants critiques d'une posture de sécurité complète."
        ]
      },
      {
        icon: "update",
        title: "Mises à Jour de Sécurité et Maintenance",
        content: [
          "La technologie évolue, tout comme les menaces de sécurité. Nous maintenons la sécurité grâce à :",
          "• Mises à jour de sécurité et correctifs réguliers",
          "• Surveillance des vulnérabilités dans les dépendances",
          "• Information sur les menaces émergentes et les meilleures pratiques de sécurité",
          "• Révisions et améliorations périodiques de la sécurité",
          "• Mise à jour des politiques et procédures de sécurité selon les besoins",
          "Pour les plateformes que nous exploitons et maintenons pour les clients, nous fournissons une maintenance de sécurité continue dans le cadre de nos accords de service."
        ]
      },
      {
        icon: "alert",
        title: "Divulgation Responsable",
        content: [
          "Nous apprécions la communauté de recherche en sécurité et accueillons la divulgation responsable des vulnérabilités de sécurité potentielles.",
          "Si vous découvrez un problème de sécurité sur notre site web ou nos systèmes, veuillez nous le signaler de manière responsable :",
          "• Email : security@revosso.com",
          "• Fournissez des informations détaillées sur la vulnérabilité",
          "• Accordez un délai raisonnable pour enquêter et résoudre le problème avant divulgation publique",
          "• N'accédez pas ou ne modifiez pas de données qui ne vous appartiennent pas",
          "• N'effectuez pas de tests destructifs",
          "Nous nous engageons à :",
          "• Accuser réception de votre rapport rapidement",
          "• Vous tenir informé de notre enquête et remédiation",
          "• Vous traiter équitablement et avec respect",
          "• Vous créditer pour la découverte si vous le souhaitez (ou rester anonyme)",
          "Nous n'avons actuellement pas de programme de prime aux bugs formel, mais nous apprécions profondément la recherche en sécurité responsable qui nous aide à améliorer notre posture de sécurité."
        ]
      },
      {
        icon: "compliance",
        title: "Conformité et Normes",
        content: [
          "Bien que nous soyons une entreprise d'ingénierie logicielle et non soumise à des certifications spécifiques à l'industrie, nous suivons des normes et meilleures pratiques de sécurité reconnues :",
          "• Directives OWASP pour la sécurité des applications",
          "• Protocoles de cryptage standards de l'industrie",
          "• Principes de protection des données alignés avec le RGPD et réglementations similaires",
          "• Pratiques de cycle de vie de développement sécurisé",
          "Pour les projets clients avec des exigences de conformité spécifiques (par exemple, réglementations financières, normes de santé ou lois sur la protection des données), nous concevons et mettons en œuvre des solutions qui répondent à ces exigences."
        ]
      },
      {
        icon: "team",
        title: "Sensibilisation Sécurité de l'Équipe",
        content: [
          "La sécurité est une responsabilité d'équipe. Nous favorisons une culture consciente de la sécurité grâce à :",
          "• Formation continue et sensibilisation à la sécurité",
          "• Pratiques et directives de développement sécurisé",
          "• Processus de révision de code incluant des considérations de sécurité",
          "• Politiques et procédures de sécurité claires",
          "• Manipulation sécurisée des identifiants et informations sensibles",
          "Chaque membre de l'équipe comprend son rôle dans le maintien de la sécurité et la protection des données clients."
        ]
      },
      {
        icon: "limitations",
        title: "Limitations de Sécurité",
        content: [
          "Nous nous engageons à maintenir une sécurité solide, mais nous croyons aussi en la transparence :",
          "• Aucun système n'est complètement immunisé contre les menaces de sécurité",
          "• La sécurité est un processus continu, pas une réalisation ponctuelle",
          "• De nouvelles vulnérabilités et vecteurs d'attaque émergent régulièrement",
          "• L'erreur humaine ne peut jamais être complètement éliminée",
          "Nous travaillons continuellement pour minimiser les risques de sécurité, mais nous ne pouvons garantir une sécurité absolue. Ce que nous pouvons promettre est :",
          "• Engagement continu envers les meilleures pratiques de sécurité",
          "• Réponse rapide aux vulnérabilités identifiées",
          "• Transparence sur les incidents de sécurité qui pourraient vous affecter",
          "• Amélioration continue de notre posture de sécurité"
        ]
      },
      {
        icon: "contact",
        title: "Nous Contacter",
        content: [
          "Pour les demandes relatives à la sécurité, les rapports de vulnérabilité ou les questions sur nos pratiques de sécurité :",
          "Problèmes de sécurité : security@revosso.com",
          "Contact général : contact@revosso.com",
          "Questions de confidentialité : privacy@revosso.com",
          "Nous prenons la sécurité au sérieux et répondrons aux préoccupations de sécurité légitimes aussi rapidement que possible."
        ]
      }
    ]
  },
  "pt-BR": {
    title: "Segurança",
    subtitle: "Nosso compromisso em proteger suas informações e infraestrutura",
    backToHome: "Voltar ao Início",
    sections: [
      {
        icon: "shield",
        title: "Nossa Abordagem de Segurança",
        content: [
          "Na Revosso, a segurança é fundamental em tudo o que fazemos. Como uma empresa de engenharia de software que constrói, opera e mantém plataformas de negócios críticas, entendemos que a segurança não é opcional—é essencial.",
          "Aplicamos as melhores práticas de segurança em todos os aspectos do nosso trabalho: desde escrever código até implantar infraestrutura, desde lidar com dados até comunicar com clientes.",
          "Nossa abordagem de segurança é construída sobre princípios padrão da indústria e evolui continuamente para enfrentar ameaças e tecnologias emergentes."
        ]
      },
      {
        icon: "server",
        title: "Segurança da Infraestrutura",
        content: [
          "Utilizamos infraestrutura de nuvem moderna fornecida por provedores respeitáveis com históricos de segurança comprovados. Nossas práticas de infraestrutura incluem:",
          "• Transmissão de dados criptografada usando protocolos HTTPS/TLS",
          "• Sistemas de autenticação segura e controle de acesso",
          "• Atualizações de segurança regulares e gerenciamento de patches",
          "• Isolamento de rede e proteção por firewall",
          "• Sistemas de backup automatizados com criptografia em repouso",
          "• Monitoramento e registro de eventos de segurança",
          "Para projetos de clientes, projetamos e implementamos infraestrutura adaptada a requisitos de segurança específicos, necessidades de conformidade e perfis de risco."
        ]
      },
      {
        icon: "lock",
        title: "Segurança de Aplicações",
        content: [
          "A segurança é integrada em cada fase do nosso processo de desenvolvimento de software:",
          "Práticas de Desenvolvimento:",
          "• Padrões de codificação segura e revisões de código",
          "• Validação e sanitização de entradas",
          "• Proteção contra vulnerabilidades comuns (injeção SQL, XSS, CSRF, etc.)",
          "• Autenticação segura e gerenciamento de sessão",
          "• Tratamento adequado de erros sem expor informações sensíveis",
          "Testes e Validação:",
          "• Testes de segurança durante o desenvolvimento",
          "• Varredura de dependências para vulnerabilidades conhecidas",
          "• Atualizações regulares de bibliotecas e frameworks",
          "Implantação:",
          "• Pipelines de implantação seguras",
          "• Separação de ambientes (desenvolvimento, staging, produção)",
          "• Gerenciamento de segredos e segurança de configuração"
        ]
      },
      {
        icon: "database",
        title: "Proteção de Dados",
        content: [
          "Implementamos medidas apropriadas para proteger a confidencialidade, integridade e disponibilidade dos dados:",
          "• Criptografia de dados sensíveis em trânsito e em repouso",
          "• Controles de acesso baseados no princípio do menor privilégio",
          "• Procedimentos de backup de dados e recuperação de desastres",
          "• Descarte seguro de dados quando não são mais necessários",
          "• Conformidade com regulamentações aplicáveis de proteção de dados",
          "Para nosso site, coletamos informações pessoais mínimas (principalmente através de formulários de contato) e as tratamos de acordo com nossa Política de Privacidade.",
          "Para projetos de clientes, as medidas de proteção de dados são adaptadas aos requisitos específicos, nível de sensibilidade e obrigações regulatórias de cada projeto."
        ]
      },
      {
        icon: "users",
        title: "Controle de Acesso e Autenticação",
        content: [
          "Empregamos mecanismos robustos de controle de acesso:",
          "• Requisitos de autenticação forte",
          "• Autenticação multifator quando apropriado",
          "• Controle de acesso baseado em função (RBAC)",
          "• Revisão e auditoria regular de permissões de acesso",
          "• Armazenamento e gerenciamento seguros de credenciais",
          "• Segurança de sessão e políticas de timeout",
          "Para sistemas que construímos e operamos, os mecanismos de autenticação e autorização são projetados de acordo com requisitos de segurança e melhores práticas da indústria."
        ]
      },
      {
        icon: "monitor",
        title: "Monitoramento e Resposta a Incidentes",
        content: [
          "Mantemos visibilidade sobre nossos sistemas e respondemos prontamente a preocupações de segurança:",
          "• Monitoramento contínuo de infraestrutura e aplicações",
          "• Alertas automatizados para atividades suspeitas",
          "• Revisão regular de logs de segurança",
          "• Procedimentos de resposta a incidentes",
          "• Análise pós-incidente e melhoria",
          "Embora nos esforcemos para prevenir incidentes de segurança, reconhecemos que detecção e resposta rápidas são componentes críticos de uma postura de segurança abrangente."
        ]
      },
      {
        icon: "update",
        title: "Atualizações de Segurança e Manutenção",
        content: [
          "A tecnologia evolui, e as ameaças de segurança também. Mantemos a segurança através de:",
          "• Atualizações de segurança e patches regulares",
          "• Monitoramento de vulnerabilidades em dependências",
          "• Manter-se informado sobre ameaças emergentes e melhores práticas de segurança",
          "• Revisões e melhorias periódicas de segurança",
          "• Atualização de políticas e procedimentos de segurança conforme necessário",
          "Para plataformas que operamos e mantemos para clientes, fornecemos manutenção de segurança contínua como parte de nossos acordos de serviço."
        ]
      },
      {
        icon: "alert",
        title: "Divulgação Responsável",
        content: [
          "Valorizamos a comunidade de pesquisa de segurança e acolhemos a divulgação responsável de potenciais vulnerabilidades de segurança.",
          "Se você descobrir um problema de segurança em nosso site ou sistemas, por favor, reporte-o de forma responsável:",
          "• Email: security@revosso.com",
          "• Forneça informações detalhadas sobre a vulnerabilidade",
          "• Permita tempo razoável para investigarmos e resolvermos o problema antes da divulgação pública",
          "• Não acesse ou modifique dados que não pertencem a você",
          "• Não realize testes destrutivos",
          "Comprometemo-nos a:",
          "• Confirmar o recebimento do seu relatório prontamente",
          "• Mantê-lo informado sobre nossa investigação e remediação",
          "• Tratá-lo de forma justa e com respeito",
          "• Creditá-lo pela descoberta se desejar (ou permanecer anônimo)",
          "Atualmente não temos um programa formal de recompensas por bugs, mas apreciamos profundamente a pesquisa de segurança responsável que nos ajuda a melhorar nossa postura de segurança."
        ]
      },
      {
        icon: "compliance",
        title: "Conformidade e Padrões",
        content: [
          "Embora sejamos uma empresa de engenharia de software e não estejamos sujeitos a certificações específicas do setor, seguimos padrões e melhores práticas de segurança reconhecidos:",
          "• Diretrizes OWASP para segurança de aplicações",
          "• Protocolos de criptografia padrão da indústria",
          "• Princípios de proteção de dados alinhados com LGPD, GDPR e regulamentações similares",
          "• Práticas de ciclo de vida de desenvolvimento seguro",
          "Para projetos de clientes com requisitos de conformidade específicos (por exemplo, regulamentações financeiras, padrões de saúde ou leis de proteção de dados), projetamos e implementamos soluções que atendem a esses requisitos."
        ]
      },
      {
        icon: "team",
        title: "Conscientização de Segurança da Equipe",
        content: [
          "A segurança é uma responsabilidade da equipe. Fomentamos uma cultura consciente de segurança através de:",
          "• Treinamento contínuo e conscientização sobre segurança",
          "• Práticas e diretrizes de desenvolvimento seguro",
          "• Processos de revisão de código que incluem considerações de segurança",
          "• Políticas e procedimentos de segurança claros",
          "• Manuseio seguro de credenciais e informações sensíveis",
          "Cada membro da equipe entende seu papel na manutenção da segurança e proteção de dados de clientes."
        ]
      },
      {
        icon: "limitations",
        title: "Limitações de Segurança",
        content: [
          "Estamos comprometidos em manter uma segurança forte, mas também acreditamos em transparência:",
          "• Nenhum sistema está completamente imune a ameaças de segurança",
          "• Segurança é um processo contínuo, não uma conquista única",
          "• Novas vulnerabilidades e vetores de ataque emergem regularmente",
          "• Erro humano nunca pode ser completamente eliminado",
          "Trabalhamos continuamente para minimizar riscos de segurança, mas não podemos garantir segurança absoluta. O que podemos prometer é:",
          "• Compromisso contínuo com as melhores práticas de segurança",
          "• Resposta rápida a vulnerabilidades identificadas",
          "• Transparência sobre incidentes de segurança que possam afetá-lo",
          "• Melhoria contínua de nossa postura de segurança"
        ]
      },
      {
        icon: "contact",
        title: "Entre em Contato",
        content: [
          "Para consultas relacionadas à segurança, relatórios de vulnerabilidade ou perguntas sobre nossas práticas de segurança:",
          "Problemas de segurança: security@revosso.com",
          "Contato geral: contact@revosso.com",
          "Questões de privacidade: privacy@revosso.com",
          "Levamos a segurança a sério e responderemos a preocupações de segurança legítimas o mais rápido possível."
        ]
      }
    ]
  },
  es: {
    title: "Seguridad",
    subtitle: "Nuestro compromiso de proteger su información e infraestructura",
    backToHome: "Volver al Inicio",
    sections: [
      {
        icon: "shield",
        title: "Nuestro Enfoque de Seguridad",
        content: [
          "En Revosso, la seguridad es fundamental en todo lo que hacemos. Como empresa de ingeniería de software que construye, opera y mantiene plataformas empresariales críticas, entendemos que la seguridad no es opcional—es esencial.",
          "Aplicamos las mejores prácticas de seguridad en todos los aspectos de nuestro trabajo: desde escribir código hasta implementar infraestructura, desde manejar datos hasta comunicarnos con los clientes.",
          "Nuestro enfoque de seguridad se basa en principios estándar de la industria y evoluciona continuamente para abordar amenazas y tecnologías emergentes."
        ]
      },
      {
        icon: "server",
        title: "Seguridad de la Infraestructura",
        content: [
          "Aprovechamos infraestructura de nube moderna proporcionada por proveedores de renombre con historial de seguridad probado. Nuestras prácticas de infraestructura incluyen:",
          "• Transmisión de datos cifrada utilizando protocolos HTTPS/TLS",
          "• Sistemas de autenticación segura y control de acceso",
          "• Actualizaciones de seguridad regulares y gestión de parches",
          "• Aislamiento de red y protección de firewall",
          "• Sistemas de respaldo automatizados con cifrado en reposo",
          "• Monitoreo y registro de eventos de seguridad",
          "Para proyectos de clientes, diseñamos e implementamos infraestructura adaptada a requisitos de seguridad específicos, necesidades de cumplimiento y perfiles de riesgo."
        ]
      },
      {
        icon: "lock",
        title: "Seguridad de Aplicaciones",
        content: [
          "La seguridad se integra en cada fase de nuestro proceso de desarrollo de software:",
          "Prácticas de Desarrollo:",
          "• Estándares de codificación segura y revisiones de código",
          "• Validación y sanitización de entradas",
          "• Protección contra vulnerabilidades comunes (inyección SQL, XSS, CSRF, etc.)",
          "• Autenticación segura y gestión de sesiones",
          "• Manejo apropiado de errores sin exponer información sensible",
          "Pruebas y Validación:",
          "• Pruebas de seguridad durante el desarrollo",
          "• Escaneo de dependencias para vulnerabilidades conocidas",
          "• Actualizaciones regulares de bibliotecas y frameworks",
          "Implementación:",
          "• Pipelines de implementación seguras",
          "• Separación de entornos (desarrollo, staging, producción)",
          "• Gestión de secretos y seguridad de configuración"
        ]
      },
      {
        icon: "database",
        title: "Protección de Datos",
        content: [
          "Implementamos medidas apropiadas para proteger la confidencialidad, integridad y disponibilidad de los datos:",
          "• Cifrado de datos sensibles en tránsito y en reposo",
          "• Controles de acceso basados en el principio de menor privilegio",
          "• Procedimientos de respaldo de datos y recuperación ante desastres",
          "• Eliminación segura de datos cuando ya no son necesarios",
          "• Cumplimiento de regulaciones aplicables de protección de datos",
          "Para nuestro sitio web, recopilamos información personal mínima (principalmente a través de formularios de contacto) y la manejamos según nuestra Política de Privacidad.",
          "Para proyectos de clientes, las medidas de protección de datos se adaptan a los requisitos específicos, nivel de sensibilidad y obligaciones regulatorias de cada proyecto."
        ]
      },
      {
        icon: "users",
        title: "Control de Acceso y Autenticación",
        content: [
          "Empleamos mecanismos robustos de control de acceso:",
          "• Requisitos de autenticación fuerte",
          "• Autenticación multifactor cuando sea apropiado",
          "• Control de acceso basado en roles (RBAC)",
          "• Revisión y auditoría regular de permisos de acceso",
          "• Almacenamiento y gestión seguros de credenciales",
          "• Seguridad de sesión y políticas de timeout",
          "Para los sistemas que construimos y operamos, los mecanismos de autenticación y autorización se diseñan según los requisitos de seguridad y las mejores prácticas de la industria."
        ]
      },
      {
        icon: "monitor",
        title: "Monitoreo y Respuesta a Incidentes",
        content: [
          "Mantenemos visibilidad en nuestros sistemas y respondemos rápidamente a preocupaciones de seguridad:",
          "• Monitoreo continuo de infraestructura y aplicaciones",
          "• Alertas automatizadas para actividades sospechosas",
          "• Revisión regular de registros de seguridad",
          "• Procedimientos de respuesta a incidentes",
          "• Análisis post-incidente y mejora",
          "Si bien nos esforzamos por prevenir incidentes de seguridad, reconocemos que la detección y respuesta rápidas son componentes críticos de una postura de seguridad integral."
        ]
      },
      {
        icon: "update",
        title: "Actualizaciones de Seguridad y Mantenimiento",
        content: [
          "La tecnología evoluciona, y las amenazas de seguridad también. Mantenemos la seguridad a través de:",
          "• Actualizaciones de seguridad y parches regulares",
          "• Monitoreo de vulnerabilidades en dependencias",
          "• Mantenerse informado sobre amenazas emergentes y mejores prácticas de seguridad",
          "• Revisiones y mejoras periódicas de seguridad",
          "• Actualización de políticas y procedimientos de seguridad según sea necesario",
          "Para plataformas que operamos y mantenemos para clientes, proporcionamos mantenimiento de seguridad continuo como parte de nuestros acuerdos de servicio."
        ]
      },
      {
        icon: "alert",
        title: "Divulgación Responsable",
        content: [
          "Valoramos la comunidad de investigación de seguridad y damos la bienvenida a la divulgación responsable de potenciales vulnerabilidades de seguridad.",
          "Si descubre un problema de seguridad en nuestro sitio web o sistemas, por favor repórtelo de manera responsable:",
          "• Email: security@revosso.com",
          "• Proporcione información detallada sobre la vulnerabilidad",
          "• Permita tiempo razonable para investigar y abordar el problema antes de la divulgación pública",
          "• No acceda o modifique datos que no le pertenecen",
          "• No realice pruebas destructivas",
          "Nos comprometemos a:",
          "• Confirmar la recepción de su informe rápidamente",
          "• Mantenerlo informado sobre nuestra investigación y remediación",
          "• Tratarlo con justicia y respeto",
          "• Acreditarlo por el descubrimiento si lo desea (o permanecer anónimo)",
          "Actualmente no tenemos un programa formal de recompensas por bugs, pero apreciamos profundamente la investigación de seguridad responsable que nos ayuda a mejorar nuestra postura de seguridad."
        ]
      },
      {
        icon: "compliance",
        title: "Cumplimiento y Estándares",
        content: [
          "Si bien somos una empresa de ingeniería de software y no estamos sujetos a certificaciones específicas de la industria, seguimos estándares y mejores prácticas de seguridad reconocidos:",
          "• Directrices OWASP para seguridad de aplicaciones",
          "• Protocolos de cifrado estándar de la industria",
          "• Principios de protección de datos alineados con GDPR y regulaciones similares",
          "• Prácticas de ciclo de vida de desarrollo seguro",
          "Para proyectos de clientes con requisitos de cumplimiento específicos (por ejemplo, regulaciones financieras, estándares de salud o leyes de protección de datos), diseñamos e implementamos soluciones que cumplan con esos requisitos."
        ]
      },
      {
        icon: "team",
        title: "Concienciación de Seguridad del Equipo",
        content: [
          "La seguridad es una responsabilidad del equipo. Fomentamos una cultura consciente de la seguridad a través de:",
          "• Capacitación continua y concienciación sobre seguridad",
          "• Prácticas y directrices de desarrollo seguro",
          "• Procesos de revisión de código que incluyen consideraciones de seguridad",
          "• Políticas y procedimientos de seguridad claros",
          "• Manejo seguro de credenciales e información sensible",
          "Cada miembro del equipo entiende su papel en mantener la seguridad y proteger los datos de los clientes."
        ]
      },
      {
        icon: "limitations",
        title: "Limitaciones de Seguridad",
        content: [
          "Estamos comprometidos a mantener una seguridad sólida, pero también creemos en la transparencia:",
          "• Ningún sistema es completamente inmune a amenazas de seguridad",
          "• La seguridad es un proceso continuo, no un logro único",
          "• Nuevas vulnerabilidades y vectores de ataque emergen regularmente",
          "• El error humano nunca puede ser completamente eliminado",
          "Trabajamos continuamente para minimizar los riesgos de seguridad, pero no podemos garantizar seguridad absoluta. Lo que sí podemos prometer es:",
          "• Compromiso continuo con las mejores prácticas de seguridad",
          "• Respuesta rápida a vulnerabilidades identificadas",
          "• Transparencia sobre incidentes de seguridad que puedan afectarlo",
          "• Mejora continua de nuestra postura de seguridad"
        ]
      },
      {
        icon: "contact",
        title: "Contáctenos",
        content: [
          "Para consultas relacionadas con seguridad, informes de vulnerabilidad o preguntas sobre nuestras prácticas de seguridad:",
          "Problemas de seguridad: security@revosso.com",
          "Contacto general: contact@revosso.com",
          "Preguntas de privacidad: privacy@revosso.com",
          "Tomamos la seguridad en serio y responderemos a preocupaciones de seguridad legítimas lo más rápido posible."
        ]
      }
    ]
  }
}

export default function SecurityPage() {
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
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-xl text-slate-400">
                {t.subtitle}
              </p>
            </div>

            {t.sections.map((section, index) => (
              <section key={index} className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                  {section.icon === "shield" && <Shield className="h-6 w-6 text-blue-400" />}
                  {section.icon === "lock" && <Lock className="h-6 w-6 text-blue-400" />}
                  {section.icon === "server" && <Server className="h-6 w-6 text-blue-400" />}
                  {section.icon === "alert" && <AlertTriangle className="h-6 w-6 text-blue-400" />}
                  {section.title}
                </h2>
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
