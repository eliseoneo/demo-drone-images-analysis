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
import type { ProgressForecastStatus, ProgressMetrics, ProgressForecast } from '../../types'
import {
  buildForecastChartData,
  formatForecastDetail,
  formatForecastHeadline,
} from '../../utils/progressForecast'
import { useLanguage } from '../../context/LanguageContext'

interface ProgressChartProps {
  data: ProgressMetrics
  forecast: ProgressForecast
}

const forecastStatusConfig: Record<
  ProgressForecastStatus,
  { labelKey: string; badge: string; icon: typeof TrendingUp }
> = {
  on_track: {
    labelKey: 'dashboard.onTrack',
    badge: 'bg-teal-50 text-teal-700 ring-teal-200',
    icon: TrendingUp,
  },
  at_risk: {
    labelKey: 'dashboard.atRisk',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    icon: AlertTriangle,
  },
  delayed: {
    labelKey: 'dashboard.offTrack',
    badge: 'bg-rose-50 text-rose-700 ring-rose-200',
    icon: TrendingDown,
  },
}

export function ProgressChart({ data, forecast }: ProgressChartProps) {
  const { t, tw } = useLanguage()
  const trendData = useMemo(
    () =>
      buildForecastChartData(data, forecast).map((point) => ({
        ...point,
        date: point.date.includes('.') ? t(point.date) : point.date,
      })),
    [data, forecast, t],
  )
  const unit = t(data.unit)

  const chartData = [
    { name: t('dashboard.plannedToday'), value: data.plannedToday, fill: '#cbd5e1' },
    { name: t('dashboard.executedToday'), value: data.executedToday, fill: '#2dd4bf' },
    {
      name: t('dashboard.endOfDayProjection'),
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
  const forecastHeadline = formatForecastHeadline(t, forecast)
  const forecastDetail = formatForecastDetail(t, forecast)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            {t('dashboard.progressSummary')}
          </h2>
          <p className="mt-1 text-base font-medium text-slate-800">{tw(data.workId)}</p>
          <p className="mt-0.5 text-sm text-slate-500">
            {t(`dashboard.progressSubtitle.${data.category}`)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-teal-600">{percentage}%</p>
          <p className="text-xs text-slate-500">{t('dashboard.dailyCompletion')}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>{t(`dashboard.progressLabel.${data.category}`)}</span>
          <span>
            {data.executedToday} / {data.plannedToday} {unit}
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
            {t('dashboard.progressForecasting')}
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusCfg.badge}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {t(statusCfg.labelKey)}
          </span>
        </div>

        <p className="text-sm font-medium text-slate-800">{forecastHeadline}</p>
        <p className="mt-1 text-sm text-slate-600">{forecastDetail}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ForecastMetric
            label={t('dashboard.endOfDayProjection')}
            value={`${forecast.projectedEndOfDay} ${unit}`}
            sub={`${t('dashboard.plan')}: ${data.plannedToday} ${unit}`}
            tone={
              forecast.endOfDayGap >= 0
                ? 'positive'
                : forecast.endOfDayGap >= -1
                  ? 'neutral'
                  : 'negative'
            }
          />
          <ForecastMetric
            label={t('dashboard.todayDeviation')}
            value={
              forecast.endOfDayGap >= 0
                ? `+${forecast.endOfDayGap}`
                : `${forecast.endOfDayGap}`
            }
            sub={unit}
            tone={
              forecast.endOfDayGap >= 0
                ? 'positive'
                : forecast.endOfDayGap >= -1
                  ? 'neutral'
                  : 'negative'
            }
          />
          <ForecastMetric
            label={t('dashboard.periodClose')}
            value={`${forecast.projectedPeriodTotal} / ${data.scope.totalUnits}`}
            sub={`${t('dashboard.target')} ${data.scope.periodEndDate}`}
            tone={forecast.periodGap >= 0 ? 'positive' : 'negative'}
          />
          <ForecastMetric
            label={t('dashboard.paceVsExpected')}
            value={`${Math.round(forecast.paceRatio * 100)}%`}
            sub={`${t('dashboard.dayProgressAt')} ${forecast.dayProgressPct}%`}
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
              <Bar
                dataKey="planned"
                name={t('dashboard.planned')}
                fill="#cbd5e1"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="executed"
                name={t('dashboard.executed')}
                fill="#2dd4bf"
                radius={[3, 3, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="projected"
                name={t('common.projection')}
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
            {t('dashboard.videoEvidence')}
          </p>
          {data.evidenceVideoUrl ? (
            <video
              src={data.evidenceVideoUrl}
              controls
              preload="metadata"
              className="aspect-video w-full rounded-lg border border-slate-200 bg-slate-900 object-cover"
            >
              {t('dashboard.noVideoSupport')}
            </video>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-400">
              <VideoOff className="h-8 w-8" />
              <p className="text-sm font-medium">{t('dashboard.noVideo')}</p>
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
