import type {
  DegradationCurve,
  DegradationCurvePoint,
  EarlyWearAlarm,
  ImageSensorCorrelation,
  PreventiveActionRecommendation,
  ScadaEndpoint,
  ScadaSensor,
  StructuralRiskMap,
  WearProjection,
} from '../../types/scada'

export const scadaEndpoints: ScadaEndpoint[] = [
  {
    id: 'ep-001',
    name: 'scada.endpoints.ep-001.name',
    protocol: 'iec-61850',
    host: '10.20.1.12:102',
    status: 'connected',
    lastHeartbeat: '2026-06-18 09:42:11',
    tagsCount: 1842,
    latencyMs: 18,
  },
  {
    id: 'ep-002',
    name: 'scada.endpoints.ep-002.name',
    protocol: 'opc-ua',
    host: 'opcua://scada-l138n.corp.local:4840',
    status: 'connected',
    lastHeartbeat: '2026-06-18 09:42:09',
    tagsCount: 956,
    latencyMs: 24,
  },
  {
    id: 'ep-003',
    name: 'scada.endpoints.ep-003.name',
    protocol: 'modbus-tcp',
    host: '10.20.4.88:502',
    status: 'degraded',
    lastHeartbeat: '2026-06-18 09:38:44',
    tagsCount: 128,
    latencyMs: 142,
  },
  {
    id: 'ep-004',
    name: 'scada.endpoints.ep-004.name',
    protocol: 'mqtt',
    host: 'mqtt://iot-sur.corp.local:1883',
    status: 'connected',
    lastHeartbeat: '2026-06-18 09:42:10',
    tagsCount: 412,
    latencyMs: 31,
  },
]

export const scadaSensors: ScadaSensor[] = [
  {
    id: 'sen-001',
    tag: 'SUBN/T401/OIL_TEMP',
    name: 'scada.sensors.sen-001.name',
    assetId: 'asset-t401',
    assetName: 'scada.assets.t401',
    workId: 'work-002',
    signalType: 'temperature',
    unit: '°C',
    currentValue: 78.4,
    thresholdWarning: 75,
    thresholdCritical: 85,
    trend: 'rising',
    lastUpdate: '2026-06-18 09:41:55',
    endpointId: 'ep-001',
  },
  {
    id: 'sen-002',
    tag: 'SUBN/T401/WIND_VIB',
    name: 'scada.sensors.sen-002.name',
    assetId: 'asset-t401',
    assetName: 'scada.assets.t401',
    workId: 'work-002',
    signalType: 'vibration',
    unit: 'mm/s',
    currentValue: 4.2,
    thresholdWarning: 3.5,
    thresholdCritical: 5.0,
    trend: 'rising',
    lastUpdate: '2026-06-18 09:41:50',
    endpointId: 'ep-001',
  },
  {
    id: 'sen-003',
    tag: 'SUBN/T401/DGA_H2',
    name: 'scada.sensors.sen-003.name',
    assetId: 'asset-t401',
    assetName: 'scada.assets.t401',
    workId: 'work-002',
    signalType: 'oil_dga',
    unit: 'ppm',
    currentValue: 142,
    thresholdWarning: 120,
    thresholdCritical: 200,
    trend: 'rising',
    lastUpdate: '2026-06-18 09:00:00',
    endpointId: 'ep-001',
  },
  {
    id: 'sen-004',
    tag: 'L138N/T07/PD',
    name: 'scada.sensors.sen-004.name',
    assetId: 'asset-t07',
    assetName: 'scada.assets.t07',
    workId: 'work-001',
    signalType: 'partial_discharge',
    unit: 'pC',
    currentValue: 890,
    thresholdWarning: 600,
    thresholdCritical: 1200,
    trend: 'rising',
    lastUpdate: '2026-06-18 09:41:30',
    endpointId: 'ep-002',
  },
  {
    id: 'sen-005',
    tag: 'L138N/T07/LOAD_I',
    name: 'scada.sensors.sen-005.name',
    assetId: 'asset-t07',
    assetName: 'scada.assets.t07',
    workId: 'work-001',
    signalType: 'current',
    unit: 'A',
    currentValue: 312,
    thresholdWarning: 380,
    thresholdCritical: 420,
    trend: 'stable',
    lastUpdate: '2026-06-18 09:41:58',
    endpointId: 'ep-002',
  },
  {
    id: 'sen-006',
    tag: 'T14/ISO_HUM',
    name: 'scada.sensors.sen-006.name',
    assetId: 'asset-t14',
    assetName: 'scada.assets.t14',
    workId: 'work-003',
    signalType: 'humidity',
    unit: '%RH',
    currentValue: 68,
    thresholdWarning: 65,
    thresholdCritical: 80,
    trend: 'rising',
    lastUpdate: '2026-06-18 09:39:12',
    endpointId: 'ep-003',
  },
  {
    id: 'sen-007',
    tag: 'T14/ISO_VIB',
    name: 'scada.sensors.sen-007.name',
    assetId: 'asset-t14',
    assetName: 'scada.assets.t14',
    workId: 'work-003',
    signalType: 'vibration',
    unit: 'mm/s',
    currentValue: 2.1,
    thresholdWarning: 2.8,
    thresholdCritical: 4.0,
    trend: 'stable',
    lastUpdate: '2026-06-18 09:39:08',
    endpointId: 'ep-003',
  },
  {
    id: 'sen-008',
    tag: 'L69S/T22/BUSH_V',
    name: 'scada.sensors.sen-008.name',
    assetId: 'asset-t22',
    assetName: 'scada.assets.t22',
    workId: 'work-004',
    signalType: 'voltage',
    unit: 'kV',
    currentValue: 68.2,
    thresholdWarning: 66,
    thresholdCritical: 64,
    trend: 'falling',
    lastUpdate: '2026-06-18 09:41:45',
    endpointId: 'ep-004',
  },
]

