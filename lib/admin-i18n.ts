/** Matches Control → Settings / DB `app.locale` */
export type AdminLocaleCode = "en" | "fr" | "pt"

export function normalizeAdminLocale(raw: string | null | undefined): AdminLocaleCode {
  if (raw === "fr" || raw === "pt") return raw
  return "en"
}

export type AdminStrings = {
  navLeads: string
  navDashboard: string
  navProjects: string
  navIncomes: string
  navExpenses: string
  navDebts: string
  navServices: string
  navSettings: string
  sectionCrm: string
  sectionControl: string
  backToSite: string
  logoutTitle: string
  brandAdmin: string
  settingsTitle: string
  settingsCardTitle: string
  settingsLocaleLabel: string
  settingsHelp: string
  settingsSave: string
  settingsSaving: string
  settingsSaved: string
}

export const adminTranslations: Record<AdminLocaleCode, AdminStrings> = {
  en: {
    navLeads: "Leads",
    navDashboard: "Dashboard",
    navProjects: "Projects",
    navIncomes: "Incomes",
    navExpenses: "Expenses",
    navDebts: "Debts",
    navServices: "Services",
    navSettings: "Settings",
    sectionCrm: "CRM",
    sectionControl: "Control",
    backToSite: "Back to site",
    logoutTitle: "Logout",
    brandAdmin: "Admin",
    settingsTitle: "Settings",
    settingsCardTitle: "System language",
    settingsLocaleLabel: "Default locale (app.locale)",
    settingsHelp:
      'Stored as "app.locale" in the database. The public site uses this via /api/locale when visitors have not chosen a language in the header (no revosso-locale in the browser). The admin dashboard uses the same setting for its interface.',
    settingsSave: "Save settings",
    settingsSaving: "Saving…",
    settingsSaved: "Saved",
  },
  fr: {
    navLeads: "Prospects",
    navDashboard: "Tableau de bord",
    navProjects: "Projets",
    navIncomes: "Revenus",
    navExpenses: "Dépenses",
    navDebts: "Dettes",
    navServices: "Services",
    navSettings: "Paramètres",
    sectionCrm: "CRM",
    sectionControl: "Pilotage",
    backToSite: "Retour au site",
    logoutTitle: "Déconnexion",
    brandAdmin: "Admin",
    settingsTitle: "Paramètres",
    settingsCardTitle: "Langue du système",
    settingsLocaleLabel: "Langue par défaut (app.locale)",
    settingsHelp:
      'Enregistré sous « app.locale » dans la base. Le site public utilise cette valeur via /api/locale si le visiteur n’a pas choisi de langue dans l’en-tête. L’admin utilise le même réglage pour son interface.',
    settingsSave: "Enregistrer",
    settingsSaving: "Enregistrement…",
    settingsSaved: "Enregistré",
  },
  pt: {
    navLeads: "Leads",
    navDashboard: "Painel",
    navProjects: "Projetos",
    navIncomes: "Receitas",
    navExpenses: "Despesas",
    navDebts: "Dívidas",
    navServices: "Serviços",
    navSettings: "Configurações",
    sectionCrm: "CRM",
    sectionControl: "Controle",
    backToSite: "Voltar ao site",
    logoutTitle: "Sair",
    brandAdmin: "Admin",
    settingsTitle: "Configurações",
    settingsCardTitle: "Idioma do sistema",
    settingsLocaleLabel: "Idioma padrão (app.locale)",
    settingsHelp:
      'Gravado como "app.locale" na base de dados. O site público usa isso via /api/locale quando o visitante não escolheu idioma no cabeçalho. O painel admin usa a mesma configuração para a interface.',
    settingsSave: "Salvar configurações",
    settingsSaving: "Salvando…",
    settingsSaved: "Salvo",
  },
}
