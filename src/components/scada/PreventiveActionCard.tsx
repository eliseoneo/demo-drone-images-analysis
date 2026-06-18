import { AlertTriangle, ClipboardList, DollarSign, ShieldAlert } from 'lucide-react'
import type { PreventiveActionRecommendation, WearAlarmSeverity } from '../../types/scada'
import { useLanguage } from '../../context/LanguageContext'
import { formatCurrency } from '../../i18n/format'

const priorityStyles: Record<
  WearAlarmSeverity,
  { border: string; bg: string; badge: string; icon: string }
> = {
  critical: {
    border: 'border-rose-300',
    bg: 'bg-gradient-to-br from-rose-50 to-orange-50',
    badge: 'bg-rose-100 text-rose-800 ring-rose-200',
    icon: 'text-rose-600',
  },
  warning: {
    border: 'border-amber-300',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    badge: 'bg-amber-100 text-amber-800 ring-amber-200',
    icon: 'text-amber-600',
  },
  info: {
    border: 'border-sky-300',
    bg: 'bg-gradient-to-br from-sky-50 to-slate-50',
    badge: 'bg-sky-100 text-sky-800 ring-sky-200',
    icon: 'text-sky-600',
  },
}

interface PreventiveActionCardProps {
  action: PreventiveActionRecommendation
  onGenerateOrder?: () => void
}

export function PreventiveActionCard({ action, onGenerateOrder }: PreventiveActionCardProps) {
  const { t, tm, language } = useLanguage()
  const styles = priorityStyles[action.priority]
  const lossFormatted = formatCurrency(action.estimatedLossUsd, language)

  const priorityLevel =
    action.priority === 'critical'
      ? t('scada.priorityCritical')
      : action.priority === 'warning'
        ? t('scada.priorityHigh')
        : t('scada.priorityMedium')

  return (
    <section
      aria-labelledby="preventive-action-title"
      className={`rounded-xl border-2 ${styles.border} ${styles.bg} p-5 shadow-sm`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`rounded-lg bg-white/80 p-2.5 shadow-sm ${styles.icon}`}>
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('scada.preventiveAction')}
            </p>
            <h2 id="preventive-action-title" className="mt-1 text-lg font-semibold text-slate-900">
              {t('scada.failureProbability', {
                pct: (action.failureProbability * 100).toFixed(0),
                component: tm(action.componentLabel),
              })}
            </h2>
            <p className="mt-0.5 text-sm text-slate-600">{tm(action.assetName)}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${styles.badge}`}
        >
          {t('scada.priority', { level: priorityLevel })}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-800">
        <strong>{t('common.recommendation')}:</strong> {tm(action.recommendation)}
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/60 bg-white/70 px-3 py-2.5">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            {t('scada.actionWindow')}
          </dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{tm(action.actionWindow)}</dd>
        </div>
        <div className="rounded-lg border border-white/60 bg-white/70 px-3 py-2.5">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <DollarSign className="h-3.5 w-3.5 text-rose-600" />
            {t('scada.estimatedLoss')}
          </dt>
          <dd className="mt-1 text-sm font-semibold text-rose-700">{lossFormatted}</dd>
        </div>
        <div className="rounded-lg border border-white/60 bg-white/70 px-3 py-2.5">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <ClipboardList className="h-3.5 w-3.5 text-teal-600" />
            {t('scada.affectedComponent')}
          </dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{tm(action.componentLabel)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onGenerateOrder}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          <ClipboardList className="h-4 w-4" />
          {t('scada.generateMaintenanceOrder')}
        </button>
        <p className="text-xs text-slate-500">{t('scada.orderSimulationHint')}</p>
      </div>
    </section>
  )
}
