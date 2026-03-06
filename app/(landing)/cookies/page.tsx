import Link from "next/link"
import { Code, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Cookie Policy — Revosso",
  description: "How Revosso uses cookies and similar technologies on its website.",
}

export default function CookiesPage() {
  const lastUpdated = "March 2026"

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
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
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-300 hover:text-blue-400 font-medium transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-16 lg:py-24">
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white">Cookie Policy</h1>
            <p className="text-slate-400 text-sm">Last updated: {lastUpdated}</p>
          </div>

          <div className="space-y-10 text-slate-300 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are
                widely used to make websites work efficiently and to provide reporting information to site owners.
                Cookies can be &ldquo;persistent&rdquo; (remaining on your device for a set period) or &ldquo;session&rdquo; cookies
                (deleted when you close your browser).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">2. Cookies We Use</h2>

              <h3 className="text-lg font-medium text-slate-200">2.1 Strictly Necessary Cookies</h3>
              <p>
                These cookies are essential for the website to function and cannot be switched off. They are
                typically set in response to actions you take, such as submitting a form.
              </p>
              <div className="bg-slate-800/50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 text-slate-200 font-medium">Cookie</th>
                      <th className="text-left p-4 text-slate-200 font-medium">Purpose</th>
                      <th className="text-left p-4 text-slate-200 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    <tr>
                      <td className="p-4 font-mono text-blue-300">__Host-next-auth</td>
                      <td className="p-4">Session management for authenticated admin users</td>
                      <td className="p-4">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-medium text-slate-200 mt-6">2.2 Analytics Cookies</h3>
              <p>
                We use Vercel Analytics to understand how visitors interact with our website. This service
                collects anonymized, aggregated data and does not track individual visitors across sites.
              </p>
              <div className="bg-slate-800/50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 text-slate-200 font-medium">Service</th>
                      <th className="text-left p-4 text-slate-200 font-medium">Purpose</th>
                      <th className="text-left p-4 text-slate-200 font-medium">Privacy Policy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4">Vercel Analytics</td>
                      <td className="p-4">Anonymized page view analytics</td>
                      <td className="p-4">
                        <a
                          href="https://vercel.com/legal/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          vercel.com/legal/privacy-policy
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">3. Cookies We Do Not Use</h2>
              <p>Revosso does not use:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Advertising or targeting cookies</li>
                <li>Third-party social media cookies</li>
                <li>Persistent tracking cookies for individual visitor profiling</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">4. Managing Your Cookie Preferences</h2>
              <p>
                Most web browsers allow you to control cookies through their settings. You can set your browser
                to refuse cookies, or to alert you when cookies are being sent. However, disabling strictly
                necessary cookies may affect the functionality of the Site.
              </p>
              <p>Common browser cookie controls:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong className="text-slate-200">Chrome:</strong> Settings → Privacy and Security → Cookies
                </li>
                <li>
                  <strong className="text-slate-200">Firefox:</strong> Options → Privacy &amp; Security → Cookies and Site Data
                </li>
                <li>
                  <strong className="text-slate-200">Safari:</strong> Preferences → Privacy → Cookies
                </li>
                <li>
                  <strong className="text-slate-200">Edge:</strong> Settings → Cookies and site permissions
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">5. Changes to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, regulation,
                or our practices. We will update the &ldquo;Last updated&rdquo; date at the top of this page when changes
                are made.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">6. Contact</h2>
              <p>
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="bg-slate-800/50 rounded-xl p-6 space-y-2 text-sm">
                <p className="font-semibold text-white">Revosso</p>
                <p>
                  Email:{" "}
                  <a href="mailto:contact@revosso.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    contact@revosso.com
                  </a>
                </p>
                <p>Website: <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">revosso.com</Link></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Revosso. All rights reserved.</p>
          <div className="flex gap-4 text-slate-400 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span>·</span>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            <span>·</span>
            <Link href="/security" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
