import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  Cable,
  CheckCircle2,
  ImageIcon,
  Link2,
  Radio,
  Server,
  TrendingUp,
  Wifi,
  WifiOff,
} from 'lucide-react'
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  degradationCurve,
  earlyWearAlarms,
  getEndpointById,
  imageSensorCorrelations,
  preventiveAction,
  scadaEndpoints,
  scadaSensors,
  structuralRiskMap,
  wearProjections,
} from '../data/mocks/scadaIntegration'
import type {
  EarlyWearAlarm,
  ScadaConnectionStatus,
  ScadaEndpoint,
  ScadaProtocol,
  ScadaSensor,
  SensorSignalType,
  WearAlarmSeverity,
} from '../types/scada'
import { getSensorStatus } from '../utils/scadaAlerts'
import { PreventiveActionCard } from '../components/scada/PreventiveActionCard'
import { DegradationCurveChart } from '../components/scada/DegradationCurveChart'
import { StructuralRiskMap } from '../components/scada/StructuralRiskMap'
import { useLanguage } from '../context/LanguageContext'
import { formatDateTime, formatNumber } from '../i18n/format'

const protocolLabels: Record<ScadaProtocol, string> = {
  'opc-ua': 'OPC-UA',
  'modbus-tcp': 'Modbus TCP',
  'iec-61850': 'IEC 61850',
  mqtt: 'MQTT',
}

const connectionStyles: Record<ScadaConnectionStatus, { dot: string; badge: string }> = {
  connected: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  degraded: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  disconnected: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 ring-rose-200',
  },
}

const connectionLabelKey: Record<ScadaConnectionStatus, string> = {
  connected: 'common.connected',
  degraded: 'common.degraded',
  disconnected: 'common.disconnected',
}

const signalTypeKeys: Record<SensorSignalType, string> = {
  temperature: 'scada.signalTypes.temperature',
  vibration: 'scada.signalTypes.vibration',
  current: 'scada.signalTypes.current',
  voltage: 'scada.signalTypes.voltage',
  humidity: 'scada.signalTypes.humidity',
  partial_discharge: 'scada.signalTypes.partial_discharge',
  oil_dga: 'scada.signalTypes.oil_dga',
}

const alarmSeverityStyles: Record<
  WearAlarmSeverity,
  { banner: string; badge: string; labelKey: string }
> = {
  critical: {
    banner: 'border-rose-200 bg-rose-50',
    badge: 'bg-rose-100 text-rose-800 ring-rose-200',
    labelKey: 'common.critical',
  },
  warning: {
    banner: 'border-amber-200 bg-amber-50',
    badge: 'bg-amber-100 text-amber-800 ring-amber-200',
    labelKey: 'common.warning',
  },
  info: {
    banner: 'border-sky-200 bg-sky-50',
    badge: 'bg-sky-100 text-sky-800 ring-sky-200',
    labelKey: 'common.info',
  },
}

const trendStyles = {
  rising: { key: 'scada.trendLabels.rising', color: 'text-rose-600' },
  stable: { key: 'scada.trendLabels.stable', color: 'text-slate-600' },
  falling: { key: 'scada.trendLabels.falling', color: 'text-sky-600' },
}

const alarmStatusKeys: Record<EarlyWearAlarm['status'], string> = {
  active: 'scada.status.active',
  acknowledged: 'scada.status.acknowledged',
  resolved: 'scada.status.resolved',
}

function selectPlural(text: string, count: number): string {
  const [singular, plural] = text.split('|').map((part) => part.trim())
  return count === 1 ? singular : (plural ?? singular)
}

function SensorValueCell({ sensor }: { sensor: ScadaSensor }) {
  const status = getSensorStatus(sensor)
  const color =
    status === 'critical' ? 'text-rose-600' : status === 'warning' ? 'text-amber-600' : 'text-slate-800'

  return (
    <span className={`font-mono font-semibold ${color}`}>
      {sensor.currentValue} {sensor.unit}
    </span>
  )
}

