import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowRight, Radio } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import {
  buildScadaAlertPath,
  getScadaAlertTone,
  getScadaDashboardAlerts,
  resolveAlertSubtitle,
  resolveAlertTitle,
  type ScadaDashboardAlert,
} from '../../utils/scadaAlerts'

const severityStyles: Record<
  ScadaDashboardAlert['severity'],
  { badge: string; label: string }
> = {
  critical: {
    badge: 'bg-rose-100 text-rose-800 ring-rose-200',
    label: 'common.critical',
  },
  warning: {
    badge: 'bg-amber-100 text-amber-800 ring-amber-200',
    label: 'common.warning',
  },
}

const kindLabels: Record<ScadaDashboardAlert['kind'], string> = {
  wear_alarm: 'dashboard.wear',
  sensor_threshold: 'dashboard.scadaSensor',
  connector_degraded: 'dashboard.connector',
}

export function ScadaAlertsPanel() {
  const navigate = useNavigate()
  const { t, tm } = useLanguage()
  const alerts = getScadaDashboardAlerts()

  if (alerts.length === 0) return null

  const tone = getScadaAlertTone(alerts)
  const panelTone =
    tone === 'critical'
      ? 'border-rose-200 bg-rose-50/60'
      : 'border-amber-200 bg-amber-50/60'

  const goToAlert = (alert: ScadaDashboardAlert) => {
    navigate(buildScadaAlertPath(alert))
  }

  const goToScada = () => {
    navigate('/integracion-scada?scrollTo=alarms')
  }

  return (
    <section
      role="alert"
      className={`rounded-xl border p-4 shadow-sm ${panelTone}`}
      id="alertas-scada"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Radio
            className={`mt-0.5 h-5 w-5 shrink-0 ${tone === 'critical' ? 'text-rose-600' : 'text-amber-600'}`}
          />
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              {t('scada.title')} — {alerts.length}{' '}
              {alerts.length > 1 ? t('dashboard.alertsPlural') : t('dashboard.alertSingular')}{' '}
              {alerts.length > 1 ? t('dashboard.activePlural') : t('dashboard.activeSingular')}
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              {t('dashboard.scadaPanelDesc')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={goToScada}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-teal-700 shadow-sm ring-1 ring-teal-200 transition-colors hover:bg-teal-50"
        >
          {t('dashboard.viewScadaIntegration')}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <ul className="mt-3 space-y-2">
        {alerts.slice(0, 4).map((alert) => {
          const styles = severityStyles[alert.severity]
          return (
            <li key={alert.id}>
              <button
                type="button"
                onClick={() => goToAlert(alert)}
                className="flex w-full items-start justify-between gap-3 rounded-lg border border-white/80 bg-white/90 px-3 py-2.5 text-left transition-colors hover:bg-white"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {alert.severity === 'critical' && (
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                    )}
                    <span className="text-sm font-medium text-slate-800">
                      {resolveAlertTitle(alert, t, tm)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {resolveAlertSubtitle(alert, t, tm)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${styles.badge}`}
                  >
                    {t(styles.label)}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    {t(kindLabels[alert.kind])}
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      {alerts.length > 4 && (
        <button
          type="button"
          onClick={goToScada}
          className="mt-2 text-xs font-medium text-teal-700 hover:text-teal-800"
        >
          {t('common.view')} {alerts.length - 4}{' '}
          {alerts.length - 4 > 1 ? t('dashboard.alertsPlural') : t('dashboard.alertSingular')}{' '}
          {t('dashboard.moreInScada')} →
        </button>
      )}
    </section>
  )
}
