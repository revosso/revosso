import Link from "next/link"
import { Code, ArrowLeft, Shield, Lock, Server, Eye, AlertTriangle } from "lucide-react"

export const metadata = {
  title: "Security — Revosso",
  description: "Revosso's security practices, responsible disclosure policy, and infrastructure security overview.",
}

export default function SecurityPage() {
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
            <h1 className="text-4xl lg:text-5xl font-bold text-white">Security</h1>
            <p className="text-slate-400 text-sm">Last updated: {lastUpdated}</p>
            <p className="text-lg text-slate-300 leading-relaxed">
              Security is a foundational principle at Revosso — both in the systems we build for clients
              and in how we operate our own infrastructure. This page outlines our security practices and
              how to report potential vulnerabilities.
            </p>
          </div>

          {/* Security highlights */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {[
              {
                icon: Lock,
                title: "TLS Everywhere",
                description: "All data in transit is encrypted using TLS 1.2 or higher.",
              },
              {
                icon: Shield,
                title: "Auth0 Authentication",
                description: "Admin access is secured via Auth0 with PKCE flow and JWKS validation.",
              },
              {
                icon: Server,
                title: "Minimal Attack Surface",
                description: "API endpoints are protected with JWT validation and rate limiting.",
              },
              {
                icon: Eye,
                title: "Access Controls",
                description: "Role-based access control enforces least-privilege across all systems.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-xl p-6 space-y-3 border border-slate-700/50"
              >
                <div className="inline-flex p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-10 text-slate-300 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Platform Security Measures</h2>

              <h3 className="text-lg font-medium text-slate-200">Transport Security</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All connections enforced over HTTPS with TLS 1.2+</li>
                <li>HTTP Strict Transport Security (HSTS) enabled</li>
                <li>Secure headers configured on all responses</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-200 mt-6">Authentication &amp; Authorization</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Admin access protected by Auth0 with PKCE authorization flow</li>
                <li>Access tokens stored in memory only — never in localStorage or cookies</li>
                <li>Server-side JWT validation using Auth0 JWKS public keys</li>
                <li>Role-based access control with admin role enforcement via custom claims</li>
                <li>All admin API routes protected by server-side token validation</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-200 mt-6">API &amp; Input Security</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Input validation using Zod schemas on all API endpoints</li>
                <li>Rate limiting on public endpoints to prevent abuse</li>
                <li>Honeypot fields on contact forms to detect automated submissions</li>
                <li>Parameterized database queries via Drizzle ORM to prevent SQL injection</li>
              </ul>

              <h3 className="text-lg font-medium text-slate-200 mt-6">Infrastructure</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Hosted on Vercel with edge-level DDoS protection</li>
                <li>Database hosted on Turso with encrypted storage and access controls</li>
                <li>Environment variables and secrets managed through secure environment configuration</li>
                <li>No secrets committed to version control</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Responsible Disclosure Policy</h2>
              <p>
                We take security seriously. If you discover a potential security vulnerability in our website
                or systems, we encourage you to report it to us responsibly. We appreciate the efforts of
                security researchers and commit to working with you to understand and resolve the issue quickly.
              </p>

              <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-semibold text-white">To report a security vulnerability:</p>
                    <p className="text-slate-300">
                      Please email{" "}
                      <a
                        href="mailto:security@revosso.com"
                        className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                      >
                        security@revosso.com
                      </a>{" "}
                      with a detailed description of the issue, steps to reproduce, and any supporting
                      evidence. Please do not publicly disclose the vulnerability until we have had an
                      opportunity to investigate and address it.
                    </p>
                  </div>
                </div>
              </div>

              <p>When reporting, please include:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Description of the vulnerability and its potential impact</li>
                <li>Step-by-step instructions to reproduce the issue</li>
                <li>Any relevant screenshots, logs, or proof-of-concept code</li>
                <li>Your contact information for follow-up</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Our Commitments</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>We will acknowledge receipt of your report within 3 business days</li>
                <li>We will investigate and keep you informed of our progress</li>
                <li>We will not take legal action against researchers acting in good faith</li>
                <li>We will work to remediate confirmed vulnerabilities in a timely manner</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Scope</h2>
              <p>Our responsible disclosure program covers:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>revosso.com and all subdomains</li>
                <li>Public APIs operated by Revosso</li>
              </ul>
              <p className="mt-4">Out of scope:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Social engineering attacks targeting Revosso staff</li>
                <li>Physical security</li>
                <li>Denial of service attacks</li>
                <li>Third-party services and platforms not operated by Revosso</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Contact</h2>
              <div className="bg-slate-800/50 rounded-xl p-6 space-y-2 text-sm">
                <p className="font-semibold text-white">Revosso Security</p>
                <p>
                  Security reports:{" "}
                  <a href="mailto:security@revosso.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    security@revosso.com
                  </a>
                </p>
                <p>
                  General inquiries:{" "}
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
