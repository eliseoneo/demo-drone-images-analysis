import {
  earlyWearAlarms,
  scadaEndpoints,
  scadaSensors,
} from '../data/mocks/scadaIntegration'
import type { ScadaSensor, WearAlarmSeverity } from '../types/scada'

export type ScadaSensorStatus = 'ok' | 'warning' | 'critical'

export type ScadaAlertKind = 'wear_alarm' | 'sensor_threshold' | 'connector_degraded'

export type ScadaAlertSeverity = 'warning' | 'critical'

export interface ScadaDashboardAlert {
  id: string
  kind: ScadaAlertKind
  severity: ScadaAlertSeverity
  title: string
  subtitle: string
  workId?: string
  targetId: string
}

const severityRank: Record<ScadaAlertSeverity, number> = {
  critical: 0,
  warning: 1,
}

export function getSensorStatus(sensor: ScadaSensor): ScadaSensorStatus {
  if (sensor.signalType === 'voltage') {
    if (sensor.currentValue <= sensor.thresholdCritical) return 'critical'
    if (sensor.currentValue <= sensor.thresholdWarning) return 'warning'
    return 'ok'
  }

  if (sensor.currentValue >= sensor.thresholdCritical) return 'critical'
  if (sensor.currentValue >= sensor.thresholdWarning) return 'warning'
  return 'ok'
}

function isActionableWearSeverity(severity: WearAlarmSeverity): severity is ScadaAlertSeverity {
  return severity === 'warning' || severity === 'critical'
}

export function getScadaDashboardAlerts(): ScadaDashboardAlert[] {
  const alerts: ScadaDashboardAlert[] = []

  for (const alarm of earlyWearAlarms) {
    if (alarm.status === 'resolved' || !isActionableWearSeverity(alarm.severity)) continue

    alerts.push({
      id: `wear-${alarm.id}`,
      kind: 'wear_alarm',
      severity: alarm.severity,
      title: alarm.title,
      subtitle: alarm.sensorEvidence,
      workId: alarm.workId,
      targetId: alarm.id,
    })
  }

  for (const sensor of scadaSensors) {
    const status = getSensorStatus(sensor)
    if (status === 'ok') continue

    alerts.push({
      id: `sensor-${sensor.id}`,
      kind: 'sensor_threshold',
      severity: status,
      title: `${sensor.name} fuera de rango`,
      subtitle: `${sensor.currentValue} ${sensor.unit} — ${sensor.assetName}`,
      workId: sensor.workId,
      targetId: sensor.id,
    })
  }

  for (const endpoint of scadaEndpoints) {
    if (endpoint.status !== 'degraded') continue

    alerts.push({
      id: `connector-${endpoint.id}`,
      kind: 'connector_degraded',
      severity: 'warning',
      title: `Conector degradado: ${endpoint.name}`,
      subtitle: `Latencia ${endpoint.latencyMs} ms — último heartbeat retrasado`,
      targetId: endpoint.id,
    })
  }

  return alerts.sort((a, b) => severityRank[a.severity] - severityRank[b.severity])
}

export function hasScadaAlerts(): boolean {
  return getScadaDashboardAlerts().length > 0
}

export function getScadaAlertTone(alerts: ScadaDashboardAlert[]): 'warning' | 'critical' {
  return alerts.some((a) => a.severity === 'critical') ? 'critical' : 'warning'
}

export function buildScadaAlertPath(alert: ScadaDashboardAlert): string {
  const params = new URLSearchParams({ scrollTo: 'alarms' })
  if (alert.kind === 'wear_alarm') {
    params.set('alarmId', alert.targetId)
  } else if (alert.kind === 'sensor_threshold') {
    params.set('sensorId', alert.targetId)
    params.set('scrollTo', 'sensors')
  }
  return `/integracion-scada?${params.toString()}`
}
