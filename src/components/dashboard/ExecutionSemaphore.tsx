import type { ExecutionGanttData, ExecutionProjection } from '../../types'
import { useLanguage } from '../../context/LanguageContext'
import { formatForecastDetail, formatForecastHeadline } from '../../utils/progressForecast'
import { ExecutionGanttChart } from './ExecutionGanttChart'

interface ExecutionSemaphoreProps {
  projection: ExecutionProjection
  detailKey: string
  detailParams: Record<string, string | number>
  workId: string
  ganttData: ExecutionGanttData
  selectedWorkId: string
}

const statusConfig = {
  on_time: {
    labelKey: 'dashboard.onTime',
    text: 'text-teal-700',
    descriptionKey: 'dashboard.executionOnTimeDesc',
  },
  delay_warning: {
    labelKey: 'dashboard.delayAlert',
    text: 'text-amber-700',
    descriptionKey: 'dashboard.executionWarningDesc',
  },
  critical_delay: {
    labelKey: 'dashboard.criticalDelay',
    text: 'text-rose-700',
    descriptionKey: 'dashboard.executionCriticalDesc',
  },
}

export function ExecutionSemaphore({
  projection,
  detailKey,
  detailParams,
  workId,
  ganttData,
  selectedWorkId,
}: ExecutionSemaphoreProps) {
  const { t, tw } = useLanguage()
  const config = statusConfig[projection.status]
  const headline = formatForecastHeadline(t, { headlineKey: projection.messageKey })
  const detail = formatForecastDetail(t, { detailKey, detailParams })

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            {t('dashboard.executionProjection')}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-800">{tw(workId)}</p>
        </div>
        <p className="text-xs text-slate-400">{t('dashboard.syncedWithProgress')}</p>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="flex items-center gap-4">
          <TrafficLight active="green" lit={projection.status === 'on_time'} />
          <TrafficLight active="yellow" lit={projection.status === 'delay_warning'} />
          <TrafficLight active="red" lit={projection.status === 'critical_delay'} />
        </div>

        <p className={`mt-4 text-lg font-semibold ${config.text}`}>{t(config.labelKey)}</p>
        <p className="mt-2 text-center text-sm text-slate-600">{headline}</p>
        <p className="mt-3 text-center text-xs text-slate-500">
          {projection.marginDays >= 0
            ? `${t('common.projection')}: ${projection.marginDays} ${t('dashboard.marginDays')}`
            : `${t('common.projection')}: ${Math.abs(projection.marginDays)} ${t('dashboard.estimatedLagDays')}`}
        </p>
      </div>

      <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
        {detail || t(config.descriptionKey)}
      </p>

      <ExecutionGanttChart data={ganttData} selectedWorkId={selectedWorkId} />
    </div>
  )
}

function TrafficLight({
  active,
  lit,
}: {
  active: 'green' | 'yellow' | 'red'
  lit: boolean
}) {
  const colors = {
    green: lit ? 'bg-teal-400' : 'bg-slate-200',
    yellow: lit ? 'bg-amber-300' : 'bg-slate-200',
    red: lit ? 'bg-rose-300' : 'bg-slate-200',
  }

  return (
    <div className="flex h-20 w-12 items-center justify-center rounded-full bg-slate-100 ring-1 ring-slate-200">
      <div className={`h-8 w-8 rounded-full transition-all ${colors[active]}`} />
    </div>
  )
}
