import Link from "next/link"
import { Code, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Terms of Service — Revosso",
  description: "Terms and conditions governing the use of Revosso's website and services.",
}

export default function TermsPage() {
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
            <h1 className="text-4xl lg:text-5xl font-bold text-white">Terms of Service</h1>
            <p className="text-slate-400 text-sm">Last updated: {lastUpdated}</p>
          </div>

          <div className="space-y-10 text-slate-300 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Revosso website at revosso.com (&ldquo;the Site&rdquo;), you agree to be bound
                by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not use
                the Site.
              </p>
              <p>
                These Terms apply to all visitors, users, and others who access or use the Site. Revosso reserves
                the right to modify these Terms at any time. Continued use of the Site after any modifications
                constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">2. Services</h2>
              <p>
                Revosso provides digital infrastructure and platform engineering services, including custom
                software development, platform modernization, and infrastructure operations. The Site serves as
                an informational and lead-generation resource for prospective clients.
              </p>
              <p>
                Engagement of Revosso&rsquo;s professional services is governed by separate service agreements entered
                into between Revosso and the client. These Terms do not constitute or create any obligation on
                Revosso to provide any services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">3. Intellectual Property</h2>
              <p>
                All content on the Site, including but not limited to text, graphics, logos, images, and software,
                is the property of Revosso and is protected by applicable intellectual property laws. You may not
                reproduce, distribute, modify, or create derivative works of any Site content without prior written
                permission from Revosso.
              </p>
              <p>
                The Revosso name, logo, and all related marks are trademarks of Revosso. Nothing in these Terms
                grants you a license to use any trademark displayed on the Site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">4. Use of the Site</h2>
              <p>You agree to use the Site only for lawful purposes. You must not:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the Site in any way that violates applicable local, national, or international law</li>
                <li>Transmit any unsolicited or unauthorized advertising or promotional material</li>
                <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
                <li>Transmit any data containing viruses, trojans, or other malicious code</li>
                <li>Use automated tools to scrape or harvest data from the Site without prior consent</li>
                <li>Submit false or misleading information through the contact form</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">5. Contact Form Submissions</h2>
              <p>
                When you submit information through our contact form, you confirm that the information provided
                is accurate and that you are authorized to make the inquiry on behalf of any organization you
                represent. Revosso will use this information solely to respond to your inquiry in accordance
                with our{" "}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </Link>.
              </p>
              <p>
                Submission of a contact form does not create any contractual relationship between you and Revosso
                or any obligation by Revosso to respond or provide services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">6. Disclaimer of Warranties</h2>
              <p>
                The Site and its content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without any
                warranties of any kind, either express or implied, including but not limited to warranties of
                merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p>
                Revosso does not warrant that the Site will be uninterrupted, error-free, or free of viruses
                or other harmful components.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">7. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, Revosso shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages arising from your use of or inability
                to use the Site, even if Revosso has been advised of the possibility of such damages.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">8. Third-Party Links</h2>
              <p>
                The Site may contain links to third-party websites. These links are provided for convenience
                only. Revosso has no control over the content of those sites and accepts no responsibility for
                them or for any loss or damage that may arise from your use of them.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable law. Any disputes
                arising from these Terms or your use of the Site shall be subject to the exclusive jurisdiction
                of competent courts.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">10. Contact</h2>
              <p>
                If you have questions about these Terms, please contact us:
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
