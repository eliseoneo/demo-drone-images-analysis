import type { ComponentType } from 'react'
import {
  Wind,
  CloudRain,
  RefreshCw,
  Plane,
  Battery,
  Radio,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { DroneOperationalStatus, WorkFleetStatus } from '../../types'

interface DockSensorPanelProps {
  fleets: WorkFleetStatus[]
  selectedWorkId: string
  onSelectWork: (workId: string) => void
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

const droneStatusLabels: Record<DroneOperationalStatus, string> = {
  ready: 'Listo',
  in_flight: 'En vuelo',
  charging: 'Cargando',
  maintenance: 'Mantenimiento',
  offline: 'Fuera de línea',
}

const droneStatusColors: Record<DroneOperationalStatus, string> = {
  ready: 'text-teal-600',
  in_flight: 'text-sky-600',
  charging: 'text-amber-600',
  maintenance: 'text-orange-600',
  offline: 'text-slate-400',
}

export function DockSensorPanel({
  fleets,
  selectedWorkId,
  onSelectWork,
}: DockSensorPanelProps) {
  const { t } = useLanguage()
  const selectedFleet =
    fleets.find((fleet) => fleet.workId === selectedWorkId) ?? fleets[0]

  if (!selectedFleet) return null

  const otherFleets = fleets.filter((fleet) => fleet.workId !== selectedFleet.workId)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          {t('Estado del sistema')}
        </h2>
        <p className="mt-1 text-base font-medium text-slate-800">
          {t(selectedFleet.workName)}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          {fleets.length} {t('docks y drones asignados a obras activas')}
        </p>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <EquipmentCard
          title="Dock"
          name={selectedFleet.dock.dockName}
          subtitle={selectedFleet.dock.dockModel}
          icon={Radio}
        />
        <EquipmentCard
          title="Drone"
          name={selectedFleet.drone.droneName}
          subtitle={selectedFleet.drone.droneModel}
          icon={Plane}
          badge={t(droneStatusLabels[selectedFleet.drone.status])}
          badgeColor={droneStatusColors[selectedFleet.drone.status]}
        />
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <SensorCard
          icon={Wind}
          label={t('Viento')}
          value={`${selectedFleet.dock.windSpeedKmh} km/h`}
          status={t(windLabels[selectedFleet.dock.windStatus])}
          statusColor="text-sky-600"
        />
        <SensorCard
          icon={CloudRain}
          label={t('Lluvia')}
          value={
            selectedFleet.dock.rainMmH > 0
              ? `${selectedFleet.dock.rainMmH} mm/h`
              : t(rainLabels[selectedFleet.dock.rainStatus])
          }
          status={t(rainLabels[selectedFleet.dock.rainStatus])}
          statusColor="text-blue-600"
        />
        <SensorCard
          icon={RefreshCw}
          label={t('Sincronización')}
          value={selectedFleet.dock.lastSync}
          status={t(syncLabels[selectedFleet.dock.syncStatus])}
          statusColor={
            selectedFleet.dock.syncStatus === 'ok'
              ? 'text-teal-600'
              : selectedFleet.dock.syncStatus === 'warning'
                ? 'text-amber-600'
                : 'text-rose-600'
          }
        />
      </div>

      <div className="mb-3 flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
        <Battery className="h-4 w-4 text-slate-500" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>{t('Batería del drone')}</span>
            <span className="font-medium text-slate-700">
              {selectedFleet.drone.batteryPercent}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${
                selectedFleet.drone.batteryPercent > 60
                  ? 'bg-teal-500'
                  : selectedFleet.drone.batteryPercent > 30
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
              }`}
              style={{ width: `${selectedFleet.drone.batteryPercent}%` }}
            />
          </div>
        </div>
        <span
          className={`text-xs font-semibold ${droneStatusColors[selectedFleet.drone.status]}`}
        >
          {t(droneStatusLabels[selectedFleet.drone.status])}
        </span>
      </div>

      {otherFleets.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {t('Otros equipos por obra')}
          </p>
          <ul className="max-h-36 space-y-1 overflow-y-auto">
            {otherFleets.map((fleet) => (
              <li key={fleet.workId}>
                <button
                  type="button"
                  onClick={() => onSelectWork(fleet.workId)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-left transition-colors hover:border-teal-200 hover:bg-teal-50/50"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-slate-700">
                      {t(fleet.workName)}
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] text-slate-400">
                      {fleet.dock.dockName} · {fleet.drone.droneName}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 text-[10px] font-semibold ${droneStatusColors[fleet.drone.status]}`}
                  >
                    {t(droneStatusLabels[fleet.drone.status])}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function EquipmentCard({
  title,
  name,
  subtitle,
  icon: Icon,
  badge,
  badgeColor,
}: {
  title: string
  name: string
  subtitle: string
  icon: ComponentType<{ className?: string }>
  badge?: string
  badgeColor?: string
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-500">
          <Icon className="h-4 w-4 shrink-0" />
          <span className="text-[10px] font-semibold uppercase tracking-wide">{title}</span>
        </div>
        {badge && (
          <span className={`text-[10px] font-semibold ${badgeColor ?? 'text-slate-500'}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 truncate text-sm font-semibold text-slate-800">{name}</p>
      <p className="truncate text-xs text-slate-500">{subtitle}</p>
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
