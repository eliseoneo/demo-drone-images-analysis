import { Link } from 'react-router-dom'
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

const cybersecurityPillars = [
  {
    icon: HardDrive,
    title: 'Procesamiento 100% On-Premise',
    description:
      'El software opera completamente aislado dentro de sus propios servidores (intranet), evitando que gigabytes de información confidencial se suban a la nube.',
  },
  {
    icon: Lock,
    title: 'Soberanía absoluta de los datos',
    description:
      'La arquitectura cumple con las políticas de ciberseguridad más estrictas del sector, garantizando que el control de las imágenes y reportes siempre esté en manos de la empresa.',
  },
  {
    icon: WifiOff,
    title: 'Operación sin internet',
    description:
      'Tanto el procesamiento de la Inteligencia Artificial como las actualizaciones de la plataforma pueden funcionar en instalaciones remotas sin requerir una conexión web activa.',
  },
]

const technicalCapabilities = [
  {
    icon: Brain,
    title: 'Inteligencia Artificial en el Borde (Edge AI)',
    description:
      'Modelos de visión por computadora y algoritmos de decisión ejecutados 100% en servidores locales. Análisis de fotogramas en milisegundos sin depender de ancho de banda ni enviar imágenes a la nube.',
  },
  {
    icon: Activity,
    title: 'Observabilidad y Monitoreo Transparente',
    description:
      'Trazabilidad completa de cada vuelo. Monitoreo en tiempo real de la telemetría, salud del hardware, latencia de detección y rendimiento de los algoritmos para garantizar una operación segura e ininterrumpida.',
  },
]

const scadaIntegrationFeatures = [
  {
    icon: Link2,
    title: 'Fusión dron + telemetría SCADA',
    description:
      'Correlaciona evidencia visual de inspecciones aéreas con tags de sensores en tiempo casi real para detectar patrones de desgaste antes de que escalen a fallas operativas.',
  },
  {
    icon: Radio,
    title: 'Conectores industriales nativos',
    description:
      'Integración directa con OPC-UA, Modbus TCP, IEC 61850 y MQTT. Conecte subestaciones, historians y RTU de campo sin intermediarios en la nube.',
  },
  {
    icon: TrendingUp,
    title: 'Curvas de degradación y proyección',
    description:
      'Visualice la evolución de temperatura, vibración, corriente y otros señales críticas. Proyecte ventanas de mantenimiento con base en tendencias medidas y evidencia estructural.',
  },
  {
    icon: AlertTriangle,
    title: 'Alarmas tempranas y acciones preventivas',
    description:
      'Alertas de desgaste anticipado, mapas de riesgo estructural y recomendaciones de mantenimiento preventivo con trazabilidad completa dron + SCADA.',
  },
]

const scadaProtocols = ['OPC-UA', 'Modbus TCP', 'IEC 61850', 'MQTT']

const useCases = [
  {
    icon: Zap,
    title: 'Redes eléctricas',
    description: 'Inspección térmica de líneas de transmisión y subestaciones.',
  },
  {
    icon: Factory,
    title: 'Energía e industria',
    description:
      'Mantenimiento predictivo en refinerías, petróleo, gas y parques solares.',
  },
  {
    icon: Building2,
    title: 'Infraestructura civil',
    description: 'Seguimiento automatizado de obras e infraestructura civil.',
  },
]

