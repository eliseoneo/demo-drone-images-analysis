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
  thermalHighlight: 'report.thermalHighlight',
}

const flagshipWorkProgress = {
  plannedProgressPct: 75,
  actualProgressPct: 63,
  deviationPct: -12,
  delayAlertDays: 4,
  delayAlertSeverity: 'warning' as const,
}

const transformador2Curve: typeof degradationCurve = {
  ...degradationCurve,
  assetId: 'asset-t402',
  assetName: 'report.assets.transformador2',
  failureHeadline: 'report.failureHeadline',
  detail: 'report.failureDetail.t401',
  daysToCriticalFailure: 14,
}

const transformador401Curve: typeof degradationCurve = {
  ...degradationCurve,
  assetId: 'asset-t401',
  assetName: 'report.assets.t401',
  failureHeadline: 'report.failureHeadline',
  detail: 'report.failureDetail.t401',
  daysToCriticalFailure: 14,
}

function buildWorkProgressFromMetrics(workId: string) {
  const metrics = progressMetricsByWorkId[workId]
  if (!metrics) {
    return {
      plannedProgressPct: 72,
      actualProgressPct: 60,
      deviationPct: -12,
      delayAlertDays: 4,
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
    delayAlertDays: delayDays,
    delayAlertSeverity: severity as 'warning' | 'critical',
  }
}

const executiveReportsById: Record<string, ExecutiveReportData> = {
  'work-001': {
    id: 'work-001',
    scope: 'work',
    title: 'works.work-001.name',
    subtitle: 'report.subtitle.active',
    workProgress: flagshipWorkProgress,
    anomalies: flagshipAnomalies,
    wearProjection: {
      assetName: 'report.assets.transformador2',
      wearRateHeadline: 'report.wearHeadline',
      criticalFailureDays: 14,
      projectionText: 'report.projectionText',
      actionLabel: 'report.actionLabel',
      curve: transformador2Curve,
    },
  },
  'work-002': {
    id: 'work-002',
    scope: 'work',
    title: 'works.work-002.name',
    subtitle: 'report.subtitle.completed',
    workProgress: buildWorkProgressFromMetrics('work-002'),
    anomalies: {
      ...flagshipAnomalies,
      totalAnomalies: 8,
      pendingReview: 3,
      inProgress: 4,
      resolved: 1,
    },
    wearProjection: {
      assetName: 'report.assets.t401',
      wearRateHeadline: 'report.work-002.wearHeadline',
      criticalFailureDays: 45,
      projectionText: 'report.work-002.projectionText',
      actionLabel: 'report.work-002.actionLabel',
      curve: {
        ...transformador2Curve,
        assetName: 'report.assets.t401',
        daysToCriticalFailure: 45,
        failureHeadline: 'report.work-002.failureHeadline',
      },
    },
  },
  'work-006': {
    id: 'work-006',
    scope: 'work',
    title: 'works.work-006.name',
    subtitle: 'report.work-006.subtitle',
    workProgress: buildWorkProgressFromMetrics('work-006'),
    anomalies: {
      ...flagshipAnomalies,
      totalAnomalies: 6,
      pendingReview: 4,
      inProgress: 2,
      resolved: 0,
    },
    wearProjection: {
      assetName: 'report.assets.bay3',
      wearRateHeadline: 'report.work-006.wearHeadline',
      criticalFailureDays: 28,
      projectionText: 'report.work-006.projectionText',
      actionLabel: 'report.work-006.actionLabel',
      curve: transformador2Curve,
    },
  },
  'insp-001': {
    id: 'insp-001',
    scope: 'inspection',
    title: 'inspections.insp-001.title',
    subtitle: 'inspections.insp-001.subtitle',
    workProgress: flagshipWorkProgress,
    anomalies: {
      totalAnomalies: 15,
      thermalMaxC: 187,
      droneModel: 'Matrice 3TD',
      pendingReview: 10,
      inProgress: 5,
      resolved: 0,
      thermalHighlight: 'report.insp-001.thermalHighlight',
    },
    wearProjection: {
      assetName: 'report.assets.t401',
      wearRateHeadline: 'report.wearHeadline',
      criticalFailureDays: 14,
      projectionText: 'report.projectionText',
      actionLabel: 'report.actionLabel',
      curve: transformador401Curve,
    },
  },
  'insp-002': {
    id: 'insp-002',
    scope: 'inspection',
    title: 'inspections.insp-002.title',
    subtitle: 'inspections.insp-002.subtitle',
    workProgress: buildWorkProgressFromMetrics('work-004'),
    anomalies: {
      ...flagshipAnomalies,
      totalAnomalies: 11,
      pendingReview: 7,
      inProgress: 3,
      resolved: 1,
    },
    wearProjection: {
      assetName: 'report.assets.insulatorT12',
      wearRateHeadline: 'report.insp-002.wearHeadline',
      criticalFailureDays: 21,
      projectionText: 'report.projectionText',
      actionLabel: 'report.actionLabel',
      curve: transformador2Curve,
    },
  },
  'insp-003': {
    id: 'insp-003',
    scope: 'inspection',
    title: 'inspections.insp-003.title',
    subtitle: 'inspections.insp-003.subtitle',
    workProgress: buildWorkProgressFromMetrics('work-003'),
    anomalies: {
      ...flagshipAnomalies,
      totalAnomalies: 9,
      pendingReview: 6,
      inProgress: 3,
      resolved: 0,
    },
    wearProjection: {
      assetName: 'report.assets.insulatorChainT4',
      wearRateHeadline: 'report.insp-003.wearHeadline',
      criticalFailureDays: 14,
      projectionText: 'report.projectionText',
      actionLabel: 'report.actionLabel',
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
      label: `works.${w.id}.name`,
      category: `report.category.${w.category}`,
      lastUpdated: w.lastInspection,
    })),
  {
    id: 'insp-001',
    scope: 'inspection',
    label: 'inspections.insp-001.label',
    category: 'report.category.substation',
    lastUpdated: '2026-06-17 11:45',
  },
  {
    id: 'insp-002',
    scope: 'inspection',
    label: 'inspections.insp-002.label',
    category: 'report.category.powerline',
    lastUpdated: '2026-06-16 03:35',
  },
  {
    id: 'insp-003',
    scope: 'inspection',
    label: 'inspections.insp-003.label',
    category: 'report.category.tower',
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