export const imageSensorCorrelations: ImageSensorCorrelation[] = [
  {
    id: 'corr-001',
    detectionId: 'det-001',
    detectionLabel: 'scada.correlation.corr001.label',
    inspectionLocation: 'scada.correlation.corr001.location',
    sensorId: 'sen-001',
    sensorName: 'scada.sensors.sen-001.name',
    correlationScore: 0.91,
    insight: 'scada.correlation.corr001.insight',
    capturedAt: '2026-06-17 11:45',
  },
  {
    id: 'corr-002',
    detectionId: 'det-002',
    detectionLabel: 'scada.correlation.corr002.label',
    inspectionLocation: 'scada.correlation.corr001.location',
    sensorId: 'sen-002',
    sensorName: 'scada.sensors.sen-002.name',
    correlationScore: 0.74,
    insight: 'scada.correlation.corr002.insight',
    capturedAt: '2026-06-17 11:45',
  },
  {
    id: 'corr-003',
    detectionId: 'det-iso-014',
    detectionLabel: 'scada.correlation.corr003.label',
    inspectionLocation: 'scada.correlation.corr003.location',
    sensorId: 'sen-006',
    sensorName: 'scada.sensors.sen-006.name',
    correlationScore: 0.86,
    insight: 'scada.correlation.corr003.insight',
    capturedAt: '2026-06-16 22:10',
  },
  {
    id: 'corr-004',
    detectionId: 'det-pd-007',
    detectionLabel: 'scada.correlation.corr004.label',
    inspectionLocation: 'scada.correlation.corr004.location',
    sensorId: 'sen-004',
    sensorName: 'scada.sensors.sen-004.name',
    correlationScore: 0.88,
    insight: 'scada.correlation.corr004.insight',
    capturedAt: '2026-06-17 06:20',
  },
]

