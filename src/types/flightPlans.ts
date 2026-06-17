import type { FlightTime, WorkCategory } from './index'

export type WaypointAction = 'takeoff' | 'waypoint' | 'hover' | 'photo' | 'landing'
export type FlightPlanStatus = 'draft' | 'active' | 'completed'

export interface Waypoint {
  id: string
  order: number
  name: string
  lat: number
  lng: number
  altitudeM: number
  action: WaypointAction
}

export interface FlightPlan {
  id: string
  workId: string
  name: string
  scheduledAt: string
  flightTime: FlightTime
  status: FlightPlanStatus
  estimatedDurationMin: number
  waypoints: Waypoint[]
}

export interface WorkWithFlightPlans {
  workId: string
  workName: string
  category: WorkCategory
  plans: FlightPlan[]
}
