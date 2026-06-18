export type ScadaProtocol = 'opc-ua' | 'modbus-tcp' | 'iec-61850' | 'mqtt'

export type ScadaConnectionStatus = 'connected' | 'degraded' | 'disconnected'

export interface ScadaEndpoint {
  id: string
  name: string
  protocol: ScadaProtocol
  host: string
  status: ScadaConnectionStatus
  lastHeartbeat: string
  tagsCount: number
  latencyMs: number
}

export type SensorSignalType =
  | 'temperature'
  | 'vibration'
  | 'current'
  | 'voltage'
  | 'humidity'
  | 'partial_discharge'
  | 'oil_dga'

export type SensorTrend = 'rising' | 'stable' | 'falling'

export interface ScadaSensor {
  id: string
  tag: string
  name: string
  assetId: string
  assetName: string
  workId: string
  signalType: SensorSignalType
  unit: string
  currentValue: number
  thresholdWarning: number
  thresholdCritical: number
  trend: SensorTrend
  lastUpdate: string
  endpointId: string
}

export interface SensorTimeSeriesPoint {
  timestamp: string
  measured?: number
  projected?: number
}

export interface ImageSensorCorrelation {
  id: string
  detectionId: string
  detectionLabel: string
  inspectionLocation: string
  sensorId: string
  sensorName: string
  correlationScore: number
  insight: string
  capturedAt: string
}

export type WearAlarmSeverity = 'info' | 'warning' | 'critical'

export type WearAlarmStatus = 'active' | 'acknowledged' | 'resolved'

export interface EarlyWearAlarm {
  id: string
  title: string
  assetName: string
  workId: string
  severity: WearAlarmSeverity
  pattern: string
  imageEvidence: string
  sensorEvidence: string
  projectedImpactDate: string
  confidence: number
  status: WearAlarmStatus
  createdAt: string
}

export interface WearProjection {
  sensorId: string
  sensorName: string
  assetName: string
  unit: string
  series: SensorTimeSeriesPoint[]
  thresholdWarning: number
  thresholdCritical: number
  daysToWarning: number | null
  daysToCritical: number | null
  headline: string
  detail: string
}

export interface DegradationCurvePoint {
  timestamp: string
  droneTemp?: number
  scadaVoltage?: number
  projectedTemp?: number
}

export interface DegradationCurve {
  assetId: string
  assetName: string
  sensorId: string
  droneModel: string
  droneTempUnit: string
  scadaVoltageUnit: string
  criticalTempThreshold: number
  daysToCriticalFailure: number
  failureHeadline: string
  detail: string
  series: DegradationCurvePoint[]
}

export type StructuralRiskLevel = 'low' | 'moderate' | 'high' | 'critical'

export interface StructuralRiskZone {
  id: string
  label: string
  assetRef: string
  riskLevel: StructuralRiskLevel
  /** Centro normalizado 0–100 en el SVG */
  cx: number
  cy: number
  rx: number
  ry: number
  monthlyAccelerationPct: number
  detectionModel: string
  insight: string
}

export interface StructuralRiskMap {
  workId: string
  title: string
  subtitle: string
  zones: StructuralRiskZone[]
}

export interface PreventiveActionRecommendation {
  id: string
  assetName: string
  componentLabel: string
  failureProbability: number
  recommendation: string
  actionWindow: string
  estimatedLossUsd: number
  workId: string
  alarmId: string
  priority: WearAlarmSeverity
}
