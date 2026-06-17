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

function buildMessages(
  status: ProgressForecastStatus,
  endOfDayGap: number,
  periodGap: number,
  deviationDays: number,
  unit: string,
): { headline: string; detail: string } {
  const gapToday =
    endOfDayGap >= 0
      ? `+${endOfDayGap.toFixed(1)} ${unit} sobre lo planificado hoy`
      : `${Math.abs(endOfDayGap).toFixed(1)} ${unit} por debajo del plan de hoy`

  if (status === 'on_track') {
    return {
      headline: 'Ritmo compatible con el cronograma',
      detail:
        periodGap >= 0
          ? `Proyección de cierre con ${periodGap.toFixed(0)} ${unit} de holgura. ${gapToday}.`
          : `Leve desviación acumulada (${Math.abs(periodGap).toFixed(0)} ${unit}), recuperable al mantener el ritmo actual. ${gapToday}.`,
    }
  }

  if (status === 'at_risk') {
    return {
      headline: 'Riesgo de desviación detectado',
      detail: `Si el ritmo no mejora, el cierre podría retrasarse ~${deviationDays} día(s). ${gapToday}; faltan ${Math.abs(periodGap).toFixed(0)} ${unit} vs. meta del periodo.`,
    }
  }

  return {
    headline: 'Desviación crítica proyectada',
    detail: `Se estima un retraso de ${deviationDays} día(s) respecto al cierre planificado. ${gapToday}; déficit acumulado proyectado: ${Math.abs(periodGap).toFixed(0)} ${unit}.`,
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
    dayProgress > 0
      ? Math.round((executedToday / dayProgress) * 10) / 10
      : executedToday

  const endOfDayGap = Math.round((projectedEndOfDay - plannedToday) * 10) / 10

  const endTodayCumulative = scope.completedBeforeToday + projectedEndOfDay
  const remainingFullDays = Math.max(scope.periodRemainingDays - 1, 0)
  const projectedPeriodTotal = Math.round(
    endTodayCumulative + projectedEndOfDay * remainingFullDays,
  )
  const periodGap = projectedPeriodTotal - scope.totalUnits

  const dailyRate = estimateDailyRate(metrics, projectedEndOfDay)
  const deviationDays =
    periodGap < 0 ? Math.ceil(Math.abs(periodGap) / dailyRate) : 0

  const status = resolveStatus(endOfDayGap, periodGap, paceRatio)
  const { headline, detail } = buildMessages(
    status,
    endOfDayGap,
    periodGap,
    deviationDays,
    unit,
  )

  return {
    status,
    projectedEndOfDay,
    endOfDayGap,
    projectedPeriodTotal,
    periodGap,
    deviationDays,
    paceRatio: Math.round(paceRatio * 100) / 100,
    dayProgressPct,
    headline,
    detail,
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
      date: 'Hoy',
      planned: metrics.plannedToday,
      executed: metrics.executedToday,
      projected: null as number | null,
    },
    {
      date: 'Proy.',
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
  detail: string
  projectName: string
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
      message: forecast.headline,
      marginDays,
    },
    detail: forecast.detail,
    projectName: metrics.projectName,
  }
}
