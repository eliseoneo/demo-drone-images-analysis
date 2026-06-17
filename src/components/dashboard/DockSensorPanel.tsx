import type { ComponentType } from 'react'
import { Wind, CloudRain, RefreshCw } from 'lucide-react'
import type { DockSensorStatus } from '../../types'

interface DockSensorPanelProps {
  data: DockSensorStatus
}

const windLabels = {
  normal: 'Normal',
  elevated: 'Elevado',
  critical: 'Crítico',
}

const rainLabels = {
  none: 'Sin lluvia',
  light: 'Lluvia ligera',
  heavy: 'Lluvia intensa',
}

const syncLabels = {
  ok: 'Sincronizado',
  warning: 'Retraso',
  error: 'Error',
}

export function DockSensorPanel({ data }: DockSensorPanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Estado del sistema
        </h2>
        <p className="mt-1 text-base font-medium text-slate-800">{data.dockName}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <SensorCard
          icon={Wind}
          label="Viento"
          value={`${data.windSpeedKmh} km/h`}
          status={windLabels[data.windStatus]}
          statusColor="text-sky-600"
        />
        <SensorCard
          icon={CloudRain}
          label="Lluvia"
          value={data.rainMmH > 0 ? `${data.rainMmH} mm/h` : rainLabels[data.rainStatus]}
          status={rainLabels[data.rainStatus]}
          statusColor="text-blue-600"
        />
        <SensorCard
          icon={RefreshCw}
          label="Sincronización"
          value={data.lastSync}
          status={syncLabels[data.syncStatus]}
          statusColor={
            data.syncStatus === 'ok'
              ? 'text-teal-600'
              : data.syncStatus === 'warning'
                ? 'text-amber-600'
                : 'text-rose-600'
          }
        />
      </div>
    </div>
  )
}

function SensorCard({
  icon: Icon,
  label,
  value,
  status,
  statusColor,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  status: string
  statusColor: string
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-lg font-semibold text-slate-800">{value}</p>
      <p className={`mt-1 text-xs font-medium ${statusColor}`}>{status}</p>
    </div>
  )
}
