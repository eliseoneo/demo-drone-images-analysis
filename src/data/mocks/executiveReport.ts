import type {
  ExecutiveReportData,
  ExecutiveReportOption,
} from '../../types/executiveReport'
import { activeWorks, progressMetricsByWorkId } from './progress'
import { computeProgressForecast } from '../../utils/progressForecast'
import { degradationCurve } from './scadaIntegration'

const flagshipAnomalies = {
  totalAnomalies: 15,
  thermalMaxC: 145,
  droneModel: 'Matrice 3TD',
  pendingReview: 10,
  inProgress: 5,
  resolved: 0,
  thermalHighlight: '3 alertas térmicas > 120 °C en bushings y devanados',
}

const flagshipWorkProgress = {
  plannedProgressPct: 75,
  actualProgressPct: 63,
  deviationPct: -12,
  delayAlert: 'Alerta: Retraso estimado de 4 días operativos',
  delayAlertSeverity: 'warning' as const,
}

const transformador2Curve: typeof degradationCurve = {
  ...degradationCurve,
  assetId: 'asset-t402',
  assetName: 'Transformador 2 — Subestación Norte',
  failureHeadline: 'Falla crítica estimada en 14 días',
  detail:
    'Correlación del pico térmico detectado en vuelo con tendencia SCADA de aceite y DGA. La curva proyectada cruza el umbral crítico de degradación.',
  daysToCriticalFailure: 14,
}

const transformador401Curve: typeof degradationCurve = {
  ...degradationCurve,
  assetId: 'asset-t401',
  assetName: 'Transformador T-401 — Subestación Norte',
  failureHeadline: 'Falla crítica estimada en 14 días',
  detail:
    'Correlación del pico térmico detectado en vuelo (187 °C, devanado HV) con tendencia SCADA de aceite y DGA. La curva proyectada cruza el umbral crítico.',
  daysToCriticalFailure: 14,
}

function buildWorkProgressFromMetrics(workId: string) {
  const metrics = progressMetricsByWorkId[workId]
  if (!metrics) {
    return {
      plannedProgressPct: 72,
      actualProgressPct: 60,
      deviationPct: -12,
      delayAlert: 'Alerta: Retraso estimado de 4 días operativos',
      delayAlertSeverity: 'warning' as const,
    }
  }

  const forecast = computeProgressForecast(metrics)
  const { scope, plannedToday, executedToday } = metrics
  const plannedCumulative = scope.completedBeforeToday + plannedToday
  const actualCumulative = scope.completedBeforeToday + executedToday
  const plannedPct = Math.round((plannedCumulative / scope.totalUnits) * 100)
  const actualPct = Math.round((actualCumulative / scope.totalUnits) * 100)
  const deviationPct = actualPct - plannedPct

  const delayDays = forecast.deviationDays || 4
  const severity = forecast.status === 'delayed' ? 'critical' : 'warning'

  return {
    plannedProgressPct: plannedPct,
    actualProgressPct: actualPct,
    deviationPct,
    delayAlert: `Alerta: Retraso estimado de ${delayDays} día${delayDays === 1 ? '' : 's'} operativo${delayDays === 1 ? '' : 's'}`,
    delayAlertSeverity: severity as 'warning' | 'critical',
  }
}

