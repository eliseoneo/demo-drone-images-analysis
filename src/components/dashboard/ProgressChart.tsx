import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { progressCategoryConfig } from './progressLabels'
import type { ProgressMetrics } from '../../types'

interface ProgressChartProps {
  data: ProgressMetrics
}

export function ProgressChart({ data }: ProgressChartProps) {
  const labels = progressCategoryConfig[data.category]
  const chartData = [
    { name: 'Planificado hoy', value: data.plannedToday, fill: '#cbd5e1' },
    { name: 'Ejecutado hoy', value: data.executedToday, fill: '#2dd4bf' },
  ]

  const percentage =
    data.plannedToday > 0
      ? Math.round((data.executedToday / data.plannedToday) * 100)
      : 0

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
              width={110}
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
    </div>
  )
}
