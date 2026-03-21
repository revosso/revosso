import { settingsRepository } from "@/lib/repositories/control-settings"

export const settingsService = {
  getLocale: () => settingsRepository.get("app.locale", "en"),
  setLocale: (locale: string) => settingsRepository.set("app.locale", locale),
  all: () => settingsRepository.all(),
}
