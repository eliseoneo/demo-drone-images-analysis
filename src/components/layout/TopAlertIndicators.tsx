import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Radio, ShieldAlert } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { unauthorizedAccessAlerts } from '../../data/mocks/technicalSupport'
import { canAccessScadaIntegration, canAccessTechnicalSupport } from '../../utils/accessControl'
import { getAlertedWorks, getPendingDetections } from '../../utils/globalAlerts'
import {
  buildScadaAlertPath,
  getScadaAlertTone,
  getScadaDashboardAlerts,
  type ScadaDashboardAlert,
} from '../../utils/scadaAlerts'

type OpenPanel = 'works' | 'anomalies' | 'security' | 'scada' | null

const workStatusLabel = {
  at_risk: 'En riesgo',
  delayed: 'Retraso crítico',
} as const

const workStatusClass = {
  at_risk: 'bg-amber-50 text-amber-700 ring-amber-200',
  delayed: 'bg-rose-50 text-rose-700 ring-rose-200',
} as const

export function TopAlertIndicators() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null)

  const alertedWorks = getAlertedWorks()
  const pendingDetections = getPendingDetections()
  const securityAlerts = unauthorizedAccessAlerts
  const scadaAlerts = getScadaDashboardAlerts()
  const showSecurityAlerts = user && canAccessTechnicalSupport(user.role)
  const showScadaAlerts = user && canAccessScadaIntegration(user.role)

  const securityTone =
    securityAlerts.some((a) => a.severity === 'critical') ? 'critical' : 'warning'

  const scadaTone = getScadaAlertTone(scadaAlerts)

  useEffect(() => {
    if (!openPanel) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenPanel(null)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenPanel(null)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openPanel])

  const togglePanel = (panel: Exclude<OpenPanel, null>) => {
    setOpenPanel((current) => (current === panel ? null : panel))
  }

  const goToWorkAlert = (workId: string) => {
    setOpenPanel(null)
    navigate(`/?workId=${workId}&scrollTo=execution`)
  }

  const goToAnomaly = (detectionId: string) => {
    setOpenPanel(null)
    navigate(`/inspection?detectionId=${detectionId}&scrollTo=anomalies`)
  }

  const goToSecuritySupport = () => {
    setOpenPanel(null)
    navigate('/soporte-tecnico')
  }

  const goToScadaAlert = (alert: ScadaDashboardAlert) => {
    setOpenPanel(null)
    navigate(buildScadaAlertPath(alert))
  }

  const goToScadaIntegration = () => {
    setOpenPanel(null)
    navigate('/integracion-scada?scrollTo=alarms')
  }

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-end gap-2 border-b border-slate-200 bg-white px-4 py-2"
    >
      <AlertBell
        label="Obras en alerta"
        count={alertedWorks.length}
        active={openPanel === 'works'}
        tone={alertedWorks.some((w) => w.status === 'delayed') ? 'critical' : 'warning'}
        onClick={() => togglePanel('works')}
      >
        {alertedWorks.length === 0 ? (
          <p className="px-3 py-4 text-sm text-slate-500">No hay obras en alerta.</p>
        ) : (
          <ul className="max-h-64 overflow-y-auto py-1">
            {alertedWorks.map((work) => (
              <li key={work.workId}>
                <button
                  type="button"
                  onClick={() => goToWorkAlert(work.workId)}
                  className="flex w-full flex-col gap-1 px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-800">{work.name}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${workStatusClass[work.status]}`}
                    >
                      {workStatusLabel[work.status]}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{work.headline}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </AlertBell>

      <AlertBell
        label="Hallazgos de anomalías"
        count={pendingDetections.length}
        active={openPanel === 'anomalies'}
        tone="warning"
        onClick={() => togglePanel('anomalies')}
      >
        {pendingDetections.length === 0 ? (
          <p className="px-3 py-4 text-sm text-slate-500">
            No hay hallazgos pendientes de validación.
          </p>
        ) : (
          <ul className="max-h-64 overflow-y-auto py-1">
            {pendingDetections.map((detection) => (
              <li key={detection.id}>
                <button
                  type="button"
                  onClick={() => goToAnomaly(detection.id)}
                  className="flex w-full flex-col gap-1 px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="text-sm font-medium text-slate-800">{detection.label}</span>
                  <span className="text-xs text-slate-500">
                    Confianza {Math.round(detection.confidence * 100)}% — Pendiente de validación
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </AlertBell>

      {showScadaAlerts && scadaAlerts.length > 0 && (
        <AlertBell
          label="Alertas SCADA"
          count={scadaAlerts.length}
          active={openPanel === 'scada'}
          tone={scadaTone}
          onClick={() => togglePanel('scada')}
          icon={Radio}
        >
          <ul className="max-h-64 overflow-y-auto py-1">
            {scadaAlerts.map((alert) => (
              <li key={alert.id}>
                <button
                  type="button"
                  onClick={() => goToScadaAlert(alert)}
                  className="flex w-full flex-col gap-1 px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-800">{alert.title}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${
                        alert.severity === 'critical'
                          ? 'bg-rose-50 text-rose-700 ring-rose-200'
                          : 'bg-amber-50 text-amber-700 ring-amber-200'
                      }`}
                    >
                      {alert.severity === 'critical' ? 'Crítico' : 'Advertencia'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{alert.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-100 px-3 py-2">
            <button
              type="button"
              onClick={goToScadaIntegration}
              className="text-xs font-medium text-teal-700 hover:text-teal-800"
            >
              Abrir integración SCADA →
            </button>
          </div>
        </AlertBell>
      )}

      {showSecurityAlerts && (
        <AlertBell
          label="Accesos no autorizados"
          count={securityAlerts.length}
          active={openPanel === 'security'}
          tone={securityTone}
          onClick={() => togglePanel('security')}
          icon={ShieldAlert}
        >
          {securityAlerts.length === 0 ? (
            <p className="px-3 py-4 text-sm text-slate-500">
              No hay intentos de acceso bloqueados.
            </p>
          ) : (
            <ul className="max-h-64 overflow-y-auto py-1">
              {securityAlerts.map((alert) => (
                <li key={alert.id}>
                  <button
                    type="button"
                    onClick={goToSecuritySupport}
                    className="flex w-full flex-col gap-1 px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-slate-800">
                        {alert.sourceIp}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${
                          alert.severity === 'critical'
                            ? 'bg-rose-50 text-rose-700 ring-rose-200'
                            : 'bg-amber-50 text-amber-700 ring-amber-200'
                        }`}
                      >
                        {alert.severity === 'critical' ? 'Crítico' : 'Advertencia'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {alert.method} {alert.targetEndpoint} — Bloqueado
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </AlertBell>
      )}
    </div>
  )
}

function AlertBell({
  label,
  count,
  active,
  tone,
  onClick,
  children,
  icon: Icon = Bell,
}: {
  label: string
  count: number
  active: boolean
  tone: 'warning' | 'critical'
  onClick: () => void
  children: ReactNode
  icon?: typeof Bell
}) {
  const hasAlerts = count > 0
  const bellTone =
    tone === 'critical' && hasAlerts
      ? 'text-rose-600 hover:bg-rose-50'
      : hasAlerts
        ? 'text-amber-600 hover:bg-amber-50'
        : 'text-slate-400 hover:bg-slate-50'

  const badgeTone =
    tone === 'critical' && hasAlerts ? 'bg-rose-500' : hasAlerts ? 'bg-amber-500' : 'bg-slate-300'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={active}
        aria-label={`${label}${hasAlerts ? `, ${count} pendientes` : ''}`}
        className={`relative flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${bellTone} ${
          active ? 'ring-2 ring-teal-200' : ''
        }`}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden font-medium sm:inline">{label}</span>
        <span
          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${badgeTone}`}
        >
          {count}
        </span>
      </button>

      {active && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {label}
            </p>
          </div>
          {children}
        </div>
      )}
    </div>
  )
}
