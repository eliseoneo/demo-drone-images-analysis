import type { ExecutionProjection } from '../../types'

interface ExecutionSemaphoreProps {
  data: ExecutionProjection
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

export function ExecutionSemaphore({ data }: ExecutionSemaphoreProps) {
  const config = statusConfig[data.status]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
        Proyección de ejecución
      </h2>

      <div className="mt-6 flex flex-col items-center">
        <div className="flex items-center gap-4">
          <TrafficLight active="green" lit={data.status === 'on_time'} />
          <TrafficLight active="yellow" lit={data.status === 'delay_warning'} />
          <TrafficLight active="red" lit={data.status === 'critical_delay'} />
        </div>

        <p className={`mt-4 text-lg font-semibold ${config.text}`}>{config.label}</p>
        <p className="mt-2 text-center text-sm text-slate-600">{data.message}</p>
        <p className="mt-3 text-center text-xs text-slate-500">
          {data.marginDays >= 0
            ? `Proyección: ${data.marginDays} días de margen`
            : `Proyección: ${Math.abs(data.marginDays)} día(s) de desfase estimado`}
        </p>
      </div>

      <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
        {config.description}
      </p>
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
