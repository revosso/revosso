import Link from "next/link"
import { Code, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Privacy Policy — Revosso",
  description: "How Revosso collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
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
            <h1 className="text-4xl lg:text-5xl font-bold text-white">Privacy Policy</h1>
            <p className="text-slate-400 text-sm">Last updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-invert prose-slate max-w-none space-y-10 text-slate-300 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
              <p>
                Revosso (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit our website
                at revosso.com or contact us through our platform.
              </p>
              <p>
                By using our website, you agree to the collection and use of information in accordance with this
                policy. If you do not agree with the terms of this policy, please do not access the site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">2. Information We Collect</h2>
              <h3 className="text-lg font-medium text-slate-200">2.1 Information You Provide</h3>
              <p>When you contact us through our contact form, we collect:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Company name (optional)</li>
                <li>Project description or message</li>
                <li>Area of interest (e.g., new platform, infrastructure, partnership)</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-200 mt-6">2.2 Information Collected Automatically</h3>
              <p>When you visit our website, we automatically collect certain technical information:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                <li>IP address (anonymized for analytics purposes)</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Referring URL</li>
                <li>Browser language preference</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                <li>Respond to your inquiries and project requests</li>
                <li>Send confirmation emails acknowledging receipt of your message</li>
                <li>Understand how visitors interact with our website to improve our services</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraudulent or abusive use of our services</li>
              </ul>
              <p>
                We do not use your personal information for marketing or advertising purposes without your explicit
                consent. We do not sell, rent, or trade your personal information to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">4. Data Retention</h2>
              <p>
                We retain contact form submissions and related lead information for up to 24 months from the date
                of submission, or until you request deletion, whichever is earlier. Anonymous visitor analytics
                data is retained for up to 12 months.
              </p>
              <p>
                You may request deletion of your personal data at any time by contacting us at{" "}
                <a href="mailto:contact@revosso.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  contact@revosso.com
                </a>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security reviews of our infrastructure</li>
                <li>Limited access to personal data on a need-to-know basis</li>
              </ul>
              <p>
                However, no method of transmission over the internet or electronic storage is 100% secure. While
                we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute
                security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">6. Third-Party Services</h2>
              <p>We use the following third-party services that may process your data:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                <li><strong className="text-slate-200">Vercel</strong> — hosting and infrastructure</li>
                <li><strong className="text-slate-200">Turso</strong> — database storage</li>
                <li><strong className="text-slate-200">Auth0</strong> — authentication for internal admin access</li>
                <li><strong className="text-slate-200">Vercel Analytics</strong> — anonymized website traffic analytics</li>
              </ul>
              <p>
                Each of these providers has their own privacy policies governing their use of data. We encourage
                you to review their respective policies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">7. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                <li><strong className="text-slate-200">Access</strong> — request a copy of the personal data we hold about you</li>
                <li><strong className="text-slate-200">Rectification</strong> — request correction of inaccurate data</li>
                <li><strong className="text-slate-200">Erasure</strong> — request deletion of your personal data</li>
                <li><strong className="text-slate-200">Portability</strong> — request your data in a structured, machine-readable format</li>
                <li><strong className="text-slate-200">Objection</strong> — object to certain types of data processing</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at{" "}
                <a href="mailto:contact@revosso.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  contact@revosso.com
                </a>. We will respond to your request within 30 days.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">8. Cookies</h2>
              <p>
                We use cookies and similar tracking technologies. For details on the cookies we use and how to
                manage your preferences, please see our{" "}
                <Link href="/cookies" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Cookie Policy
                </Link>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any significant changes
                by updating the &ldquo;Last updated&rdquo; date at the top of this page. Your continued use of our website
                after any changes constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
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
