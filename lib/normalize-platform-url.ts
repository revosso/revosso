/** Ensure a usable absolute URL for links (adds https:// when no scheme). */
export function normalizePlatformUrl(raw: string): string {
  const t = raw.trim()
  if (!t) throw new Error("URL is empty")
  const withProto = /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t}`
  void new URL(withProto)
  return withProto
}
