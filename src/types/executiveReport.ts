import type { DegradationCurve } from './scada'

export type ExecutiveReportScope = 'work' | 'inspection'

export type DelayAlertSeverity = 'warning' | 'critical'

export interface WorkProgressBlock {
  plannedProgressPct: number
  actualProgressPct: number
  deviationPct: number
  delayAlert: string
  delayAlertSeverity: DelayAlertSeverity
}

export interface AnomalySummaryBlock {
  totalAnomalies: number
  thermalMaxC: number
  droneModel: string
  pendingReview: number
  inProgress: number
  resolved: number
  thermalHighlight?: string
}

export interface WearProjectionBlock {
  assetName: string
  wearRateHeadline: string
  criticalFailureDays: number
  projectionText: string
  actionLabel: string
  curve: DegradationCurve
}

export interface ExecutiveReportData {
  id: string
  scope: ExecutiveReportScope
  title: string
  subtitle: string
  workProgress: WorkProgressBlock
  anomalies: AnomalySummaryBlock
  wearProjection: WearProjectionBlock
}

export interface ExecutiveReportOption {
  id: string
  scope: ExecutiveReportScope
  label: string
  category: string
  lastUpdated: string
}
