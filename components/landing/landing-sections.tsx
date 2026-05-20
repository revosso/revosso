"use client"

import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Code,
  Database,
  ExternalLink,
  Layers,
  Server,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DiscussProjectCtaButton } from "@/components/landing/discuss-project-cta-button"
import { clients } from "@/lib/landing-data"
import type { LandingLocaleMessages } from "@/lib/landing-translations/types"

type LandingSectionsProps = {
  copy: LandingLocaleMessages
  calendlyUrl: string
  onOpenContact: () => void
}

const sectionTitle = "text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white"
const bodyText = "text-slate-600 dark:text-slate-300"
const mutedText = "text-slate-500 dark:text-slate-400"
const featureCard =
  "border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-xl dark:border-0 dark:from-slate-800 dark:to-slate-900"
const outlineBtn =
  "border-2 border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-blue-400 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800/50 text-lg px-8 py-6 bg-transparent backdrop-blur-sm"

export function LandingSections({ copy, calendlyUrl, onOpenContact }: LandingSectionsProps) {
  return (
    <main className="flex-1">
      <section className="relative overflow-x-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center space-y-8 py-16 lg:py-24">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                {copy.hero.h1}
              </span>
            </h1>

            <p className={`text-xl sm:text-2xl lg:text-3xl leading-relaxed max-w-3xl mx-auto ${bodyText}`}>
              {copy.hero.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <DiscussProjectCtaButton
                calendlyUrl={calendlyUrl}
                onOpenContact={onOpenContact}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
              >
                {copy.hero.primaryCta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </DiscussProjectCtaButton>

              <Button size="lg" variant="outline" className={outlineBtn} onClick={() => document.getElementById("approach")?.scrollIntoView({ behavior: "smooth" })}>
                {copy.hero.secondaryCta}
                <ChevronDown className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="approach" className="py-20 lg:py-32 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className={sectionTitle}>{copy.whoWeAre.title}</h2>
            </div>

            <div className={`space-y-6 text-lg leading-relaxed ${bodyText}`}>
              <p>{copy.whoWeAre.intro}</p>
              <p className="font-medium text-slate-900 dark:text-white">{copy.whoWeAre.partnerTitle}</p>
              <ul className="space-y-3 list-none">
                {copy.whoWeAre.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
              <p className="pt-4 font-medium text-slate-900 dark:text-white whitespace-pre-line">{copy.whoWeAre.closing}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className={`${sectionTitle} mb-4`}>{copy.platformLifecycle.title}</h2>
            <p className={`text-xl max-w-3xl mx-auto ${bodyText}`}>{copy.platformLifecycle.subtitle}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              { icon: Layers, gradient: "from-blue-600 to-purple-600", ...copy.platformLifecycle.build, list: null as string[] | null },
              { icon: TrendingUp, gradient: "from-purple-600 to-pink-600", title: copy.platformLifecycle.takeOver.title, description: copy.platformLifecycle.takeOver.intro, list: copy.platformLifecycle.takeOver.items },
              { icon: Server, gradient: "from-green-600 to-emerald-600", title: copy.platformLifecycle.operate.title, description: copy.platformLifecycle.operate.intro, list: copy.platformLifecycle.operate.items },
            ].map((item, index) => (
              <Card key={index} className={featureCard}>
                <CardContent className="p-8 lg:p-10 space-y-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${item.gradient} shadow-lg`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className={`leading-relaxed text-lg ${bodyText}`}>{item.description}</p>
                    {item.list && (
                      <ul className={`space-y-2 ${bodyText}`}>
                        {item.list.map((listItem, listIndex) => (
                          <li key={listIndex} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                            <span>{listItem}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
              onClick={onOpenContact}
            >
              {copy.platformLifecycle.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className={`${sectionTitle} mb-4`}>{copy.howWeWork.title}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Layers, ...copy.howWeWork.principles[0] },
              { icon: TrendingUp, ...copy.howWeWork.principles[1] },
              { icon: Shield, ...copy.howWeWork.principles[2] },
              { icon: Code, ...copy.howWeWork.principles[3] },
              { icon: Zap, ...copy.howWeWork.principles[4] },
              { icon: Database, ...copy.howWeWork.principles[5] },
            ].map((principle, index) => (
              <Card key={index} className="border border-slate-200 bg-white shadow-lg dark:border-0 dark:bg-slate-800/50">
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                    <principle.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{principle.title}</h3>
                  <p className={bodyText}>{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <DiscussProjectCtaButton
              calendlyUrl={calendlyUrl}
              onOpenContact={onOpenContact}
              size="lg"
              variant="outline"
              className={outlineBtn}
            >
              {copy.hero.primaryCta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </DiscussProjectCtaButton>
          </div>
        </div>
      </section>

      <section id="solutions" className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className={`${sectionTitle} mb-4`}>{copy.industries.title}</h2>
            <p className={`text-lg max-w-2xl mx-auto mt-4 leading-relaxed ${mutedText}`}>{copy.industries.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Code, ...copy.industries.items[0] },
              { icon: TrendingUp, ...copy.industries.items[1] },
              { icon: Layers, ...copy.industries.items[2] },
              { icon: Server, ...copy.industries.items[3] },
            ].map((capability, index) => (
              <Card key={index} className={featureCard}>
                <CardContent className="p-8 space-y-4">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                    <capability.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{capability.title}</h3>
                  <p className={`leading-relaxed ${bodyText}`}>{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <DiscussProjectCtaButton
              calendlyUrl={calendlyUrl}
              onOpenContact={onOpenContact}
              size="lg"
              variant="outline"
              className={outlineBtn}
            >
              {copy.industries.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </DiscussProjectCtaButton>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className={`${sectionTitle} mb-4`}>{copy.clients.title}</h2>
            <p className={`text-xl max-w-3xl mx-auto ${bodyText}`}>{copy.clients.copy}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {clients.map((client, index) => (
              <a
                key={index}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700"
              >
                <div className="text-2xl lg:text-3xl font-bold text-slate-600 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white transition-colors duration-300 text-center">
                  {client.name}
                </div>
                <p className={`text-sm mt-3 text-center transition-colors duration-300 ${mutedText} group-hover:text-slate-600 dark:group-hover:text-slate-400`}>
                  {client.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">{copy.finalCta.title}</h2>
            <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl mx-auto">{copy.finalCta.subtitle}</p>
            <div className="max-w-2xl mx-auto space-y-4 pt-4">
              <p className="text-lg text-blue-100 leading-relaxed">{copy.finalCta.trust}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                onClick={onOpenContact}
              >
                {copy.finalCta.button}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {calendlyUrl ? (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/90 text-white bg-white/10 hover:bg-white/20 shadow-lg text-lg px-8 py-6 backdrop-blur-sm"
                >
                  <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                    {copy.finalCta.scheduleButton}
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
