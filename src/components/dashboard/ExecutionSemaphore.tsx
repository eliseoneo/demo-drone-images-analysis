import type { ExecutionGanttData, ExecutionProjection } from '../../types'
import { useLanguage } from '../../context/LanguageContext'
import { ExecutionGanttChart } from './ExecutionGanttChart'

interface ExecutionSemaphoreProps {
  projection: ExecutionProjection
  projectionDetail: string
  projectName: string
  ganttData: ExecutionGanttData
  selectedWorkId: string
}

const statusConfig = {
  on_time: {
    label: 'En tiempo',
    text: 'text-teal-700',
    description: 'La ejecución avanza según el cronograma planificado.',
  },
  delay_warning: {
    label: 'Alerta de retraso',
    text: 'text-amber-700',
    description: 'El ritmo actual sugiere posible desviación del plan.',
  },
  critical_delay: {
    label: 'Retraso crítico',
    text: 'text-rose-700',
    description: 'Se requiere acción inmediata para recuperar el cronograma.',
  },
}

export function ExecutionSemaphore({
  projection,
  projectionDetail,
  projectName,
  ganttData,
  selectedWorkId,
}: ExecutionSemaphoreProps) {
  const { t } = useLanguage()
  const config = statusConfig[projection.status]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            {t('Proyección de ejecución')}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-800">{t(projectName)}</p>
        </div>
        <p className="text-xs text-slate-400">{t('Sincronizado con resumen de avances')}</p>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="flex items-center gap-4">
          <TrafficLight active="green" lit={projection.status === 'on_time'} />
          <TrafficLight active="yellow" lit={projection.status === 'delay_warning'} />
          <TrafficLight active="red" lit={projection.status === 'critical_delay'} />
        </div>

        <p className={`mt-4 text-lg font-semibold ${config.text}`}>{t(config.label)}</p>
        <p className="mt-2 text-center text-sm text-slate-600">{t(projection.message)}</p>
        <p className="mt-3 text-center text-xs text-slate-500">
          {projection.marginDays >= 0
            ? `${t('Proyección')}: ${projection.marginDays} ${t('días de margen')}`
            : `${t('Proyección')}: ${Math.abs(projection.marginDays)} ${t(
                'día(s) de desfase estimado',
              )}`}
        </p>
      </div>

      <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
        {t(projectionDetail)}
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
