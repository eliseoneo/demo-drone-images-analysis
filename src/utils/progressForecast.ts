import type {
  ExecutionProjection,
  ExecutionStatus,
  ProgressForecast,
  ProgressForecastStatus,
  ProgressMetrics,
} from '../types'

const WORK_DAY_START_HOUR = 7
const WORK_DAY_HOURS = 10
const DEMO_NOW_HOUR = 12

function computeDayProgressPct() {
  const elapsed = Math.max(DEMO_NOW_HOUR - WORK_DAY_START_HOUR, 0.5)
  return Math.min(Math.round((elapsed / WORK_DAY_HOURS) * 100), 95)
}

function estimateDailyRate(metrics: ProgressMetrics, projectedEndOfDay: number) {
  if (projectedEndOfDay >= 0.5) return projectedEndOfDay

  const recent = metrics.recentDaily
  if (recent.length > 0) {
    const avg = recent.reduce((sum, point) => sum + point.executed, 0) / recent.length
    if (avg > 0) return avg
  }

  return Math.max(metrics.plannedToday * 0.5, 0.5)
}

function resolveStatus(
  endOfDayGap: number,
  periodGap: number,
  paceRatio: number,
): ProgressForecastStatus {
  if (endOfDayGap >= -0.5 && periodGap >= -1 && paceRatio >= 0.85) return 'on_track'
  if (endOfDayGap >= -2 && periodGap >= -4 && paceRatio >= 0.6) return 'at_risk'
  return 'delayed'
}

function unitKey(unit: string): string {
  const map: Record<string, string> = {
    tramos: 'common.units.sections',
    activos: 'common.units.assets',
    torres: 'common.units.towers',
    sectores: 'common.units.sectors',
  }
  return map[unit] ?? unit
}

function buildMessageKeys(
  status: ProgressForecastStatus,
  endOfDayGap: number,
  periodGap: number,
  deviationDays: number,
  unit: string,
): Pick<ProgressForecast, 'headlineKey' | 'detailKey' | 'detailParams'> {
  const unitTranslationKey = unitKey(unit)
  const gapTodayKey = endOfDayGap >= 0 ? 'forecast.gapAbove' : 'forecast.gapBelow'
  const gapValue = Math.abs(endOfDayGap).toFixed(1)

  if (status === 'on_track') {
    return {
      headlineKey: 'forecast.headline.onTrack',
      detailKey:
        periodGap >= 0 ? 'forecast.detail.onTrackBuffer' : 'forecast.detail.onTrackMinor',
      detailParams: {
        periodGap: Math.abs(periodGap).toFixed(0),
        unit: unitTranslationKey,
        gap: gapValue,
        gapTodayKey,
      },
    }
  }

  if (status === 'at_risk') {
    return {
      headlineKey: 'forecast.headline.atRisk',
      detailKey: 'forecast.detail.atRisk',
      detailParams: {
        days: deviationDays,
        periodGap: Math.abs(periodGap).toFixed(0),
        unit: unitTranslationKey,
        gap: gapValue,
        gapTodayKey,
      },
    }
  }

  return {
    headlineKey: 'forecast.headline.delayed',
    detailKey: 'forecast.detail.delayed',
    detailParams: {
      days: deviationDays,
      periodGap: Math.abs(periodGap).toFixed(0),
      unit: unitTranslationKey,
      gap: gapValue,
      gapTodayKey,
    },
  }
}

export function computeProgressForecast(metrics: ProgressMetrics): ProgressForecast {
  const { scope, plannedToday, executedToday, unit } = metrics
  const dayProgressPct = computeDayProgressPct()
  const dayProgress = dayProgressPct / 100

  const expectedByNow = plannedToday * dayProgress
  const paceRatio =
    expectedByNow > 0 ? executedToday / expectedByNow : executedToday >= plannedToday ? 1 : 0

  const projectedEndOfDay =
    dayProgress > 0 ? Math.round((executedToday / dayProgress) * 10) / 10 : executedToday

  const endOfDayGap = Math.round((projectedEndOfDay - plannedToday) * 10) / 10

  const endTodayCumulative = scope.completedBeforeToday + projectedEndOfDay
  const remainingFullDays = Math.max(scope.periodRemainingDays - 1, 0)
  const projectedPeriodTotal = Math.round(
    endTodayCumulative + projectedEndOfDay * remainingFullDays,
  )
  const periodGap = projectedPeriodTotal - scope.totalUnits

  const dailyRate = estimateDailyRate(metrics, projectedEndOfDay)
  const deviationDays = periodGap < 0 ? Math.ceil(Math.abs(periodGap) / dailyRate) : 0

  const status = resolveStatus(endOfDayGap, periodGap, paceRatio)
  const messageKeys = buildMessageKeys(status, endOfDayGap, periodGap, deviationDays, unit)

  return {
    status,
    projectedEndOfDay,
    endOfDayGap,
    projectedPeriodTotal,
    periodGap,
    deviationDays,
    paceRatio: Math.round(paceRatio * 100) / 100,
    dayProgressPct,
    ...messageKeys,
  }
}

export function buildForecastChartData(metrics: ProgressMetrics, forecast: ProgressForecast) {
  const history = metrics.recentDaily.map((point) => ({
    date: point.date.slice(5),
    planned: point.planned,
    executed: point.executed,
    projected: null as number | null,
  }))

  return [
    ...history,
    {
      date: 'common.today',
      planned: metrics.plannedToday,
      executed: metrics.executedToday,
      projected: null as number | null,
    },
    {
      date: 'common.proj',
      planned: metrics.plannedToday,
      executed: null as number | null,
      projected: forecast.projectedEndOfDay,
    },
  ]
}

const forecastToExecutionStatus: Record<ProgressForecastStatus, ExecutionStatus> = {
  on_track: 'on_time',
  at_risk: 'delay_warning',
  delayed: 'critical_delay',
}

export interface SyncedExecutionView {
  forecast: ProgressForecast
  projection: ExecutionProjection
  detailKey: string
  detailParams: Record<string, string | number>
  workId: string
}

export function buildSyncedExecutionView(metrics: ProgressMetrics): SyncedExecutionView {
  const forecast = computeProgressForecast(metrics)
  const dailyRate = estimateDailyRate(metrics, forecast.projectedEndOfDay)
  const marginDays =
    forecast.periodGap >= 0
      ? Math.max(1, Math.floor(forecast.periodGap / Math.max(dailyRate, 0.5)))
      : -forecast.deviationDays

  return {
    forecast,
    projection: {
      status: forecastToExecutionStatus[forecast.status],
      messageKey: forecast.headlineKey,
      marginDays,
    },
    detailKey: forecast.detailKey,
    detailParams: forecast.detailParams,
    workId: metrics.workId,
  }
}

export function formatForecastDetail(
  t: (key: string, params?: Record<string, string | number>) => string,
  forecast: Pick<ProgressForecast, 'detailKey' | 'detailParams'>,
): string {
  const { gapTodayKey, gap, unit, ...rest } = forecast.detailParams
  const gapToday =
    typeof gapTodayKey === 'string' ? t(gapTodayKey, { gap, unit: t(unit as string) }) : ''
  const params = {
    ...rest,
    unit: t(unit as string),
    ...(gapToday ? { gapToday } : {}),
  }
  return t(forecast.detailKey, params)
}

export function formatForecastHeadline(
  t: (key: string, params?: Record<string, string | number>) => string,
  forecast: Pick<ProgressForecast, 'headlineKey'>,
): string {
  return t(forecast.headlineKey)
}
