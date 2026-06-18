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
import { Thermometer, Zap } from 'lucide-react'
import type { DegradationCurve } from '../../types/scada'
import { useLanguage } from '../../context/LanguageContext'

interface DegradationCurveChartProps {
  curve: DegradationCurve
}

export function DegradationCurveChart({ curve }: DegradationCurveChartProps) {
  const { t, tm } = useLanguage()

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-800">{t('scada.degradationCurve')}</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {t('scada.timeToFailure', { asset: tm(curve.assetName) })}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-800 ring-1 ring-orange-200">
          <Thermometer className="h-3 w-3" />
          {curve.droneModel} - {t('scada.upTo500c')}
        </span>
      </div>

      <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2">
        <p className="text-sm font-semibold text-rose-900">{tm(curve.failureHeadline)}</p>
        <p className="mt-0.5 text-xs text-rose-800/80">{tm(curve.detail)}</p>
      </div>

      <div className="min-h-72 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={curve.series} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} stroke="#94a3b8" interval="preserveStartEnd" />
            <YAxis
              yAxisId="temp"
              orientation="left"
              tick={{ fontSize: 10 }}
              stroke="#f97316"
              domain={[0, 120]}
              unit={` ${curve.droneTempUnit}`}
              label={{
                value: t('scada.droneTemp'),
                angle: -90,
                position: 'insideLeft',
                fontSize: 10,
                fill: '#ea580c',
              }}
            />
            <YAxis
              yAxisId="voltage"
              orientation="right"
              tick={{ fontSize: 10 }}
              stroke="#8b5cf6"
              domain={[64, 71]}
              unit={` ${curve.scadaVoltageUnit}`}
              label={{
                value: t('scada.scadaVoltage'),
                angle: 90,
                position: 'insideRight',
                fontSize: 10,
                fill: '#7c3aed',
              }}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              formatter={(value, name) => {
                if (value == null) return ['-', '']
                if (name === 'droneTemp') return [`${value} ${curve.droneTempUnit}`, t('scada.droneTemp')]
                if (name === 'scadaVoltage') return [`${value} ${curve.scadaVoltageUnit}`, t('scada.scadaVoltage')]
                if (name === 'projectedTemp')
                  return [`${value} ${curve.droneTempUnit}`, t('scada.projectedTrend')]
                return [String(value), String(name)]
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value) => {
                if (value === 'droneTemp') return t('scada.droneTempLegend')
                if (value === 'scadaVoltage') return t('scada.scadaVoltagePeaks')
                if (value === 'projectedTemp') return t('scada.projectedTrend')
                return value
              }}
            />
            <ReferenceLine
              yAxisId="temp"
              y={curve.criticalTempThreshold}
              stroke="#f43f5e"
              strokeWidth={2}
              strokeDasharray="6 3"
              label={{
                value: t('scada.criticalLabelWithTemp', { temp: curve.criticalTempThreshold }),
                position: 'insideTopRight',
                fontSize: 10,
                fill: '#e11d48',
              }}
            />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="droneTemp"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 2, fill: '#f97316' }}
              connectNulls={false}
              name="droneTemp"
            />
            <Line
              yAxisId="voltage"
              type="monotone"
              dataKey="scadaVoltage"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 2, fill: '#8b5cf6' }}
              connectNulls={false}
              name="scadaVoltage"
            />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="projectedTemp"
              stroke="#38bdf8"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={{ r: 2, fill: '#38bdf8' }}
              connectNulls={false}
              name="projectedTemp"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap gap-4 text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Thermometer className="h-3 w-3 text-orange-500" />
          {t('scada.thermalHistory')}
        </span>
        <span className="inline-flex items-center gap-1">
          <Zap className="h-3 w-3 text-violet-500" />
          {t('scada.scadaVoltageHistory')}
        </span>
      </div>
    </div>
  )
}
