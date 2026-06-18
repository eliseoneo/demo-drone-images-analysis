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
    name: 'SCADA Subestación Norte',
    protocol: 'iec-61850',
    host: '10.20.1.12:102',
    status: 'connected',
    lastHeartbeat: '2026-06-18 09:42:11',
    tagsCount: 1842,
    latencyMs: 18,
  },
  {
    id: 'ep-002',
    name: 'Historian Línea 138 kV',
    protocol: 'opc-ua',
    host: 'opcua://scada-l138n.corp.local:4840',
    status: 'connected',
    lastHeartbeat: '2026-06-18 09:42:09',
    tagsCount: 956,
    latencyMs: 24,
  },
  {
    id: 'ep-003',
    name: 'RTU Torre 14 — Modbus',
    protocol: 'modbus-tcp',
    host: '10.20.4.88:502',
    status: 'degraded',
    lastHeartbeat: '2026-06-18 09:38:44',
    tagsCount: 128,
    latencyMs: 142,
  },
  {
    id: 'ep-004',
    name: 'Broker MQTT Campo Sur',
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
    name: 'Temperatura aceite T-401',
    assetId: 'asset-t401',
    assetName: 'Transformador T-401',
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
    name: 'Vibración devanado HV',
    assetId: 'asset-t401',
    assetName: 'Transformador T-401',
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
    name: 'DGA — Hidrógeno disuelto',
    assetId: 'asset-t401',
    assetName: 'Transformador T-401',
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
    name: 'Descarga parcial — Aislador T07',
    assetId: 'asset-t07',
    assetName: 'Torre 07 — Línea 138 kV Norte',
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
    name: 'Corriente de línea T07',
    assetId: 'asset-t07',
    assetName: 'Torre 07 — Línea 138 kV Norte',
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
    name: 'Humedad en aisladores T14',
    assetId: 'asset-t14',
    assetName: 'Torre 14 — Aisladores',
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
    name: 'Vibración estructural T14',
    assetId: 'asset-t14',
    assetName: 'Torre 14 — Aisladores',
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
    name: 'Tensión bushing T22',
    assetId: 'asset-t22',
    assetName: 'Torre 22 — Línea 69 kV Sur',
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
    detectionLabel: 'Sobrecalentamiento en transformador',
    inspectionLocation: 'Transformador T-401 — Subestación Norte',
    sensorId: 'sen-001',
    sensorName: 'Temperatura aceite T-401',
    correlationScore: 0.91,
    insight:
      'El punto caliente térmico (+12 °C sobre ambiente) coincide con el incremento sostenido de temperatura de aceite SCADA en las últimas 72 h.',
    capturedAt: '2026-06-17 11:45',
  },
  {
    id: 'corr-002',
    detectionId: 'det-002',
    detectionLabel: 'Punto caliente en bushings',
    inspectionLocation: 'Transformador T-401 — Subestación Norte',
    sensorId: 'sen-002',
    sensorName: 'Vibración devanado HV',
    correlationScore: 0.74,
    insight:
      'La anomalía visual en bushings se alinea con vibración elevada; posible holgura mecánica o descarga interna incipiente.',
    capturedAt: '2026-06-17 11:45',
  },
  {
    id: 'corr-003',
    detectionId: 'det-iso-014',
    detectionLabel: 'Contaminación en cadena de aisladores',
    inspectionLocation: 'Torre 14 — Inspección de aisladores',
    sensorId: 'sen-006',
    sensorName: 'Humedad en aisladores T14',
    correlationScore: 0.86,
    insight:
      'Manchas de contaminación detectadas por visión correlacionan con humedad relativa elevada del RTU; riesgo de tracking superficial.',
    capturedAt: '2026-06-16 22:10',
  },
  {
    id: 'corr-004',
    detectionId: 'det-pd-007',
    detectionLabel: 'Corona visible en empalme',
    inspectionLocation: 'Torre 07 — Línea 138 kV Norte',
    sensorId: 'sen-004',
    sensorName: 'Descarga parcial — Aislador T07',
    correlationScore: 0.88,
    insight:
      'La corona en imagen RGB coincide con picos de descarga parcial del historian OPC-UA; patrón de desgaste dieléctrico acelerado.',
    capturedAt: '2026-06-17 06:20',
  },
]