export function ScadaIntegration() {
  const { t, tm, language } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedProjectionId, setSelectedProjectionId] = useState(wearProjections[0].sensorId)
  const [highlightedAlarmId, setHighlightedAlarmId] = useState<string | null>(null)
  const [highlightedSensorId, setHighlightedSensorId] = useState<string | null>(null)
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null)

  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo')
    const alarmId = searchParams.get('alarmId')
    const sensorId = searchParams.get('sensorId')

    if (sensorId) {
      setHighlightedSensorId(sensorId)
    }
    if (alarmId) {
      setHighlightedAlarmId(alarmId)
    }

    const targetId =
      scrollTo === 'sensors'
        ? sensorId
          ? `scada-sensor-${sensorId}`
          : 'scada-sensors'
        : scrollTo === 'alarms'
          ? alarmId
            ? `scada-alarm-${alarmId}`
            : 'scada-alarms'
          : scrollTo === 'projections'
            ? 'scada-projections'
            : scrollTo === 'fusion'
              ? 'scada-fusion'
              : scrollTo === 'preventive'
                ? 'scada-preventive'
                : null

    if (targetId) {
      requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }

    if (scrollTo || alarmId || sensorId) {
      const next = new URLSearchParams(searchParams)
      next.delete('scrollTo')
      next.delete('alarmId')
      next.delete('sensorId')
      setSearchParams(next, { replace: true })
    }

    if (alarmId || sensorId) {
      const timer = window.setTimeout(() => {
        setHighlightedAlarmId(null)
        setHighlightedSensorId(null)
      }, 4000)
      return () => window.clearTimeout(timer)
    }
  }, [searchParams, setSearchParams])

  const activeAlarms = earlyWearAlarms.filter((alarm) => alarm.status === 'active')
  const criticalCount = activeAlarms.filter((alarm) => alarm.severity === 'critical').length
  const selectedProjection = useMemo(
    () => wearProjections.find((projection) => projection.sensorId === selectedProjectionId) ?? wearProjections[0],
    [selectedProjectionId],
  )

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">{t('scada.title')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('scada.subtitle')}</p>
      </header>

      {criticalCount > 0 && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div>
            <p className="font-semibold">
              {selectPlural(t('scada.criticalAlarmsBanner', { count: criticalCount }), criticalCount)}
            </p>
            <p className="mt-0.5 text-rose-800/80">{t('scada.criticalAlarmsDetail')}</p>
          </div>
        </div>
      )}

      <div id="scada-preventive">
        <PreventiveActionCard
          action={preventiveAction}
          onGenerateOrder={() => {
            setOrderFeedback(
              t('scada.preventiveOrderFeedback', {
                component: tm(preventiveAction.componentLabel),
                window: tm(preventiveAction.actionWindow),
              }),
            )
            window.setTimeout(() => setOrderFeedback(null), 5000)
          }}
        />
        {orderFeedback && (
          <p
            role="status"
            className="mt-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800"
          >
            {orderFeedback}
          </p>
        )}
      </div>

      <section id="scada-fusion" className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <DegradationCurveChart curve={degradationCurve} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <StructuralRiskMap map={structuralRiskMap} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-slate-800">{t('scada.connectors')}</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {t('common.simulation')}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {scadaEndpoints.map((endpoint) => (
            <EndpointCard key={endpoint.id} endpoint={endpoint} />
          ))}
        </div>
      </section>

      <section id="scada-sensors" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-800">{t('scada.realtimeSensors')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4">{t('scada.table.scadaTag')}</th>
                <th className="pb-3 pr-4">{t('scada.table.asset')}</th>
                <th className="pb-3 pr-4">{t('scada.table.signal')}</th>
                <th className="pb-3 pr-4">{t('scada.table.currentValue')}</th>
                <th className="pb-3 pr-4">{t('scada.table.thresholds')}</th>
                <th className="pb-3 pr-4">{t('scada.table.trend')}</th>
                <th className="pb-3 pr-4">{t('scada.table.connector')}</th>
                <th className="pb-3">{t('scada.table.lastReading')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scadaSensors.map((sensor) => {
                const endpoint = getEndpointById(sensor.endpointId)
                const trend = trendStyles[sensor.trend]
                return (
                  <tr
                    key={sensor.id}
                    id={`scada-sensor-${sensor.id}`}
                    className={`text-slate-700 transition-colors ${
                      highlightedSensorId === sensor.id ? 'bg-amber-50 ring-2 ring-inset ring-amber-300' : ''
                    }`}
                  >
                    <td className="py-3 pr-4">
                      <span className="font-mono text-xs text-slate-800">{sensor.tag}</span>
                      <p className="mt-0.5 text-xs text-slate-500">{tm(sensor.name)}</p>
                    </td>
                    <td className="py-3 pr-4 font-medium text-slate-800">{tm(sensor.assetName)}</td>
                    <td className="py-3 pr-4 text-xs">{t(signalTypeKeys[sensor.signalType])}</td>
                    <td className="py-3 pr-4">
                      <SensorValueCell sensor={sensor} />
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-500">
                      <span className="text-amber-600">{sensor.thresholdWarning}</span>
                      {' / '}
                      <span className="text-rose-600">{sensor.thresholdCritical}</span> {sensor.unit}
                    </td>
                    <td className={`py-3 pr-4 text-xs font-medium ${trend.color}`}>{t(trend.key)}</td>
                    <td className="py-3 pr-4 text-xs text-slate-600">
                      {endpoint ? protocolLabels[endpoint.protocol] : '-'}
                    </td>
                    <td className="py-3 text-xs whitespace-nowrap text-slate-500">
                      {formatDateTime(sensor.lastUpdate, language)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Link2 className="h-5 w-5 text-violet-600" />
          <h2 className="text-lg font-semibold text-slate-800">{t('scada.imageSensorCorrelation')}</h2>
        </div>
        <div className="space-y-3">
          {imageSensorCorrelations.map((correlation) => (
            <div
              key={correlation.id}
              className="rounded-lg border border-violet-100 bg-violet-50/50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <ImageIcon className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                  <div>
                    <p className="font-medium text-slate-800">{tm(correlation.detectionLabel)}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{tm(correlation.inspectionLocation)}</p>
                  </div>
                </div>
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-800 ring-1 ring-violet-200">
                  {t('scada.correlationScore', {
                    score: (correlation.correlationScore * 100).toFixed(0),
                  })}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                <Cable className="h-3.5 w-3.5 text-teal-600" />
                <span>
                  {t('scada.linkedSensor')}: <strong>{tm(correlation.sensorName)}</strong>
                </span>
                <span className="text-slate-400">-</span>
                <span>{formatDateTime(correlation.capturedAt, language)}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{tm(correlation.insight)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="scada-alarms" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-slate-800">{t('scada.earlyWearAlarms')}</h2>
        </div>
        <div className="space-y-3">
          {earlyWearAlarms.map((alarm) => (
            <div key={alarm.id} id={`scada-alarm-${alarm.id}`}>
              <WearAlarmCard alarm={alarm} highlighted={highlightedAlarmId === alarm.id} />
            </div>
          ))}
        </div>
      </section>

      <section id="scada-projections" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-slate-800">{t('scada.wearProjections')}</h2>
          </div>
          <select
            value={selectedProjectionId}
            onChange={(event) => setSelectedProjectionId(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
          >
            {wearProjections.map((projection) => (
              <option key={projection.sensorId} value={projection.sensorId}>
                {tm(projection.sensorName)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 rounded-lg border border-sky-100 bg-sky-50 p-3">
          <p className="text-sm font-medium text-sky-900">{tm(selectedProjection.headline)}</p>
          <p className="mt-1 text-sm text-sky-800/80">{tm(selectedProjection.detail)}</p>
          <dl className="mt-2 flex flex-wrap gap-4 text-xs text-sky-800">
            {selectedProjection.daysToWarning !== null && (
              <div>
                <dt className="text-sky-600">{t('scada.daysToWarning')}</dt>
                <dd className="font-semibold">{selectedProjection.daysToWarning}</dd>
              </div>
            )}
            {selectedProjection.daysToCritical !== null && (
              <div>
                <dt className="text-sky-600">{t('scada.daysToCritical')}</dt>
                <dd className="font-semibold">{selectedProjection.daysToCritical}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={selectedProjection.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" unit={` ${selectedProjection.unit}`} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                formatter={(value, name) => [
                  value != null ? `${value} ${selectedProjection.unit}` : '-',
                  name === 'measured'
                    ? t('scada.projectionChart.measured')
                    : t('scada.projectionChart.projected'),
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) =>
                  value === 'measured'
                    ? t('scada.projectionChart.measuredScada')
                    : t('scada.projectionChart.projection')
                }
              />
              <ReferenceLine
                y={selectedProjection.thresholdWarning}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{ value: t('scada.projectionChart.warning'), position: 'insideTopRight', fontSize: 10, fill: '#d97706' }}
              />
              <ReferenceLine
                y={selectedProjection.thresholdCritical}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{ value: t('scada.projectionChart.critical'), position: 'insideTopRight', fontSize: 10, fill: '#e11d48' }}
              />
              <Line
                type="monotone"
                dataKey="measured"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={{ r: 3 }}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

function EndpointCard({ endpoint }: { endpoint: ScadaEndpoint }) {
  const { t, language, tm } = useLanguage()
  const styles = connectionStyles[endpoint.status]

  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {endpoint.status === 'connected' ? (
            <Wifi className="h-4 w-4 text-emerald-600" />
          ) : endpoint.status === 'degraded' ? (
            <Radio className="h-4 w-4 text-amber-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-rose-600" />
          )}
          <span className="font-medium text-slate-800">{tm(endpoint.name)}</span>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${styles.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
          {t(connectionLabelKey[endpoint.status])}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <dt className="text-slate-500">{t('scada.connectorCard.protocol')}</dt>
          <dd className="font-medium text-slate-800">{protocolLabels[endpoint.protocol]}</dd>
        </div>
        <div>
          <dt className="text-slate-500">{t('scada.connectorCard.tags')}</dt>
          <dd className="font-medium text-slate-800">{formatNumber(endpoint.tagsCount, language)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-slate-500">{t('scada.connectorCard.host')}</dt>
          <dd className="font-mono text-slate-800">{endpoint.host}</dd>
        </div>
        <div>
          <dt className="text-slate-500">{t('scada.connectorCard.latency')}</dt>
          <dd className="text-slate-800">{endpoint.latencyMs} ms</dd>
        </div>
        <div>
          <dt className="text-slate-500">{t('scada.connectorCard.heartbeat')}</dt>
          <dd className="text-slate-800">{formatDateTime(endpoint.lastHeartbeat, language)}</dd>
        </div>
      </dl>
    </div>
  )
}

function WearAlarmCard({
  alarm,
  highlighted = false,
}: {
  alarm: EarlyWearAlarm
  highlighted?: boolean
}) {
  const { t, tm, language } = useLanguage()
  const styles = alarmSeverityStyles[alarm.severity]
  const statusLabel = t(alarmStatusKeys[alarm.status])

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${styles.banner} ${highlighted ? 'ring-2 ring-amber-400' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {alarm.severity === 'critical' ? (
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          ) : alarm.severity === 'warning' ? (
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-sky-600" />
          )}
          <span className="font-medium text-slate-800">{tm(alarm.title)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${styles.badge}`}
          >
            {t(styles.labelKey)}
          </span>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            {statusLabel}
          </span>
        </div>
      </div>
      <p className="mt-2 text-xs font-medium text-slate-600">{tm(alarm.assetName)}</p>
      <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
        <div>
          <dt className="flex items-center gap-1 text-slate-500">
            <ImageIcon className="h-3 w-3" />
            {t('scada.visualEvidence')}
          </dt>
          <dd className="mt-0.5 text-slate-700">{tm(alarm.imageEvidence)}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-slate-500">
            <Activity className="h-3 w-3" />
            {t('scada.scadaEvidence')}
          </dt>
          <dd className="mt-0.5 text-slate-700">{tm(alarm.sensorEvidence)}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
        <span>
          {t('scada.projectedImpact')}: <strong>{formatDateTime(alarm.projectedImpactDate, language)}</strong>
        </span>
        <span>
          {t('common.confidence')}: <strong>{(alarm.confidence * 100).toFixed(0)}%</strong>
        </span>
        <span>
          {t('common.pattern')}: <strong>{alarm.pattern}</strong>
        </span>
        <span>{formatDateTime(alarm.createdAt, language)}</span>
      </div>
    </div>
  )
}
