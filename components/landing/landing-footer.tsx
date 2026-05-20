import Link from "next/link"
import { Code } from "lucide-react"
import type { LandingLocaleMessages } from "@/lib/landing-translations/types"

type LandingFooterProps = {
  copy: LandingLocaleMessages
  year: number
}

export function LandingFooter({ copy, year }: LandingFooterProps) {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white py-16 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                <Code className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                REVOSSO
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{copy.footer.description}</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              <a
                href="mailto:contact@revosso.com"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                contact@revosso.com
              </a>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{copy.footer.services}</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <Link href="#services" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {copy.footer.links.customPlatforms}
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {copy.footer.links.platformEngineering}
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {copy.footer.links.infrastructure}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{copy.footer.company}</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <Link href="#approach" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {copy.footer.links.ourApproach}
                </Link>
              </li>
              <li>
                <Link href="#solutions" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {copy.footer.links.industries}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {copy.footer.links.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{copy.footer.legal}</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {copy.footer.links.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {copy.footer.links.terms}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {copy.footer.links.cookies}
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {copy.footer.links.security}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center md:text-left">
            © {year} Revosso. {copy.footer.copyright}
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-slate-500 dark:text-slate-400 text-sm">
            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {copy.footer.links.privacy}
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {copy.footer.links.terms}
            </Link>
            <span>·</span>
            <Link href="/security" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {copy.footer.links.security}
            </Link>
            <span>·</span>
            <Link href="/cookies" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {copy.footer.links.cookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
