import type { ActiveWork, ExecutionProjection, ProgressMetrics } from '../../types'
import recorridoParcial01Url from '../../../videos/recorrido-parcial-01.mp4?url'
import recorridoParcialUrl from '../../../videos/recorrido-parcial.mp4?url'

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
    evidenceVideoUrl: recorridoParcial01Url,
    scope: {
      totalUnits: 48,
      completedBeforeToday: 31,
      periodRemainingDays: 4,
      periodEndDate: '2026-06-21',
    },
    recentDaily: [
      { date: '2026-06-13', planned: 10, executed: 10 },
      { date: '2026-06-14', planned: 11, executed: 9 },
      { date: '2026-06-15', planned: 12, executed: 11 },
      { date: '2026-06-16', planned: 12, executed: 12 },
    ],
  },
  'work-002': {
    workId: 'work-002',
    category: 'substation',
    plannedToday: 6,
    executedToday: 6,
    unit: 'activos',
    projectName: 'Subestación Norte — Transformador T-401',
    lastInspection: '2026-06-17 08:20',
    evidenceVideoUrl: recorridoParcialUrl,
    scope: {
      totalUnits: 18,
      completedBeforeToday: 12,
      periodRemainingDays: 2,
      periodEndDate: '2026-06-19',
    },
    recentDaily: [
      { date: '2026-06-13', planned: 5, executed: 5 },
      { date: '2026-06-14', planned: 6, executed: 6 },
      { date: '2026-06-15', planned: 6, executed: 6 },
      { date: '2026-06-16', planned: 6, executed: 5 },
    ],
  },
  'work-003': {
    workId: 'work-003',
    category: 'tower',
    plannedToday: 4,
    executedToday: 2,
    unit: 'torres',
    projectName: 'Torre 14 — Inspección de aisladores',
    lastInspection: '2026-06-16 22:10',
    scope: {
      totalUnits: 14,
      completedBeforeToday: 8,
      periodRemainingDays: 5,
      periodEndDate: '2026-06-22',
    },
    recentDaily: [
      { date: '2026-06-13', planned: 3, executed: 3 },
      { date: '2026-06-14', planned: 3, executed: 2 },
      { date: '2026-06-15', planned: 4, executed: 3 },
      { date: '2026-06-16', planned: 4, executed: 2 },
    ],
  },
  'work-004': {
    workId: 'work-004',
    category: 'powerline',
    plannedToday: 8,
    executedToday: 5,
    unit: 'tramos',
    projectName: 'Línea 69 kV — Tramo Sur',
    lastInspection: '2026-06-16 03:35',
    evidenceVideoUrl: recorridoParcial01Url,
    scope: {
      totalUnits: 36,
      completedBeforeToday: 19,
      periodRemainingDays: 5,
      periodEndDate: '2026-06-22',
    },
    recentDaily: [
      { date: '2026-06-13', planned: 7, executed: 6 },
      { date: '2026-06-14', planned: 8, executed: 7 },
      { date: '2026-06-15', planned: 8, executed: 5 },
      { date: '2026-06-16', planned: 8, executed: 6 },
    ],
  },
  'work-005': {
    workId: 'work-005',
    category: 'powerline',
    plannedToday: 5,
    executedToday: 0,
    unit: 'tramos',
    projectName: 'Línea 34.5 kV — Sector Este',
    lastInspection: '2026-06-14 09:15',
    scope: {
      totalUnits: 22,
      completedBeforeToday: 6,
      periodRemainingDays: 6,
      periodEndDate: '2026-06-23',
    },
    recentDaily: [
      { date: '2026-06-11', planned: 4, executed: 4 },
      { date: '2026-06-12', planned: 5, executed: 3 },
      { date: '2026-06-13', planned: 5, executed: 2 },
      { date: '2026-06-14', planned: 5, executed: 1 },
    ],
  },
  'work-006': {
    workId: 'work-006',
    category: 'construction',
    plannedToday: 7,
    executedToday: 4,
    unit: 'sectores',
    projectName: 'Obra Subestación Nueva — Montaje estructuras',
    lastInspection: '2026-06-17 10:00',
    evidenceVideoUrl: recorridoParcialUrl,
    scope: {
      totalUnits: 28,
      completedBeforeToday: 14,
      periodRemainingDays: 6,
      periodEndDate: '2026-06-23',
    },
    recentDaily: [
      { date: '2026-06-13', planned: 6, executed: 5 },
      { date: '2026-06-14', planned: 7, executed: 6 },
      { date: '2026-06-15', planned: 7, executed: 5 },
      { date: '2026-06-16', planned: 7, executed: 6 },
    ],
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
