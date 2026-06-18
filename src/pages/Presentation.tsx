import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LanguageToggle } from '../components/layout/LanguageToggle'
import { useLanguage } from '../context/LanguageContext'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Building2,
  Cpu,
  Factory,
  HardDrive,
  Link2,
  Lock,
  Radio,
  ShieldCheck,
  Thermometer,
  TrendingUp,
  WifiOff,
  Zap,
} from 'lucide-react'

const scadaProtocols = ['OPC-UA', 'Modbus TCP', 'IEC 61850', 'MQTT']

export function Presentation() {
  const { t } = useLanguage()

  const cybersecurityPillars = useMemo(
    () => [
      { icon: HardDrive, titleKey: 'landing.pillarOnPremiseTitle', descKey: 'landing.pillarOnPremiseDesc' },
      { icon: Lock, titleKey: 'landing.pillarSovereigntyTitle', descKey: 'landing.pillarSovereigntyDesc' },
      { icon: WifiOff, titleKey: 'landing.pillarOfflineTitle', descKey: 'landing.pillarOfflineDesc' },
    ],
    [],
  )

  const technicalCapabilities = useMemo(
    () => [
      { icon: Brain, titleKey: 'landing.edgeAiTitle', descKey: 'landing.edgeAiDesc' },
      { icon: Activity, titleKey: 'landing.observabilityTitle', descKey: 'landing.observabilityDesc' },
    ],
    [],
  )

  const scadaIntegrationFeatures = useMemo(
    () => [
      { icon: Link2, titleKey: 'landing.scadaFusionTitle', descKey: 'landing.scadaFusionDesc' },
      { icon: Radio, titleKey: 'landing.scadaConnectorsTitle', descKey: 'landing.scadaConnectorsDesc' },
      { icon: TrendingUp, titleKey: 'landing.scadaCurvesTitle', descKey: 'landing.scadaCurvesDesc' },
      { icon: AlertTriangle, titleKey: 'landing.scadaAlarmsTitle', descKey: 'landing.scadaAlarmsDesc' },
    ],
    [],
  )

  const useCases = useMemo(
    () => [
      { icon: Zap, titleKey: 'landing.useCaseGridTitle', descKey: 'landing.useCaseGridDesc' },
      { icon: Factory, titleKey: 'landing.useCaseEnergyTitle', descKey: 'landing.useCaseEnergyDesc' },
      { icon: Building2, titleKey: 'landing.useCaseCivilTitle', descKey: 'landing.useCaseCivilDesc' },
    ],
    [],
  )

  const scrollToDemo = () => {
    document.getElementById('solicitar-demo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-svh bg-(--color-landing-bg) text-(--color-text)">
      <header className="sticky top-0 z-10 border-b border-(--color-border) bg-white/90 backdrop-blur-sm">
        <div className="border-b border-(--color-border)/60 bg-(--color-accent-soft)/50">
          <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-5 py-2 text-center text-xs font-medium text-(--color-accent) md:justify-start md:px-10">
            <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span>{t('landing.privacyBanner')}</span>
          </p>
        </div>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--color-accent-soft) text-(--color-accent)">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-(--color-text-muted) uppercase">
                Drone Analytics
              </p>
              <p className="text-sm font-medium text-(--color-text)">{t('landing.platform')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link
              to="/login"
              className="rounded-lg border border-(--color-border) bg-white px-4 py-2 text-sm font-semibold text-(--color-text) transition-colors hover:border-(--color-accent) hover:text-(--color-accent)"
            >
              {t('nav.clientAccess')}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-(--color-border) bg-linear-to-b from-(--color-landing-hero) to-(--color-landing-bg)">
          <div className="mx-auto max-w-4xl px-5 py-16 text-center md:px-10 md:py-24">
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-(--color-accent) uppercase">
              {t('landing.criticalInfra')}
            </p>
            <h1 className="text-3xl leading-tight font-semibold tracking-tight text-(--color-text) md:text-[2.35rem] md:leading-[1.2]">
              {t('landing.heroTitle')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-(--color-text-muted) md:text-lg">
              {t('landing.heroSubtitle')}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-(--color-accent) md:text-base">
              {t('landing.heroTagline')}
            </p>
            <button
              type="button"
              onClick={scrollToDemo}
              className="mt-10 inline-flex items-center gap-2 rounded-lg bg-(--color-accent) px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--color-accent-hover)"
            >
              {t('landing.requestDemo')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="border-y border-(--color-border) bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-xs font-semibold tracking-[0.18em] text-(--color-accent) uppercase">
                {t('landing.cybersecurity')}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-(--color-text) md:text-[1.75rem]">
                {t('landing.privacyTitle')}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-(--color-text-muted) md:text-base">
                {t('landing.privacyIntro')}
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {cybersecurityPillars.map(({ icon: Icon, titleKey, descKey }) => (
                <article
                  key={titleKey}
                  className="rounded-xl border border-(--color-border) bg-(--color-surface) p-6 md:p-7"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-(--color-accent-soft) text-(--color-accent)">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-semibold text-(--color-text)">{t(titleKey)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-(--color-text-muted) md:text-[0.95rem]">
                    {t(descKey)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20">
          <article className="rounded-xl border border-(--color-border) bg-white p-7 shadow-sm md:p-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-(--color-accent-soft) text-(--color-accent)">
                <Cpu className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-(--color-accent) uppercase">
                  {t('landing.hardwareEcosystem')}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-(--color-text) md:text-2xl">
                  {t('landing.industrialIntegration')}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-(--color-text-muted) md:text-base">
                  {t('landing.industrialIntegrationDesc')}
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="border-y border-(--color-border) bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-(--color-accent) uppercase">
                {t('landing.technicalCapabilities')}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-(--color-text)">
                {t('landing.localProcessing')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-(--color-text-muted) md:text-base">
                {t('landing.localProcessingDesc')}
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {technicalCapabilities.map(({ icon: Icon, titleKey, descKey }) => (
                <article
                  key={titleKey}
                  className="rounded-xl border border-(--color-border) bg-(--color-surface) p-6 md:p-7"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-(--color-accent-soft) text-(--color-accent)">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-semibold text-(--color-text)">{t(titleKey)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-(--color-text-muted) md:text-[0.95rem]">
                    {t(descKey)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-(--color-border) bg-(--color-landing-bg)">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-xs font-semibold tracking-[0.18em] text-(--color-accent) uppercase">
                {t('scada.title')}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-(--color-text) md:text-[1.75rem]">
                {t('landing.scadaSectionTitle')}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-(--color-text-muted) md:text-base">
                {t('landing.scadaSectionDesc')}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {scadaProtocols.map((protocol) => (
                  <span
                    key={protocol}
                    className="rounded-full border border-(--color-border) bg-white px-3 py-1 text-xs font-medium text-(--color-text-muted)"
                  >
                    {protocol}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {scadaIntegrationFeatures.map(({ icon: Icon, titleKey, descKey }) => (
                <article
                  key={titleKey}
                  className="rounded-xl border border-(--color-border) bg-white p-6 md:p-7"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-(--color-accent-soft) text-(--color-accent)">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-semibold text-(--color-text)">{t(titleKey)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-(--color-text-muted) md:text-[0.95rem]">
                    {t(descKey)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-(--color-border) bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-(--color-accent) uppercase">
                {t('landing.useCases')}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-(--color-text)">
                {t('landing.useCasesTitle')}
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {useCases.map(({ icon: Icon, titleKey, descKey }) => (
                <article
                  key={titleKey}
                  className="rounded-xl border border-(--color-border) bg-(--color-surface) p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-(--color-accent-soft) text-(--color-accent)">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-base font-semibold text-(--color-text)">{t(titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-(--color-text-muted)">
                    {t(descKey)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="solicitar-demo"
          className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14 md:px-10 md:py-20"
        >
          <div className="rounded-2xl border border-(--color-border) bg-white px-6 py-10 text-center shadow-sm md:px-12 md:py-14">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-accent-soft) text-(--color-accent)">
              <Thermometer className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h2 className="text-2xl font-semibold text-(--color-text)">{t('landing.ctaTitle')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-(--color-text-muted) md:text-base">
              {t('landing.ctaDesc')}
            </p>
            <a
              href="mailto:eliseogelvis@gmail.com?subject=Solicitud%20de%20demostración"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-(--color-accent) px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-(--color-accent-hover)"
            >
              {t('landing.requestDemo')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-(--color-border) bg-white">
        <div className="border-b border-(--color-border) bg-(--color-accent-soft)/40">
          <p className="mx-auto max-w-6xl px-5 py-4 text-center text-sm font-medium text-(--color-text) md:px-10">
            {t('landing.footerHighlights')}
          </p>
        </div>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-(--color-text-muted) md:flex-row md:px-10">
          <p>
            © {new Date().getFullYear()} Drone Analytics. {t('landing.allRights')}
          </p>
          <p className="flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-(--color-accent)" strokeWidth={2} />
            {t('landing.footerPrivacy')}
          </p>
        </div>
      </footer>
    </div>
  )
}
