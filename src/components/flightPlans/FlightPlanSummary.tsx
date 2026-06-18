import { Sun, Moon, Clock, Route } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { FlightPlan } from '../../types/flightPlans'

interface FlightPlanSummaryProps {
  plan: FlightPlan
  isSelected: boolean
  onSelect: () => void
}

const statusStyles = {
  draft: 'bg-slate-100 text-slate-600',
  active: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
}

const statusLabels = {
  draft: 'Borrador',
  active: 'Activo',
  completed: 'Completado',
}

export function FlightPlanSummary({ plan, isSelected, onSelect }: FlightPlanSummaryProps) {
  const { t } = useLanguage()
  const FlightIcon = plan.flightTime === 'diurnal' ? Sun : Moon

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
        isSelected
          ? 'border-teal-300 bg-teal-50 ring-1 ring-teal-200'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-slate-800">{plan.name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="h-3 w-3" />
            {plan.scheduledAt}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyles[plan.status]}`}>
          {t(statusLabels[plan.status])}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1">
          <FlightIcon className="h-3 w-3" />
          {plan.flightTime === 'diurnal' ? t('Diurno') : t('Nocturno')}
        </span>
        <span className="inline-flex items-center gap-1">
          <Route className="h-3 w-3" />
          {plan.waypoints.length} waypoints
        </span>
        <span>~{plan.estimatedDurationMin} min</span>
      </div>
    </button>
  )
}
