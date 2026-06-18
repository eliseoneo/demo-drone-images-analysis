import { useMemo, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import type { ExecutionGanttData, FlightGanttEntry, ProjectExecutionGantt } from '../../types'

interface ExecutionGanttChartProps {
  data: ExecutionGanttData
  selectedWorkId: string
}

const ROW_HEIGHT = 36
const LABEL_WIDTH = 220
const TODAY_MS = new Date('2026-06-17T12:00:00').getTime()
const RANGE_PADDING_DAYS = 1

function parseDate(value: string) {
  return new Date(value.replace(' ', 'T')).getTime()
}

function formatDayLabel(date: Date, language: 'es' | 'en') {
  return date.toLocaleDateString(language === 'en' ? 'en-US' : 'es-CL', {
    day: '2-digit',
    month: 'short',
  })
}

function formatDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatFlightTime(entry: FlightGanttEntry, language: 'es' | 'en', tm: (value: string) => string) {
  const start = new Date(entry.startAt.replace(' ', 'T'))
  const end = new Date(entry.endAt.replace(' ', 'T'))
  const locale = language === 'en' ? 'en-US' : 'es-CL'
  const dateFmt = start.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
  })
  const timeFmt = (d: Date) =>
    d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  return `${tm(entry.label)} · ${dateFmt} ${timeFmt(start)}–${timeFmt(end)}`
}

