import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  AlertTriangle,
  ClipboardList,
  Eye,
  Gauge,
  Thermometer,
  TrendingDown,
} from 'lucide-react'
import type { ExecutiveReportData } from '../../types/executiveReport'

interface ExecutiveSummaryPanelProps {
  data: ExecutiveReportData
  hideSectionLabel?: boolean
  compact?: boolean
}

const reviewColors = {
  pending: '#f59e0b',
  inProgress: '#3b82f6',
  resolved: '#14b8a6',
}

export function ExecutiveSummaryPanel({
  data,
  hideSectionLabel,
  compact = false,
}: ExecutiveSummaryPanelProps) {
  const navigate = useNavigate()
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null)
  const { workProgress, anomalies, wearProjection } = data

  const isPrimaryMaintenanceAction = /orden|mantenimiento/i.test(wearProjection.actionLabel)

  const handleGenerateOrder = () => {
    setOrderFeedback(
      `Orden simulada: ${wearProjection.actionLabel} — ${wearProjection.assetName}.`,
    )
    window.setTimeout(() => setOrderFeedback(null), 5000)
  }

  const handleViewVisualEvidence = () => {
    navigate('/inspection?detectionId=det-001&scrollTo=anomalies')
  }

  const reviewFunnel = [
    { name: 'Pendientes', value: anomalies.pendingReview, fill: reviewColors.pending },
    { name: 'En proceso', value: anomalies.inProgress, fill: reviewColors.inProgress },
    { name: 'Resueltas', value: anomalies.resolved, fill: reviewColors.resolved },
  ]

  const deviationTone =
    workProgress.deviationPct >= 0
      ? 'text-teal-700'
      : workProgress.deviationPct >= -5
        ? 'text-amber-700'
        : 'text-rose-700'

  const riskSeries = wearProjection.curve.series.map((point) => ({
    label: point.timestamp,
    risk: point.projectedTemp ?? point.droneTemp ?? 0,
    projected: point.projectedTemp != null,
  }))

  return (
    <section className="space-y-4" aria-label="Resumen ejecutivo">
      <header className="border-b border-slate-100 pb-4">
        {!hideSectionLabel && (
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
            Resumen ejecutivo
          </p>
        )}
        <h2 className={`${hideSectionLabel ? '' : 'mt-1 '}text-xl font-semibold text-slate-800`}>
          {data.title}
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">{data.subtitle}</p>
      </header>

      <div
        className={`grid gap-4 ${compact ? 'grid-cols-1 min-[640px]:grid-cols-3' : 'xl:grid-cols-3'}`}
      >
        {/* Bloque 1 — Avance de obra y desviaciones */}
        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Gauge className="h-4 w-4 text-teal-600" />
            <h3 className="text-sm font-semibold text-slate-800">
              Avance de obra y desviaciones
            </h3>
          </div>

          <div className="space-y-4">
            <DualProgressRow
              label="Avance planificado"
              value={workProgress.plannedProgressPct}
              color="bg-slate-400"
            />
            <DualProgressRow
              label="Avance real"
              value={workProgress.actualProgressPct}
              color="bg-teal-500"
            />
          </div>

          <div
            className={`mt-4 ${compact ? 'space-y-3' : 'flex flex-wrap items-center justify-between gap-3'}`}
          >
            <p className={`font-bold ${compact ? 'text-base' : 'text-lg'} ${deviationTone}`}>
              Desviación actual: {workProgress.deviationPct > 0 ? '+' : ''}
              {workProgress.deviationPct}%
            </p>
            <button
              type="button"
              onClick={handleViewVisualEvidence}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800 shadow-sm transition-colors hover:bg-teal-100 ${
                compact ? 'w-full' : ''
              }`}
            >
              <Eye className="h-4 w-4 shrink-0" />
              Ver evidencia visual
            </button>
          </div>

          <DelayAlertBanner
            message={workProgress.delayAlert}
            severity={workProgress.delayAlertSeverity}
            compact={compact}
          />
        </article>

        {/* Bloque 2 — Anomalías y revisiones */}
        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-600" />
            <h3 className="text-sm font-semibold text-slate-800">
              Anomalías y estado de revisiones
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              value={anomalies.totalAnomalies}
              label="Anomalías detectadas"
              tone="rose"
            />
            <SummaryCard
              value={`${anomalies.thermalMaxC}°C`}
              label="Temperatura máxima detectada"
              tone="amber"
              sub={
                anomalies.thermalMaxC >= 120 ? 'Pico térmico crítico' : undefined
              }
            />
          </div>

          {anomalies.thermalHighlight && (
            <p className="mt-3 text-xs text-slate-500">{anomalies.thermalHighlight}</p>
          )}

          <div className={`mt-4 ${compact ? 'space-y-3' : 'flex items-center gap-4'}`}>
            <div className={`h-28 shrink-0 ${compact ? 'mx-auto w-28' : 'w-28'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reviewFunnel}
                    dataKey="value"
                    innerRadius={28}
                    outerRadius={48}
                    paddingAngle={2}
                  >
                    {reviewFunnel.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className={`space-y-2 text-sm ${compact ? 'w-full' : 'flex-1'}`}>
              <ReviewStatusRow
                color={reviewColors.pending}
                count={anomalies.pendingReview}
                label="Pendientes de revisión"
                compact={compact}
              />
              <ReviewStatusRow
                color={reviewColors.inProgress}
                count={anomalies.inProgress}
                label="En proceso"
                compact={compact}
              />
              <ReviewStatusRow
                color={reviewColors.resolved}
                count={anomalies.resolved}
                label="Resueltas"
                compact={compact}
              />
            </ul>
          </div>
        </article>

        {/* Bloque 3 — Proyecciones por desgaste (IA) */}
        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-violet-600" />
            <h3 className="text-sm font-semibold text-slate-800">
              Proyecciones por desgaste (IA predictiva)
            </h3>
          </div>

          <p className="text-sm font-semibold text-slate-800">{wearProjection.wearRateHeadline}</p>

          <div className="mt-3 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={riskSeries} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 9 }} stroke="#94a3b8" interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  formatter={(value) => [`${value} °C`, 'Índice térmico']}
                />
                <ReferenceLine
                  y={wearProjection.curve.criticalTempThreshold}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: 'Crítico', fontSize: 9, fill: '#ef4444' }}
                />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-3">
            <p className="text-sm font-semibold text-rose-900">{wearProjection.projectionText}</p>
            <div className={`mt-3 ${compact ? '' : 'flex flex-wrap items-center gap-3'}`}>
              <button
                type="button"
                onClick={handleGenerateOrder}
                className={
                  isPrimaryMaintenanceAction
                    ? `inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 ${
                        compact ? 'w-full' : ''
                      }`
                    : `inline-flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-900 shadow-sm transition hover:bg-violet-50 ${
                        compact ? 'w-full' : ''
                      }`
                }
              >
                <ClipboardList className="h-4 w-4" />
                {wearProjection.actionLabel}
              </button>
            </div>
            {orderFeedback && (
              <p
                role="status"
                className="mt-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs text-teal-800"
              >
                {orderFeedback}
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}

function DelayAlertBanner({
  message,
  severity,
  compact = false,
}: {
  message: string
  severity: 'warning' | 'critical'
  compact?: boolean
}) {
  const isCritical = severity === 'critical'

  return (
    <div
      role="alert"
      className={`mt-3 rounded-xl border-2 p-3 ${
        isCritical
          ? 'border-rose-300 bg-gradient-to-r from-rose-50 to-orange-50'
          : 'border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`flex shrink-0 flex-col items-center gap-1 rounded-md bg-slate-900 shadow-inner ${
            compact ? 'px-1.5 py-1.5' : 'px-2 py-2'
          }`}
          aria-hidden
        >
          <span
            className={`rounded-full shadow-lg ${
              compact ? 'h-3.5 w-3.5' : 'h-4 w-4'
            } ${
              isCritical
                ? 'bg-rose-500 ring-2 ring-rose-300 ring-offset-1 ring-offset-slate-900'
                : 'bg-slate-700 opacity-30'
            }`}
          />
          <span
            className={`rounded-full shadow-lg ${
              compact ? 'h-3 w-3' : 'h-3.5 w-3.5'
            } ${
              !isCritical
                ? 'bg-amber-400 ring-2 ring-amber-200 ring-offset-1 ring-offset-slate-900'
                : 'bg-slate-700 opacity-30'
            }`}
          />
          <span
            className={`rounded-full bg-slate-700 opacity-30 ${
              compact ? 'h-2.5 w-2.5' : 'h-3 w-3'
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <AlertTriangle
              className={`shrink-0 ${compact ? 'h-4 w-4' : 'h-5 w-5'} ${
                isCritical ? 'text-rose-600' : 'text-amber-600'
              }`}
            />
            <p
              className={`font-semibold uppercase tracking-wide ${
                compact ? 'text-[10px]' : 'text-xs'
              } ${isCritical ? 'text-rose-700' : 'text-amber-700'}`}
            >
              Impacto operativo
            </p>
          </div>
          <p
            className={`mt-1.5 font-semibold leading-relaxed ${
              compact ? 'text-xs' : 'text-sm'
            } ${isCritical ? 'text-rose-900' : 'text-amber-950'}`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

function DualProgressRow({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span className="font-semibold text-slate-700">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  )
}

function SummaryCard({
  value,
  label,
  tone,
  sub,
}: {
  value: string | number
  label: string
  tone: 'rose' | 'amber' | 'teal'
  sub?: string
}) {
  const tones = {
    rose: 'border-rose-100 bg-rose-50 text-rose-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-800',
    teal: 'border-teal-100 bg-teal-50 text-teal-700',
  }

  return (
    <div className={`rounded-lg border px-3 py-3 ${tones[tone]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium leading-tight opacity-90">{label}</p>
      {sub && <p className="mt-1 text-[10px] opacity-70">{sub}</p>}
    </div>
  )
}

function ReviewStatusRow({
  color,
  count,
  label,
  compact = false,
}: {
  color: string
  count: number
  label: string
  compact?: boolean
}) {
  return (
    <li className={`flex items-start gap-2 ${compact ? 'text-xs' : ''}`}>
      <span
        className={`mt-1 shrink-0 rounded-full ${compact ? 'h-2 w-2' : 'h-2.5 w-2.5'}`}
        style={{ backgroundColor: color }}
      />
      <span className="font-semibold text-slate-800">{count}</span>
      <span className="min-w-0 text-slate-500">{label}</span>
    </li>
  )
}
