import type { WorkFleetStatus } from '../../types'

export const fleetByWorkId: Record<string, WorkFleetStatus> = {
  'work-001': {
    workId: 'work-001',
    workName: 'works.work-001.name',
    dock: {
      dockId: 'dock-001',
      dockName: 'docks.work-001.name',
      dockModel: 'DJI Dock 2',
      windSpeedKmh: 18,
      windStatus: 'normal',
      rainMmH: 0,
      rainStatus: 'none',
      lastSync: '2026-06-17 14:32',
      syncStatus: 'ok',
    },
    drone: {
      droneId: 'drone-001',
      droneName: 'M3TD-Norte-01',
      droneModel: 'Matrice 3TD',
      batteryPercent: 92,
      status: 'ready',
      lastMission: '2026-06-17 11:45',
    },
  },
  'work-002': {
    workId: 'work-002',
    workName: 'works.work-002.name',
    dock: {
      dockId: 'dock-002',
      dockName: 'docks.work-002.name',
      dockModel: 'DJI Dock 2',
      windSpeedKmh: 12,
      windStatus: 'normal',
      rainMmH: 0,
      rainStatus: 'none',
      lastSync: '2026-06-17 08:15',
      syncStatus: 'ok',
    },
    drone: {
      droneId: 'drone-002',
      droneName: 'M3TD-SubN-01',
      droneModel: 'Matrice 3TD',
      batteryPercent: 100,
      status: 'charging',
      lastMission: '2026-06-17 08:20',
    },
  },
  'work-003': {
    workId: 'work-003',
    workName: 'works.work-003.name',
    dock: {
      dockId: 'dock-003',
      dockName: 'docks.work-003.name',
      dockModel: 'DJI Dock 2',
      windSpeedKmh: 24,
      windStatus: 'elevated',
      rainMmH: 0,
      rainStatus: 'none',
      lastSync: '2026-06-16 22:05',
      syncStatus: 'warning',
    },
    drone: {
      droneId: 'drone-003',
      droneName: 'M3TD-T14-01',
      droneModel: 'Matrice 3TD',
      batteryPercent: 78,
      status: 'ready',
      lastMission: '2026-06-16 22:10',
    },
  },
  'work-004': {
    workId: 'work-004',
    workName: 'works.work-004.name',
    dock: {
      dockId: 'dock-004',
      dockName: 'docks.work-004.name',
      dockModel: 'DJI Dock 2',
      windSpeedKmh: 31,
      windStatus: 'elevated',
      rainMmH: 0.2,
      rainStatus: 'light',
      lastSync: '2026-06-17 15:20',
      syncStatus: 'ok',
    },
    drone: {
      droneId: 'drone-004',
      droneName: 'M4TD-Sur-01',
      droneModel: 'Matrice 4TD',
      batteryPercent: 64,
      status: 'in_flight',
      lastMission: '2026-06-16 03:35',
    },
  },
  'work-005': {
    workId: 'work-005',
    workName: 'works.work-005.name',
    dock: {
      dockId: 'dock-005',
      dockName: 'docks.work-005.name',
      dockModel: 'DJI Dock 2',
      windSpeedKmh: 9,
      windStatus: 'normal',
      rainMmH: 0,
      rainStatus: 'none',
      lastSync: '2026-06-14 09:10',
      syncStatus: 'ok',
    },
    drone: {
      droneId: 'drone-005',
      droneName: 'M30T-Este-01',
      droneModel: 'Matrice 30T',
      batteryPercent: 100,
      status: 'ready',
      lastMission: '2026-06-14 09:15',
    },
  },
  'work-006': {
    workId: 'work-006',
    workName: 'works.work-006.name',
    dock: {
      dockId: 'dock-006',
      dockName: 'docks.work-006.name',
      dockModel: 'DJI Dock 2',
      windSpeedKmh: 22,
      windStatus: 'normal',
      rainMmH: 0,
      rainStatus: 'none',
      lastSync: '2026-06-17 15:55',
      syncStatus: 'ok',
    },
    drone: {
      droneId: 'drone-006',
      droneName: 'M4TD-Obra-01',
      droneModel: 'Matrice 4TD',
      batteryPercent: 88,
      status: 'ready',
      lastMission: '2026-06-17 10:00',
    },
  },
}

export const allFleets = Object.values(fleetByWorkId)

export function getFleetForWork(workId: string): WorkFleetStatus | undefined {
  return fleetByWorkId[workId]
}

/** @deprecated Usar getFleetForWork con la obra seleccionada */
export const dockSensorStatus = fleetByWorkId['work-001'].dock