export function Presentation() {
  const scrollToDemo = () => {
    document.getElementById('solicitar-demo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-svh bg-(--color-landing-bg) text-(--color-text)">
      <header className="sticky top-0 z-10 border-b border-(--color-border) bg-white/90 backdrop-blur-sm">
        <div className="border-b border-(--color-border)/60 bg-(--color-accent-soft)/50">
          <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-5 py-2 text-center text-xs font-medium text-(--color-accent) md:justify-start md:px-10">
            <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span>
              Privacidad de la información: sus datos operativos permanecen bajo su control, sin
              salir de su red.
            </span>
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
              <p className="text-sm font-medium text-(--color-text)">Plataforma On-Premise</p>
            </div>
          </div>
          <Link
            to="/login"
            className="rounded-lg border border-(--color-border) bg-white px-4 py-2 text-sm font-semibold text-(--color-text) transition-colors hover:border-(--color-accent) hover:text-(--color-accent)"
          >
            Acceso Clientes
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-(--color-border) bg-linear-to-b from-(--color-landing-hero) to-(--color-landing-bg)">
          <div className="mx-auto max-w-4xl px-5 py-16 text-center md:px-10 md:py-24">
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-(--color-accent) uppercase">
              Infraestructura crítica
            </p>
            <h1 className="text-3xl leading-tight font-semibold tracking-tight text-(--color-text) md:text-[2.35rem] md:leading-[1.2]">
              Automatización y Análisis de Drones 100% On-Premise para Infraestructura
              Crítica.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-(--color-text-muted) md:text-lg">
              Detecta anomalías térmicas y estructurales sin comprometer la ciberseguridad de
              tu empresa. Procesamiento de datos exclusivo en tu red local.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-(--color-accent) md:text-base">
              Resolvemos su mayor restricción operativa: la privacidad de la información.
            </p>
            <button
              type="button"
              onClick={scrollToDemo}
              className="mt-10 inline-flex items-center gap-2 rounded-lg bg-(--color-accent) px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--color-accent-hover)"
            >
              Solicitar Demostración
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="border-y border-(--color-border) bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-xs font-semibold tracking-[0.18em] text-(--color-accent) uppercase">
                Ciberseguridad
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-(--color-text) md:text-[1.75rem]">
                Privacidad de la información, sin concesiones
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-(--color-text-muted) md:text-base">
                Para gerentes del sector energético, la confidencialidad de datos operativos no
                es opcional. Nuestra arquitectura está diseñada para eliminar cualquier
                dependencia de infraestructura externa y mantener cada byte bajo su control.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {cybersecurityPillars.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-xl border border-(--color-border) bg-(--color-surface) p-6 md:p-7"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-(--color-accent-soft) text-(--color-accent)">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-semibold text-(--color-text)">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-(--color-text-muted) md:text-[0.95rem]">
                    {description}
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
                  Ecosistema de hardware
                </p>
                <h2 className="mt-2 text-xl font-semibold text-(--color-text) md:text-2xl">
                  Integración Industrial Avanzada
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-(--color-text-muted) md:text-base">
                  Plataforma optimizada para despliegues automatizados de alto nivel, compatible
                  con estaciones DJI Dock 2 y drones de la serie Matrice 3D y 3TD.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="border-y border-(--color-border) bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.18em] text-(--color-accent) uppercase">
                Capacidades técnicas
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-(--color-text)">
                Procesamiento local y operación verificable
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-(--color-text-muted) md:text-base">
                Arquitectura diseñada para entornos industriales exigentes: inferencia en el
                borde y visibilidad operativa de extremo a extremo.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {technicalCapabilities.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-xl border border-(--color-border) bg-(--color-surface) p-6 md:p-7"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-(--color-accent-soft) text-(--color-accent)">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-semibold text-(--color-text)">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-(--color-text-muted) md:text-[0.95rem]">
                    {description}
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
                Integración SCADA
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-(--color-text) md:text-[1.75rem]">
                Sensores industriales y drones, una sola visión operativa
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-(--color-text-muted) md:text-base">
                La plataforma ingesta telemetría de su red SCADA on-premise y la fusiona con
                análisis térmico y estructural de drones. Mantenimiento predictivo con datos que
                nunca salen de su intranet.
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
              {scadaIntegrationFeatures.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-xl border border-(--color-border) bg-white p-6 md:p-7"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-(--color-accent-soft) text-(--color-accent)">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-semibold text-(--color-text)">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-(--color-text-muted) md:text-[0.95rem]">
                    {description}
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
                Casos de uso
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-(--color-text)">
                Operaciones críticas, visibilidad total
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {useCases.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-xl border border-(--color-border) bg-(--color-surface) p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-(--color-accent-soft) text-(--color-accent)">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-base font-semibold text-(--color-text)">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-(--color-text-muted)">
                    {description}
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
            <h2 className="text-2xl font-semibold text-(--color-text)">
              ¿Listo para una demostración personalizada?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-(--color-text-muted) md:text-base">
              Nuestro equipo técnico puede mostrarle el despliegue on-premise adaptado a su
              infraestructura y requisitos de cumplimiento normativo.
            </p>
            <a
              href="mailto:demo@droneanalytics.local?subject=Solicitud%20de%20demostración"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-(--color-accent) px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-(--color-accent-hover)"
            >
              Solicitar Demostración
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-(--color-border) bg-white">
        <div className="border-b border-(--color-border) bg-(--color-accent-soft)/40">
          <p className="mx-auto max-w-6xl px-5 py-4 text-center text-sm font-medium text-(--color-text) md:px-10">
            Procesamiento 100% on-premise · Soberanía absoluta de los datos · Operación sin
            internet
          </p>
        </div>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-(--color-text-muted) md:flex-row md:px-10">
          <p>© {new Date().getFullYear()} Drone Analytics. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-(--color-accent)" strokeWidth={2} />
            Sin dependencia de nube pública · Confidencialidad garantizada
          </p>
        </div>
      </footer>
    </div>
  )
}