export const earlyWearAlarms: EarlyWearAlarm[] = [
  {
    id: 'alarm-001',
    title: 'scada.alarm.alarm001.title',
    assetName: 'scada.alarm.alarm001.asset',
    workId: 'work-002',
    severity: 'critical',
    pattern: 'thermal_wear',
    imageEvidence: 'scada.alarm.alarm001.imageEvidence',
    sensorEvidence: 'scada.alarm.alarm001.sensorEvidence',
    projectedImpactDate: '2026-07-02',
    confidence: 0.89,
    status: 'active',
    createdAt: '2026-06-18 08:15:00',
  },
  {
    id: 'alarm-002',
    title: 'scada.alarm.alarm002.title',
    assetName: 'scada.alarm.alarm002.asset',
    workId: 'work-003',
    severity: 'warning',
    pattern: 'insulator_contamination',
    imageEvidence: 'scada.alarm.alarm002.imageEvidence',
    sensorEvidence: 'scada.alarm.alarm002.sensorEvidence',
    projectedImpactDate: '2026-06-28',
    confidence: 0.82,
    status: 'active',
    createdAt: '2026-06-17 23:40:00',
  },
  {
    id: 'alarm-003',
    title: 'scada.alarm.alarm003.title',
    assetName: 'scada.alarm.alarm003.asset',
    workId: 'work-001',
    severity: 'warning',
    pattern: 'partial_discharge',
    imageEvidence: 'scada.alarm.alarm003.imageEvidence',
    sensorEvidence: 'scada.alarm.alarm003.sensorEvidence',
    projectedImpactDate: '2026-07-10',
    confidence: 0.85,
    status: 'acknowledged',
    createdAt: '2026-06-17 07:00:00',
  },
  {
    id: 'alarm-004',
    title: 'scada.alarm.alarm004.title',
    assetName: 'scada.alarm.alarm004.asset',
    workId: 'work-004',
    severity: 'info',
    pattern: 'bushing_degradation',
    imageEvidence: 'scada.alarm.alarm004.imageEvidence',
    sensorEvidence: 'scada.alarm.alarm004.sensorEvidence',
    projectedImpactDate: '2026-08-15',
    confidence: 0.67,
    status: 'active',
    createdAt: '2026-06-16 14:20:00',
  },
]

function buildSeries(
  base: number,
  dailyDrift: number,
  days: number,
  startDate: string,
  projectedFromDay: number,
): WearProjection['series'] {
  const start = new Date(startDate)
  const series: WearProjection['series'] = []

  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const label = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    const measured = Math.round((base + dailyDrift * i + Math.sin(i / 2) * 0.8) * 10) / 10

    if (i < projectedFromDay) {
      series.push({ timestamp: label, measured })
    } else if (i === projectedFromDay) {
      series.push({ timestamp: label, measured, projected: measured })
    } else {
      series.push({
        timestamp: label,
        projected: Math.round((base + dailyDrift * i + (i - projectedFromDay) * 0.3) * 10) / 10,
      })
    }
  }

  return series
}

export const wearProjections: WearProjection[] = [
  {
    sensorId: 'sen-001',
    sensorName: 'scada.sensors.sen-001.name',
    assetName: 'scada.assets.t401',
    unit: '°C',
    series: buildSeries(68, 0.85, 21, '2026-05-29', 14),
    thresholdWarning: 75,
    thresholdCritical: 85,
    daysToWarning: null,
    daysToCritical: 9,
    headline: 'scada.projection.sen001.headline',
    detail: 'scada.projection.sen001.detail',
  },
  {
    sensorId: 'sen-004',
    sensorName: 'scada.sensors.sen-004.name',
    assetName: 'scada.assets.t07',
    unit: 'pC',
    series: buildSeries(420, 28, 21, '2026-05-29', 14),
    thresholdWarning: 600,
    thresholdCritical: 1200,
    daysToWarning: 4,
    daysToCritical: 18,
    headline: 'scada.projection.sen004.headline',
    detail: 'scada.projection.sen004.detail',
  },
  {
    sensorId: 'sen-006',
    sensorName: 'scada.sensors.sen-006.name',
    assetName: 'scada.assets.t14',
    unit: '%RH',
    series: buildSeries(52, 0.55, 21, '2026-05-29', 14),
    thresholdWarning: 65,
    thresholdCritical: 80,
    daysToWarning: null,
    daysToCritical: 22,
    headline: 'scada.projection.sen006.headline',
    detail: 'scada.projection.sen006.detail',
  },
]

export function getSensorsForWork(workId: string): ScadaSensor[] {
  return scadaSensors.filter((s) => s.workId === workId)
}

export function getAlarmsForWork(workId: string): EarlyWearAlarm[] {
  return earlyWearAlarms.filter((a) => a.workId === workId)
}

export function getEndpointById(id: string): ScadaEndpoint | undefined {
  return scadaEndpoints.find((e) => e.id === id)
}