const executiveReportsById: Record<string, ExecutiveReportData> = {
  'work-001': {
    id: 'work-001',
    scope: 'work',
    title: 'Línea 138 kV — Tramo Norte',
    subtitle: 'Obra activa · Inspección aérea diurna',
    workProgress: flagshipWorkProgress,
    anomalies: flagshipAnomalies,
    wearProjection: {
      assetName: 'Transformador 2',
      wearRateHeadline: 'Tasa de desgaste acelerada en Transformador 2',
      criticalFailureDays: 14,
      projectionText: 'Falla crítica estimada en 14 días.',
      actionLabel: 'Generar orden de mantenimiento',
      curve: transformador2Curve,
    },
  },
  'work-002': {
    id: 'work-002',
    scope: 'work',
    title: 'Subestación Norte — Transformador T-401',
    subtitle: 'Obra completada hoy · Activos críticos',
    workProgress: buildWorkProgressFromMetrics('work-002'),
    anomalies: {
      ...flagshipAnomalies,
      totalAnomalies: 8,
      pendingReview: 3,
      inProgress: 4,
      resolved: 1,
    },
    wearProjection: {
      assetName: 'Transformador T-401',
      wearRateHeadline: 'Estabilización post-intervención en T-401',
      criticalFailureDays: 45,
      projectionText: 'Sin cruce de umbral crítico en ventana de 45 días.',
      actionLabel: 'Monitoreo de rutina',
      curve: {
        ...transformador2Curve,
        assetName: 'Transformador T-401',
        daysToCriticalFailure: 45,
        failureHeadline: 'Riesgo controlado — seguimiento trimestral',
      },
    },
  },
  'work-006': {
    id: 'work-006',
    scope: 'work',
    title: 'Obra Subestación Nueva — Montaje estructuras',
    subtitle: 'Construcción · Supervisión visual de avance',
    workProgress: buildWorkProgressFromMetrics('work-006'),
    anomalies: {
      ...flagshipAnomalies,
      totalAnomalies: 6,
      pendingReview: 4,
      inProgress: 2,
      resolved: 0,
    },
    wearProjection: {
      assetName: 'Estructura bay 3',
      wearRateHeadline: 'Desgaste estructural incipiente en montaje',
      criticalFailureDays: 28,
      projectionText: 'Revisión estructural recomendada en 28 días.',
      actionLabel: 'Programar inspección de campo',
      curve: transformador2Curve,
    },
  },
  'insp-001': {
    id: 'insp-001',
    scope: 'inspection',
    title: 'Inspección térmica — Transformador T-401',
    subtitle: '2026-06-17 11:45 · Subestación Norte',
    workProgress: flagshipWorkProgress,
    anomalies: {
      totalAnomalies: 15,
      thermalMaxC: 187,
      droneModel: 'Matrice 3TD',
      pendingReview: 10,
      inProgress: 5,
      resolved: 0,
      thermalHighlight: 'Pico térmico 187 °C en devanado HV (sensor dron)',
    },
    wearProjection: {
      assetName: 'Transformador T-401',
      wearRateHeadline: 'Tasa de desgaste acelerada en Transformador T-401',
      criticalFailureDays: 14,
      projectionText: 'Falla crítica estimada en 14 días.',
      actionLabel: 'Generar orden de mantenimiento',
      curve: transformador401Curve,
    },
  },
  'insp-002': {
    id: 'insp-002',
    scope: 'inspection',
    title: 'Inspección nocturna — Línea 69 kV Sur',
    subtitle: '2026-06-16 03:35 · Corredor tramo 12–18',
    workProgress: buildWorkProgressFromMetrics('work-004'),
    anomalies: {
      ...flagshipAnomalies,
      totalAnomalies: 11,
      pendingReview: 7,
      inProgress: 3,
      resolved: 1,
    },
    wearProjection: {
      assetName: 'Aislador T-12',
      wearRateHeadline: 'Microfisuras con propagación acelerada',
      criticalFailureDays: 21,
      projectionText: 'Falla crítica estimada en 21 días.',
      actionLabel: 'Generar orden de mantenimiento',
      curve: transformador2Curve,
    },
  },
  'insp-003': {
    id: 'insp-003',
    scope: 'inspection',
    title: 'Inspección torre 14 — Aisladores',
    subtitle: '2026-06-16 22:10 · Línea 138 kV Norte',
    workProgress: buildWorkProgressFromMetrics('work-003'),
    anomalies: {
      ...flagshipAnomalies,
      totalAnomalies: 9,
      pendingReview: 6,
      inProgress: 3,
      resolved: 0,
    },
    wearProjection: {
      assetName: 'Cadena aislador T-4',
      wearRateHeadline: 'Degradación dieléctrica acelerada',
      criticalFailureDays: 14,
      projectionText: 'Falla crítica estimada en 14 días.',
      actionLabel: 'Generar orden de mantenimiento',
      curve: degradationCurve,
    },
  },
}

export const executiveReportOptions: ExecutiveReportOption[] = [
  ...activeWorks
    .filter((w) => executiveReportsById[w.id])
    .map((w) => ({
      id: w.id,
      scope: 'work' as const,
      label: w.name,
      category: w.category === 'construction' ? 'Construcción' : 'Infraestructura',
      lastUpdated: w.lastInspection,
    })),
  {
    id: 'insp-001',
    scope: 'inspection',
    label: 'Transformador T-401 — Térmica',
    category: 'Subestación',
    lastUpdated: '2026-06-17 11:45',
  },
  {
    id: 'insp-002',
    scope: 'inspection',
    label: 'Línea 69 kV Sur — Nocturna',
    category: 'Línea de transmisión',
    lastUpdated: '2026-06-16 03:35',
  },
  {
    id: 'insp-003',
    scope: 'inspection',
    label: 'Torre 14 — Aisladores',
    category: 'Torre',
    lastUpdated: '2026-06-16 22:10',
  },
]

export const defaultExecutiveReportId = 'work-001'

export function getExecutiveReportData(id: string): ExecutiveReportData | undefined {
  return executiveReportsById[id]
}

export function getExecutiveReportOptions(scope: 'work' | 'inspection'): ExecutiveReportOption[] {
  return executiveReportOptions.filter((o) => o.scope === scope)
}
