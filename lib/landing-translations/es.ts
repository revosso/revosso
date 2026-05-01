/** Spanish — landing page marketing copy */
import type { LandingLocaleMessages } from "./types"

export const landingEs = {
  nav: {
    products: "Productos",
    approach: "Enfoque",
    services: "Servicios",
    industries: "Soluciones",
    contact: "Contacto",
  },
  hero: {
    h1: "Software a Medida, Ingeniería de Plataforma e Infraestructura Escalable",
    subheadline:
      "Desarrollamos plataformas de software a medida, modernizamos sistemas existentes y operamos infraestructura escalable para organizaciones que dependen de sistemas digitales confiables.",
    primaryCta: "Discutir Su Proyecto",
    secondaryCta: "Explorar Nuestro Enfoque",
  },
  whoWeAre: {
    title: "Infraestructura Digital. Construida para Escala.",
    intro:
      "Revosso es una empresa de ingeniería de infraestructura y plataformas digitales. Construimos y operamos sistemas de misión crítica y bases digitales de largo plazo para empresas y negocios orientados a producto.",
    partnerTitle: "Trabajamos con organizaciones que necesitan:",
    requirements: [
      "Arquitectura backend robusta",
      "Plataformas digitales de alto rendimiento",
      "Sistemas financieros y operativos seguros",
      "Escalabilidad técnica a largo plazo",
    ],
    closing: "No entregamos soluciones a corto plazo.\nIngeniamos bases digitales.",
  },
  platformLifecycle: {
    title: "De la Arquitectura a la Operación",
    subtitle:
      "Construimos nuevas plataformas desde cero, asumimos y optimizamos sistemas existentes, y operamos y escalamos su infraestructura.",
    build: {
      title: "CONSTRUIR",
      description:
        "Diseñamos y desarrollamos plataformas digitales a medida desde el inicio, alineadas con sus objetivos de negocio y crecimiento a largo plazo.",
    },
    takeOver: {
      title: "ASUMIR & OPTIMIZAR",
      intro: "Asumimos la gestión de plataformas y sistemas existentes para:",
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
      intro: "Operamos y escalamos su infraestructura y operaciones de plataforma, incluyendo:",
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
    title: "Nuestras Capacidades de Ingeniería",
    subtitle:
      "Desde la construcción de nuevos sistemas hasta la modernización de legados — cubrimos todo el espectro de la ingeniería de software a medida.",
    items: [
      {
        title: "Desarrollo de Software a Medida",
        description:
          "Diseñamos y desarrollamos plataformas, aplicaciones y sistemas digitales a medida desde el inicio — alineados con sus necesidades exactas y objetivos a largo plazo.",
      },
      {
        title: "Asunción & Modernización de Sistemas",
        description:
          "Tomamos la gestión de codebases existentes, los estabilizamos, eliminamos la deuda técnica y modernizamos la arquitectura para actualizar sistemas legados.",
      },
      {
        title: "Consultoría Técnica & Arquitectura",
        description:
          "Asesoramos sobre diseño de sistemas, selección de tecnologías y estrategia de escalabilidad — ayudándole a tomar las decisiones técnicas correctas antes y durante el desarrollo.",
      },
      {
        title: "Mantenimiento & Evolución a Largo Plazo",
        description:
          "Proporcionamos propiedad técnica continua de sus sistemas — monitoreo de rendimiento, mejoras iterativas y escalabilidad de su plataforma a medida que crece su negocio.",
      },
    ],
    cta: "Discutir Su Proyecto",
  },
  clients: {
    title: "Confiado por Empresas y Socios",
    copy: "Colaboramos con empresas y plataformas para ofrecer soluciones seguras, escalables y de alto rendimiento.",
  },
  finalCta: {
    title: "Construyamos la Infraestructura Detrás de Su Crecimiento",
    subtitle:
      "Comparta los requisitos de su proyecto y descubra cómo podemos diseñar soluciones escalables para su negocio.",
    trust:
      "Formamos asociaciones a largo plazo basadas en ingeniería estructurada, estabilidad operacional y evolución continua de la plataforma. Priorizamos claridad arquitectónica y propiedad técnica sobre soluciones rápidas.",
    scheduleButton: "Programar una reunión",
    button: "Contáctenos",
  },
  contact: {
    title: {
      default: "Contáctenos",
      newPlatform: "Desarrollo de Nueva Plataforma",
      takeover: "Asunción y Optimización de Plataforma",
      maintenance: "Mantenimiento de Plataforma",
      hosting: "Infraestructura y Alojamiento",
      partnership: "Consulta de Asociación",
    },
    description: "Cuéntenos sobre su proyecto. Respondemos en 24 horas.",
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
      takeover: "Asunción y Optimización de Plataforma",
      maintenance: "Mantenimiento de Plataforma",
      hosting: "Infraestructura y Alojamiento",
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
    description:
      "Infraestructura digital, ingeniería de plataforma y sistemas escalables para el crecimiento empresarial.",
    services: "Servicios",
    company: "Empresa",
    legal: "Legal",
    contact: "Contacto",
    links: {
      customPlatforms: "Plataformas a Medida",
      platformEngineering: "Ingeniería de Plataforma",
      infrastructure: "Infraestructura",
      ourApproach: "Nuestro Enfoque",
      industries: "Soluciones",
      contact: "Contacto",
      privacy: "Privacidad",
      terms: "Términos",
      cookies: "Cookies",
      security: "Seguridad",
    },
    copyright: "Todos los derechos reservados.",
  },
} satisfies LandingLocaleMessages