function buildDegradationSeries(
  startDate: string,
  historyDays: number,
  projectionDays: number,
): DegradationCurvePoint[] {
  const start = new Date(startDate)
  const series: DegradationCurvePoint[] = []

  for (let i = 0; i < historyDays + projectionDays; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const label = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    const isProjected = i >= historyDays

    const baseTemp = 38 + i * 1.35
    const spike = i % 5 === 0 ? 8 : i % 3 === 0 ? 4 : 0
    const droneTemp = Math.round((baseTemp + spike + Math.sin(i / 1.8) * 2.5) * 10) / 10

    const voltageBase = 69.4 - i * 0.04
    const voltageSpike = i % 4 === 0 ? -1.2 : i % 7 === 0 ? -0.8 : 0
    const scadaVoltage =
      Math.round((voltageBase + voltageSpike + Math.cos(i / 2.2) * 0.3) * 10) / 10

    if (!isProjected) {
      series.push({ timestamp: label, droneTemp, scadaVoltage })
    } else if (i === historyDays) {
      const last = series[series.length - 1]
      series.push({
        timestamp: label,
        droneTemp: last?.droneTemp,
        scadaVoltage: last?.scadaVoltage,
        projectedTemp: last?.droneTemp,
      })
    } else {
      const projectedTemp =
        Math.round((38 + i * 2.1 + (i - historyDays) * 0.45 + Math.sin(i / 2) * 1.5) * 10) / 10
      series.push({ timestamp: label, projectedTemp })
    }
  }

  return series
}

export const degradationCurve: DegradationCurve = {
  assetId: 'asset-t14',
  assetName: 'scada.degradation.asset.t14',
  sensorId: 'sen-006',
  droneModel: 'Matrice 3TD',
  droneTempUnit: '°C',
  scadaVoltageUnit: 'kV',
  criticalTempThreshold: 85,
  daysToCriticalFailure: 14,
  failureHeadline: 'scada.degradation.headline',
  detail: 'scada.degradation.detail',
  series: buildDegradationSeries('2026-05-25', 14, 14),
}

export const structuralRiskMap: StructuralRiskMap = {
  workId: 'work-003',
  title: 'scada.riskMap.title',
  subtitle: 'scada.riskMap.subtitle',
  zones: [
    {
      id: 'zone-t4-insulator',
      label: 'scada.risk.zone.t4.label',
      assetRef: 'T-4',
      riskLevel: 'critical',
      cx: 58,
      cy: 42,
      rx: 11,
      ry: 8,
      monthlyAccelerationPct: 34,
      detectionModel: 'YOLOv8 + SAM',
      insight: 'scada.risk.zone.t4.insight',
    },
    {
      id: 'zone-t4-joint',
      label: 'scada.risk.zone.joint.label',
      assetRef: 'T-4',
      riskLevel: 'high',
      cx: 72,
      cy: 38,
      rx: 9,
      ry: 6,
      monthlyAccelerationPct: 22,
      detectionModel: 'YOLOv8',
      insight: 'scada.risk.zone.joint.insight',
    },
    {
      id: 'zone-t3-crossarm',
      label: 'scada.risk.zone.crossarm.label',
      assetRef: 'T-3',
      riskLevel: 'moderate',
      cx: 38,
      cy: 48,
      rx: 10,
      ry: 7,
      monthlyAccelerationPct: 12,
      detectionModel: 'SAM',
      insight: 'scada.risk.zone.crossarm.insight',
    },
    {
      id: 'zone-t5-base',
      label: 'scada.risk.zone.base.label',
      assetRef: 'T-5',
      riskLevel: 'low',
      cx: 82,
      cy: 55,
      rx: 8,
      ry: 5,
      monthlyAccelerationPct: 3,
      detectionModel: 'YOLOv8',
      insight: 'scada.risk.zone.base.insight',
    },
  ],
}

export const preventiveAction: PreventiveActionRecommendation = {
  id: 'action-001',
  assetName: 'scada.preventive.asset',
  componentLabel: 'scada.preventive.component',
  failureProbability: 0.85,
  recommendation: 'scada.preventive.recommendation',
  actionWindow: 'scada.preventive.window',
  estimatedLossUsd: 50_000,
  workId: 'work-003',
  alarmId: 'alarm-002',
  priority: 'critical',
}