function isSameDay(ms: number, refMs: number) {
  const a = new Date(ms)
  const b = new Date(refMs)
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function computeDynamicRange(projects: ProjectExecutionGantt[], fallback: ExecutionGanttData) {
  const flights = projects.flatMap((p) => p.flights)
  if (flights.length === 0) {
    return { rangeStart: fallback.rangeStart, rangeEnd: fallback.rangeEnd }
  }

  const times = flights.flatMap((f) => [parseDate(f.startAt), parseDate(f.endAt)])
  const minMs = Math.min(...times)
  const maxMs = Math.max(...times)

  const start = new Date(minMs)
  start.setDate(start.getDate() - RANGE_PADDING_DAYS)
  start.setHours(0, 0, 0, 0)

  const end = new Date(maxMs)
  end.setDate(end.getDate() + RANGE_PADDING_DAYS)
  end.setHours(23, 59, 59, 999)

  return { rangeStart: formatDateKey(start), rangeEnd: formatDateKey(end) }
}

function flightBarClass(entry: FlightGanttEntry) {
  if (entry.kind === 'completed') {
    return 'bg-teal-500 text-white shadow-sm ring-1 ring-teal-600/20'
  }

  if (isSameDay(parseDate(entry.startAt), TODAY_MS)) {
    return 'border-2 border-dashed border-amber-400 bg-amber-50 text-amber-900'
  }

  return 'border-2 border-dashed border-sky-400 bg-sky-50 text-sky-800'
}

export function ExecutionGanttChart({ data, selectedWorkId }: ExecutionGanttChartProps) {
  const { language, t, tm, tw } = useLanguage()
  const [showAllProjects, setShowAllProjects] = useState(false)

  const visibleProjects = useMemo(() => {
    if (showAllProjects) return data.projects
    return data.projects.filter((p) => p.workId === selectedWorkId)
  }, [data.projects, selectedWorkId, showAllProjects])

  const { rangeStart, rangeEnd } = useMemo(
    () => computeDynamicRange(visibleProjects, data),
    [visibleProjects, data],
  )

  const { rangeStartMs, totalMs, dayTicks, todayOffset } = useMemo(() => {
    const startMs = parseDate(`${rangeStart} 00:00`)
    const endMs = parseDate(`${rangeEnd} 23:59`)
    const total = endMs - startMs

    const ticks: Date[] = []
    const cursor = new Date(startMs)
    while (cursor.getTime() <= endMs) {
      ticks.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }

    const todayPct =
      TODAY_MS >= startMs && TODAY_MS <= endMs ? ((TODAY_MS - startMs) / total) * 100 : null

    return {
      rangeStartMs: startMs,
      totalMs: total,
      dayTicks: ticks,
      todayOffset: todayPct,
    }
  }, [rangeStart, rangeEnd])

  function barStyle(entry: FlightGanttEntry) {
    const startMs = parseDate(entry.startAt)
    const endMs = parseDate(entry.endAt)
    const left = ((startMs - rangeStartMs) / totalMs) * 100
    const width = Math.max(((endMs - startMs) / totalMs) * 100, 0.8)

    return { left: `${left}%`, width: `${width}%` }
  }

  const completedCount = visibleProjects.reduce(
    (n, p) => n + p.flights.filter((f) => f.kind === 'completed').length,
    0,
  )
  const plannedCount = visibleProjects.reduce(
    (n, p) => n + p.flights.filter((f) => f.kind === 'planned').length,
    0,
  )

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('dashboard.ganttTitle')}
          </p>
          {!showAllProjects && (
            <p className="mt-1 text-sm font-medium text-slate-800">{tw(selectedWorkId)}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAllProjects((v) => !v)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {showAllProjects ? t('dashboard.viewSelectedWork') : t('dashboard.viewAllProjects')}
          </button>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-5 rounded-sm bg-teal-500" />
              {t('dashboard.completedLabel')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-5 rounded-sm border-2 border-dashed border-sky-400 bg-sky-50" />
              {t('dashboard.plannedLabel')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-5 rounded-sm border-2 border-dashed border-amber-400 bg-amber-50" />
              {t('common.today')}
            </span>
          </div>
        </div>
      </div>

      {visibleProjects.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          {t('dashboard.noFlights')}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="flex border-b border-slate-200 pb-2">
              <div
                className="shrink-0 text-xs font-medium text-slate-500"
                style={{ width: LABEL_WIDTH }}
              >
                {t('dashboard.project')}
              </div>
              <div className="relative flex-1">
                <div className="flex">
                  {dayTicks.map((day, i) => {
                    const isToday = isSameDay(day.getTime(), TODAY_MS)
                    return (
                      <div
                        key={i}
                        className={`flex-1 text-center text-[10px] ${
                          isToday ? 'font-semibold text-rose-500' : 'text-slate-400'
                        }`}
                        style={{ minWidth: 0 }}
                      >
                        {formatDayLabel(day, language)}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="relative">
              {todayOffset !== null && (
                <div
                  className="pointer-events-none absolute bottom-0 top-0 z-10 w-0.5 bg-rose-400"
                  style={{
                    left: `calc(${LABEL_WIDTH}px + (100% - ${LABEL_WIDTH}px) * ${todayOffset / 100})`,
                  }}
                  aria-hidden
                />
              )}

              {visibleProjects.map((project) => {
                const isSelected = project.workId === selectedWorkId
                const dimmed = showAllProjects && !isSelected

                return (
                  <div
                    key={project.workId}
                    className={`flex items-center border-b border-slate-50 transition ${
                      isSelected && showAllProjects
                        ? 'bg-teal-50/60 ring-1 ring-inset ring-teal-200'
                        : ''
                    } ${dimmed ? 'opacity-50' : ''}`}
                    style={{ height: ROW_HEIGHT }}
                  >
                    <div
                      className={`shrink-0 truncate pr-3 text-xs font-medium ${
                        isSelected ? 'text-teal-800' : 'text-slate-700'
                      }`}
                      style={{ width: LABEL_WIDTH }}
                      title={tw(project.workId)}
                    >
                      {tw(project.workId)}
                    </div>
                    <div className="relative h-full flex-1">
                      <div className="absolute inset-0 flex">
                        {dayTicks.map((day, i) => (
                          <div
                            key={i}
                            className={`flex-1 border-l first:border-l-0 ${
                              isSameDay(day.getTime(), TODAY_MS)
                                ? 'border-rose-100 bg-rose-50/40'
                                : 'border-slate-100'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="relative h-full">
                        {project.flights.map((flight) => (
                          <div
                            key={flight.id}
                            className="absolute top-1/2 -translate-y-1/2"
                            style={barStyle(flight)}
                          >
                            <div
                              className={`h-5 truncate rounded px-1 text-[10px] leading-5 ${flightBarClass(flight)}`}
                              title={formatFlightTime(flight, language, tm)}
                            >
                              {tm(flight.label)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {todayOffset !== null && (
              <p className="mt-2 text-[10px] text-rose-400">
                {t('dashboard.todayLine')}
              </p>
            )}
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-slate-500">
        {visibleProjects.length}{' '}
        {visibleProjects.length !== 1 ? t('dashboard.projects') : t('dashboard.project')} ·{' '}
        {completedCount} {completedCount !== 1 ? t('dashboard.flights') : t('dashboard.flight')} ·{' '}
        {plannedCount} {plannedCount !== 1 ? t('dashboard.flights') : t('dashboard.flight')}
        {!showAllProjects && ` · ${t('dashboard.filteredByWork')}`}
      </p>
    </div>
  )
}
