export type SyncStatus = 'ok' | 'warning' | 'error'
export type ExecutionStatus = 'on_time' | 'delay_warning' | 'critical_delay'
export type DetectionStatus = 'pending' | 'confirmed' | 'dismissed'
export type TimelineLabel = 'Antes' | 'Después' | 'Reparación completada'
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
}

export interface ExecutionProjection {
  status: ExecutionStatus
  message: string
  marginDays: number
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

export interface TimelineEntry {
  id: string
  date: string
  label: TimelineLabel
  title: string
  description: string
  image: string
  milestone: string
}
