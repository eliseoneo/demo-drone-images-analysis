import { useMemo } from 'react'
import { AlertTriangle, TrendingDown, TrendingUp, VideoOff } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Line,
  ComposedChart,
  Legend,
} from 'recharts'
import { progressCategoryConfig } from './progressLabels'
import type { ProgressForecastStatus, ProgressMetrics, ProgressForecast } from '../../types'
import {
  buildForecastChartData,
} from '../../utils/progressForecast'

interface ProgressChartProps {
  data: ProgressMetrics
  forecast: ProgressForecast
}

const forecastStatusConfig: Record<
  ProgressForecastStatus,
  { label: string; badge: string; icon: typeof TrendingUp }
> = {
  on_track: {
    label: 'En ritmo',
    badge: 'bg-teal-50 text-teal-700 ring-teal-200',
    icon: TrendingUp,
  },
  at_risk: {
    label: 'En riesgo',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    icon: AlertTriangle,
  },
  delayed: {
    label: 'Con desviación',
    badge: 'bg-rose-50 text-rose-700 ring-rose-200',
    icon: TrendingDown,
  },
}

export function ProgressChart({ data, forecast }: ProgressChartProps) {
  const labels = progressCategoryConfig[data.category]
  const trendData = useMemo(() => buildForecastChartData(data, forecast), [data, forecast])

  const chartData = [
    { name: 'Planificado hoy', value: data.plannedToday, fill: '#cbd5e1' },
    { name: 'Ejecutado hoy', value: data.executedToday, fill: '#2dd4bf' },
    {
      name: 'Proyección fin de día',
      value: forecast.projectedEndOfDay,
      fill: '#38bdf8',
    },
  ]

  const percentage =
    data.plannedToday > 0
      ? Math.round((data.executedToday / data.plannedToday) * 100)
      : 0

  const statusCfg = forecastStatusConfig[forecast.status]
  const StatusIcon = statusCfg.icon

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Resumen de avances
          </h2>
          <p className="mt-1 text-base font-medium text-slate-800">{data.projectName}</p>
          <p className="mt-0.5 text-sm text-slate-500">{labels.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-teal-600">{percentage}%</p>
          <p className="text-xs text-slate-500">cumplimiento diario</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>{labels.progressLabel}</span>
          <span>
            {data.executedToday} / {data.plannedToday} {data.unit}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-400 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50/80 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Forecasting de avance
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusCfg.badge}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {statusCfg.label}
          </span>
        </div>

        <p className="text-sm font-medium text-slate-800">{forecast.headline}</p>
        <p className="mt-1 text-sm text-slate-600">{forecast.detail}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ForecastMetric
            label="Proyección fin de día"
            value={`${forecast.projectedEndOfDay} ${data.unit}`}
            sub={`Plan: ${data.plannedToday} ${data.unit}`}
            tone={
              forecast.endOfDayGap >= 0
                ? 'positive'
                : forecast.endOfDayGap >= -1
                  ? 'neutral'
                  : 'negative'
            }
          />
          <ForecastMetric
            label="Desviación hoy"
            value={
              forecast.endOfDayGap >= 0
                ? `+${forecast.endOfDayGap}`
                : `${forecast.endOfDayGap}`
            }
            sub={data.unit}
            tone={
              forecast.endOfDayGap >= 0
                ? 'positive'
                : forecast.endOfDayGap >= -1
                  ? 'neutral'
                  : 'negative'
            }
          />
          <ForecastMetric
            label="Cierre de periodo"
            value={`${forecast.projectedPeriodTotal} / ${data.scope.totalUnits}`}
            sub={`Meta ${data.scope.periodEndDate}`}
            tone={forecast.periodGap >= 0 ? 'positive' : 'negative'}
          />
          <ForecastMetric
            label="Ritmo vs. esperado"
            value={`${Math.round(forecast.paceRatio * 100)}%`}
            sub={`Avance del día al ${forecast.dayProgressPct}%`}
            tone={
              forecast.paceRatio >= 0.85
                ? 'positive'
                : forecast.paceRatio >= 0.6
                  ? 'neutral'
                  : 'negative'
            }
          />
        </div>

        <div className="mt-4 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#334155',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="planned" name="Planificado" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="executed" name="Ejecutado" fill="#2dd4bf" radius={[3, 3, 0, 0]} />
              <Line
                type="monotone"
                dataKey="projected"
                name="Proyección"
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={{ r: 4, fill: '#38bdf8' }}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#94a3b8"
                fontSize={12}
                width={130}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#334155',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Evidencia en video
          </p>
          {data.evidenceVideoUrl ? (
            <video
              src={data.evidenceVideoUrl}
              controls
              preload="metadata"
              className="aspect-video w-full rounded-lg border border-slate-200 bg-slate-900 object-cover"
            >
              Su navegador no admite reproducción de video.
            </video>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-400">
              <VideoOff className="h-8 w-8" />
              <p className="text-sm font-medium">Sin video</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ForecastMetric({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: string
  sub: string
  tone: 'positive' | 'neutral' | 'negative'
}) {
  const valueColor = {
    positive: 'text-teal-700',
    neutral: 'text-amber-700',
    negative: 'text-rose-700',
  }[tone]

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${valueColor}`}>{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
    </div>
  )
}
