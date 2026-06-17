import type { ActiveWork, ExecutionProjection, ProgressMetrics } from '../../types'

export const activeWorks: ActiveWork[] = [
  {
    id: 'work-001',
    name: 'Línea 138 kV — Tramo Norte',
    category: 'powerline',
    lastInspection: '2026-06-17 11:45',
    nextFlightAt: '2026-06-17 14:00',
    flightTime: 'diurnal',
    status: 'in_progress',
  },
  {
    id: 'work-004',
    name: 'Línea 69 kV — Tramo Sur',
    category: 'powerline',
    lastInspection: '2026-06-16 03:35',
    nextFlightAt: '2026-06-17 15:30',
    flightTime: 'nocturnal',
    status: 'in_progress',
  },
  {
    id: 'work-003',
    name: 'Torre 14 — Inspección de aisladores',
    category: 'tower',
    lastInspection: '2026-06-16 22:10',
    nextFlightAt: '2026-06-17 22:00',
    flightTime: 'nocturnal',
    status: 'scheduled',
  },
  {
    id: 'work-002',
    name: 'Subestación Norte — Transformador T-401',
    category: 'substation',
    lastInspection: '2026-06-17 08:20',
    nextFlightAt: '2026-06-18 07:00',
    flightTime: 'diurnal',
    status: 'completed_today',
  },
  {
    id: 'work-005',
    name: 'Línea 34.5 kV — Sector Este',
    category: 'powerline',
    lastInspection: '2026-06-14 09:15',
    nextFlightAt: '2026-06-19 06:30',
    flightTime: 'diurnal',
    status: 'scheduled',
  },
  {
    id: 'work-006',
    name: 'Obra Subestación Nueva — Montaje estructuras',
    category: 'construction',
    lastInspection: '2026-06-17 10:00',
    nextFlightAt: '2026-06-17 16:00',
    flightTime: 'diurnal',
    status: 'in_progress',
  },
]

export const progressMetricsByWorkId: Record<string, ProgressMetrics> = {
  'work-001': {
    workId: 'work-001',
    category: 'powerline',
    plannedToday: 12,
    executedToday: 11,
    unit: 'tramos',
    projectName: 'Línea 138 kV — Tramo Norte',
    lastInspection: '2026-06-17 11:45',
  },
  'work-002': {
    workId: 'work-002',
    category: 'substation',
    plannedToday: 6,
    executedToday: 6,
    unit: 'activos',
    projectName: 'Subestación Norte — Transformador T-401',
    lastInspection: '2026-06-17 08:20',
  },
  'work-003': {
    workId: 'work-003',
    category: 'tower',
    plannedToday: 4,
    executedToday: 2,
    unit: 'torres',
    projectName: 'Torre 14 — Inspección de aisladores',
    lastInspection: '2026-06-16 22:10',
  },
  'work-004': {
    workId: 'work-004',
    category: 'powerline',
    plannedToday: 8,
    executedToday: 5,
    unit: 'tramos',
    projectName: 'Línea 69 kV — Tramo Sur',
    lastInspection: '2026-06-16 03:35',
  },
  'work-005': {
    workId: 'work-005',
    category: 'powerline',
    plannedToday: 5,
    executedToday: 0,
    unit: 'tramos',
    projectName: 'Línea 34.5 kV — Sector Este',
    lastInspection: '2026-06-14 09:15',
  },
  'work-006': {
    workId: 'work-006',
    category: 'construction',
    plannedToday: 7,
    executedToday: 4,
    unit: 'sectores',
    projectName: 'Obra Subestación Nueva — Montaje estructuras',
    lastInspection: '2026-06-17 10:00',
  },
}

/** @deprecated Usar progressMetricsByWorkId con la obra seleccionada */
export const progressMetrics = progressMetricsByWorkId['work-001']

export const executionProjection: ExecutionProjection = {
  status: 'on_time',
  message: 'Ejecución dentro del cronograma planificado',
  marginDays: 2,
}

function parseWorkDate(value: string) {
  return new Date(value.replace(' ', 'T')).getTime()
}

export function sortWorksByUpcoming(works: ActiveWork[]) {
  return [...works].sort((a, b) => {
    if (a.status === 'completed_today' && b.status !== 'completed_today') return 1
    if (b.status === 'completed_today' && a.status !== 'completed_today') return -1
    return parseWorkDate(a.nextFlightAt) - parseWorkDate(b.nextFlightAt)
  })
}

export function getDefaultSelectedWorkId(works: ActiveWork[]) {
  return sortWorksByUpcoming(works)[0]?.id ?? ''
}