export const earlyWearAlarms: EarlyWearAlarm[] = [
  {
    id: 'alarm-001',
    title: 'Desgaste térmico acelerado — T-401',
    assetName: 'Transformador T-401',
    workId: 'work-002',
    severity: 'critical',
    pattern: 'thermal_wear',
    imageEvidence: 'Sobrecalentamiento confirmado (+12 °C) en inspección 17/06',
    sensorEvidence: 'Temperatura aceite 78.4 °C y DGA H₂ en 142 ppm (tendencia +18 %/sem)',
    projectedImpactDate: '2026-07-02',
    confidence: 0.89,
    status: 'active',
    createdAt: '2026-06-18 08:15:00',
  },
  {
    id: 'alarm-002',
    title: 'Tracking superficial incipiente — Torre 14',
    assetName: 'Torre 14 — Aisladores',
    workId: 'work-003',
    severity: 'warning',
    pattern: 'insulator_contamination',
    imageEvidence: 'Contaminación y manchas en 3 discos de la cadena inferior',
    sensorEvidence: 'Humedad 68 %RH supera umbral; RTU Modbus con latencia degradada',
    projectedImpactDate: '2026-06-28',
    confidence: 0.82,
    status: 'active',
    createdAt: '2026-06-17 23:40:00',
  },
  {
    id: 'alarm-003',
    title: 'Descarga parcial en empalme — T07',
    assetName: 'Torre 07 — Línea 138 kV Norte',
    workId: 'work-001',
    severity: 'warning',
    pattern: 'partial_discharge',
    imageEvidence: 'Corona visible en empalme de conductor en vuelo nocturno',
    sensorEvidence: 'PD 890 pC con tendencia ascendente desde hace 5 días',
    projectedImpactDate: '2026-07-10',
    confidence: 0.85,
    status: 'acknowledged',
    createdAt: '2026-06-17 07:00:00',
  },
  {
    id: 'alarm-004',
    title: 'Degradación de bushing — T22',
    assetName: 'Torre 22 — Línea 69 kV Sur',
    workId: 'work-004',
    severity: 'info',
    pattern: 'bushing_degradation',
    imageEvidence: 'Sin hallazgo visual crítico; inspección programada',
    sensorEvidence: 'Tensión bushing 68.2 kV con tendencia descendente leve',
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
    sensorName: 'Temperatura aceite T-401',
    assetName: 'Transformador T-401',
    unit: '°C',
    series: buildSeries(68, 0.85, 21, '2026-05-29', 14),
    thresholdWarning: 75,
    thresholdCritical: 85,
    daysToWarning: null,
    daysToCritical: 9,
    headline: 'Umbral crítico proyectado en ~9 días',
    detail:
      'La fusión de datos térmicos de dron y SCADA indica un patrón de desgaste dieléctrico por sobrecarga térmica sostenida.',
  },
  {
    sensorId: 'sen-004',
    sensorName: 'Descarga parcial — Aislador T07',
    assetName: 'Torre 07 — Línea 138 kV Norte',
    unit: 'pC',
    series: buildSeries(420, 28, 21, '2026-05-29', 14),
    thresholdWarning: 600,
    thresholdCritical: 1200,
    daysToWarning: 4,
    daysToCritical: 18,
    headline: 'Cruce de umbral de advertencia en ~4 días',
    detail:
      'Correlación imagen-SCADA confirma descarga parcial activa; proyección lineal con estacionalidad de carga.',
  },
  {
    sensorId: 'sen-006',
    sensorName: 'Humedad en aisladores T14',
    assetName: 'Torre 14 — Aisladores',
    unit: '%RH',
    series: buildSeries(52, 0.55, 21, '2026-05-29', 14),
    thresholdWarning: 65,
    thresholdCritical: 80,
    daysToWarning: null,
    daysToCritical: 22,
    headline: 'Humedad sobre umbral de advertencia',
    detail:
      'Patrón de contaminación + humedad elevada sugiere ventana de mantenimiento preventivo antes de temporada lluviosa.',
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
  assetName: 'Torre 14 — Línea 138 kV Norte',
  sensorId: 'sen-006',
  droneModel: 'Matrice 3TD',
  droneTempUnit: '°C',
  scadaVoltageUnit: 'kV',
  criticalTempThreshold: 85,
  daysToCriticalFailure: 14,
  failureHeadline: 'Falla crítica proyectada en 14 días',
  detail:
    'Fusión de historial térmico del dron (hasta 500 °C) con picos de tensión SCADA en la cadena de aisladores T-4. La tendencia proyectada cruza el umbral crítico.',
  series: buildDegradationSeries('2026-05-25', 14, 14),
}

export const structuralRiskMap: StructuralRiskMap = {
  workId: 'work-003',
  title: 'Mapa de riesgo estructural',
  subtitle: 'Línea 138 kV Norte — Torre 14 · segmento aislador T-4',
  zones: [
    {
      id: 'zone-t4-insulator',
      label: 'Aislador T-4 — microfisuras',
      assetRef: 'T-4',
      riskLevel: 'critical',
      cx: 58,
      cy: 42,
      rx: 11,
      ry: 8,
      monthlyAccelerationPct: 34,
      detectionModel: 'YOLOv8 + SAM',
      insight: 'Segmentación confirma propagación de fisuras en disco inferior; aceleración +34 % mes a mes.',
    },
    {
      id: 'zone-t4-joint',
      label: 'Empalme conductor — estrés mecánico',
      assetRef: 'T-4',
      riskLevel: 'high',
      cx: 72,
      cy: 38,
      rx: 9,
      ry: 6,
      monthlyAccelerationPct: 22,
      detectionModel: 'YOLOv8',
      insight: 'Deformación visible en grapa de retención correlacionada con vibración SCADA intermitente.',
    },
    {
      id: 'zone-t3-crossarm',
      label: 'Cruceta — humedad acumulada',
      assetRef: 'T-3',
      riskLevel: 'moderate',
      cx: 38,
      cy: 48,
      rx: 10,
      ry: 7,
      monthlyAccelerationPct: 12,
      detectionModel: 'SAM',
      insight: 'Zona de tracking superficial incipiente; riesgo moderado con tendencia ascendente.',
    },
    {
      id: 'zone-t5-base',
      label: 'Base torre — sin anomalía crítica',
      assetRef: 'T-5',
      riskLevel: 'low',
      cx: 82,
      cy: 55,
      rx: 8,
      ry: 5,
      monthlyAccelerationPct: 3,
      detectionModel: 'YOLOv8',
      insight: 'Estructura estable; monitoreo de rutina.',
    },
  ],
}

export const preventiveAction: PreventiveActionRecommendation = {
  id: 'action-001',
  assetName: 'Torre 14 — Línea 138 kV Norte',
  componentLabel: 'Aislador T-4',
  failureProbability: 0.85,
  recommendation:
    'Generar orden de mantenimiento preventivo para esta semana y programar reemplazo de cadena inferior antes del cruce de umbral crítico.',
  actionWindow: 'Esta semana',
  estimatedLossUsd: 50_000,
  workId: 'work-003',
  alarmId: 'alarm-002',
  priority: 'critical',
}
