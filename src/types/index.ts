export type {
  ExecutiveReportData,
  ExecutiveReportOption,
  ExecutiveReportScope,
  WorkProgressBlock,
  AnomalySummaryBlock,
  WearProjectionBlock,
} from './executiveReport'

export type SyncStatus = 'ok' | 'warning' | 'error'
export type ExecutionStatus = 'on_time' | 'delay_warning' | 'critical_delay'
export type DetectionStatus = 'pending' | 'confirmed' | 'dismissed'
export type TimelineLabel = 'before' | 'after' | 'repairCompleted'
export type FlightTime = 'diurnal' | 'nocturnal'
export type WorkCategory = 'construction' | 'powerline' | 'tower' | 'substation'

export interface ActiveWork {
  id: string
  name: string
  category: WorkCategory
  lastInspection: string
  nextFlightAt: string
  flightTime: FlightTime
  status: 'in_progress' | 'scheduled' | 'completed_today'
}

export interface DockSensorStatus {
  dockId: string
  dockName: string
  dockModel: string
  windSpeedKmh: number
  windStatus: 'normal' | 'elevated' | 'critical'
  rainMmH: number
  rainStatus: 'none' | 'light' | 'heavy'
  lastSync: string
  syncStatus: SyncStatus
}

export type DroneOperationalStatus = 'ready' | 'in_flight' | 'charging' | 'maintenance' | 'offline'

export interface DroneStatus {
  droneId: string
  droneName: string
  droneModel: string
  batteryPercent: number
  status: DroneOperationalStatus
  lastMission: string
}

export interface WorkFleetStatus {
  workId: string
  workName: string
  dock: DockSensorStatus
  drone: DroneStatus
}

export interface ProgressMetrics {
  workId: string
  category: WorkCategory
  plannedToday: number
  executedToday: number
  unit: string
  projectName: string
  lastInspection: string
  evidenceVideoUrl?: string
  scope: ProgressScope
  recentDaily: DailyProgressPoint[]
}

export interface ProgressScope {
  totalUnits: number
  completedBeforeToday: number
  periodRemainingDays: number
  periodEndDate: string
}

export interface DailyProgressPoint {
  date: string
  planned: number
  executed: number
}

export type ProgressForecastStatus = 'on_track' | 'at_risk' | 'delayed'

export interface ProgressForecast {
  status: ProgressForecastStatus
  projectedEndOfDay: number
  endOfDayGap: number
  projectedPeriodTotal: number
  periodGap: number
  deviationDays: number
  paceRatio: number
  dayProgressPct: number
  headlineKey: string
  detailKey: string
  detailParams: Record<string, string | number>
}

export interface ExecutionProjection {
  status: ExecutionStatus
  messageKey: string
  marginDays: number
}

export type FlightGanttKind = 'completed' | 'planned'

export interface FlightGanttEntry {
  id: string
  label: string
  startAt: string
  endAt: string
  kind: FlightGanttKind
}

export interface ProjectExecutionGantt {
  workId: string
  workName: string
  flights: FlightGanttEntry[]
}

export interface ExecutionGanttData {
  rangeStart: string
  rangeEnd: string
  projects: ProjectExecutionGantt[]
}

export interface Detection {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  confidence: number
  status: DetectionStatus
}

export interface InspectionSession {
  id: string
  visualImage: string
  thermalImage: string
  location: string
  capturedAt: string
  detections: Detection[]
}

export interface FailureNotificationOptions {
  emailTo: string
  slackEnabled: boolean
  slackWebhookUrl: string
  slackChannel: string
  includeImageInSlack: boolean
}

export interface NotificationChannelResult {
  ok: boolean
  message: string
}

export interface FailureNotificationResult {
  email: NotificationChannelResult
  slack?: NotificationChannelResult
}

export interface TimelineEntry {
  id: string
  date: string
  label: TimelineLabel
  title: string
  description: string
  image: string
  milestone: string
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface EndpointTrace {
  id: string
  timestamp: string
  method: HttpMethod
  endpoint: string
  statusCode: number
  durationMs: number
  correlationId: string
  origin: 'internal' | 'external'
  service: string
}

export interface EncryptionProfile {
  tlsVersion: string
  cipherSuite: string
  keyExchange: string
  certificateIssuer: string
  certificateExpiresAt: string
  dataAtRestAlgorithm: string
  keyStorage: string
  hashAlgorithm: string
  complianceNotes: string[]
}

export type UnauthorizedAccessSeverity = 'warning' | 'critical'

export interface UnauthorizedAccessAlert {
  id: string
  timestamp: string
  sourceIp: string
  sourceRegion: string
  targetEndpoint: string
  method: HttpMethod
  severity: UnauthorizedAccessSeverity
  blocked: boolean
  reason: string
  attempts: number
}
