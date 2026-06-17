import { useMemo, useState } from 'react'
import { Sun, Moon, Clock, ChevronDown, ChevronUp, CalendarClock } from 'lucide-react'
import { sortWorksByUpcoming } from '../../data/mocks/progress'
import type { ActiveWork, FlightTime } from '../../types'

const VISIBLE_COUNT = 2

interface ActiveWorksPanelProps {
  works: ActiveWork[]
  selectedWorkId: string
  onSelectWork: (workId: string) => void
}

const flightConfig: Record<
  FlightTime,
  { label: string; icon: typeof Sun; className: string }
> = {
  diurnal: {
    label: 'Vuelo diurno',
    icon: Sun,
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  nocturnal: {
    label: 'Vuelo nocturno',
    icon: Moon,
    className: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  },
}

const statusLabels = {
  in_progress: 'En curso',
  scheduled: 'Programada',
  completed_today: 'Completada hoy',
}

const categoryLabels = {
  construction: 'Inspección de obra',
  powerline: 'Revisión de línea',
  tower: 'Inspección de torres',
  substation: 'Revisión de subestación',
}

function WorkItem({
  work,
  selected,
  onSelect,
}: {
  work: ActiveWork
  selected: boolean
  onSelect: () => void
}) {
  const flight = flightConfig[work.flightTime]
  const FlightIcon = flight.icon

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full flex-wrap items-center justify-between gap-3 rounded-lg py-3 text-left transition-colors first:pt-0 last:pb-0 ${
          selected
            ? 'bg-teal-50/80 px-2 ring-1 ring-teal-300'
            : 'px-2 hover:bg-slate-50'
        }`}
        aria-pressed={selected}
      >
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-800">{work.name}</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {categoryLabels[work.category]}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarClock className="h-3 w-3 shrink-0" />
            Próximo vuelo: {work.nextFlightAt}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3 w-3 shrink-0" />
            Última inspección: {work.lastInspection}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
            {statusLabels[work.status]}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${flight.className}`}
          >
            <FlightIcon className="h-3.5 w-3.5 shrink-0" />
            {flight.label}
          </span>
        </div>
      </button>
    </li>
  )
}

export function ActiveWorksPanel({
  works,
  selectedWorkId,
  onSelectWork,
}: ActiveWorksPanelProps) {
  const [expanded, setExpanded] = useState(false)

  const sorted = useMemo(() => sortWorksByUpcoming(works), [works])
  const upcoming = sorted.slice(0, VISIBLE_COUNT)
  const others = sorted.slice(VISIBLE_COUNT)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-800">Obras activas</h2>
      <p className="mt-0.5 text-xs text-slate-500">
        Seleccione una obra para ver su resumen de avances — {works.length} operaciones en
        total
      </p>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-teal-600">
          Más próximas
        </p>
        <ul className="divide-y divide-slate-100 rounded-lg border border-teal-100 bg-teal-50/40 px-1">
          {upcoming.map((work) => (
            <WorkItem
              key={work.id}
              work={work}
              selected={work.id === selectedWorkId}
              onSelect={() => onSelectWork(work.id)}
            />
          ))}
        </ul>
      </div>

      {others.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            aria-expanded={expanded}
          >
            <span>
              {expanded ? 'Ocultar otras obras' : `Ver otras obras (${others.length})`}
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
            )}
          </button>

          {expanded && (
            <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white px-1">
              {others.map((work) => (
                <WorkItem
                  key={work.id}
                  work={work}
                  selected={work.id === selectedWorkId}
                  onSelect={() => onSelectWork(work.id)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
