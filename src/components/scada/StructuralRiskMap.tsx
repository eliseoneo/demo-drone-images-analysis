import { useId, useState } from 'react'
import { Brain, MapPin } from 'lucide-react'
import type { StructuralRiskLevel, StructuralRiskMap as StructuralRiskMapData } from '../../types/scada'
import { useLanguage } from '../../context/LanguageContext'

const riskColors: Record<
  StructuralRiskLevel,
  { fill: string; stroke: string; labelKey: string; text: string }
> = {
  low: {
    fill: 'rgba(34, 197, 94, 0.18)',
    stroke: '#22c55e',
    labelKey: 'common.low',
    text: 'text-emerald-700',
  },
  moderate: {
    fill: 'rgba(251, 191, 36, 0.28)',
    stroke: '#f59e0b',
    labelKey: 'common.moderate',
    text: 'text-amber-700',
  },
  high: {
    fill: 'rgba(249, 115, 22, 0.35)',
    stroke: '#f97316',
    labelKey: 'common.high',
    text: 'text-orange-700',
  },
  critical: {
    fill: 'rgba(244, 63, 94, 0.42)',
    stroke: '#f43f5e',
    labelKey: 'common.critical',
    text: 'text-rose-700',
  },
}

interface StructuralRiskMapProps {
  map: StructuralRiskMapData
}

export function StructuralRiskMap({ map }: StructuralRiskMapProps) {
  const { t, tm } = useLanguage()
  const gradientId = useId()
  const [selectedZoneId, setSelectedZoneId] = useState(map.zones[0]?.id ?? null)
  const selectedZone = map.zones.find((zone) => zone.id === selectedZoneId) ?? map.zones[0]

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-slate-800">{tm(map.title)}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{tm(map.subtitle)}</p>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <svg viewBox="0 0 100 70" className="h-auto w-full" role="img" aria-label={tm(map.title)}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#64748b" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.15" />
            </linearGradient>
            <pattern id={`${gradientId}-grid`} width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#cbd5e1" strokeWidth="0.15" />
            </pattern>
          </defs>

          <rect width="100" height="70" fill={`url(#${gradientId}-grid)`} />
          <rect width="100" height="70" fill={`url(#${gradientId})`} />

          <path d="M 4 36 L 96 36" stroke="#475569" strokeWidth="0.6" strokeDasharray="1.5 1" fill="none" />
          <path d="M 4 36 L 96 36" stroke="#64748b" strokeWidth="0.25" fill="none" />

          {[
            { x: 18, label: 'T-2' },
            { x: 38, label: 'T-3' },
            { x: 58, label: 'T-4' },
            { x: 72, label: 'T-4 bis' },
            { x: 82, label: 'T-5' },
          ].map((tower) => (
            <g key={tower.label}>
              <line x1={tower.x} y1="36" x2={tower.x} y2="58" stroke="#334155" strokeWidth="0.8" />
              <line x1={tower.x - 6} y1="44" x2={tower.x + 6} y2="44" stroke="#334155" strokeWidth="0.6" />
              <line x1={tower.x - 4} y1="50" x2={tower.x + 4} y2="50" stroke="#475569" strokeWidth="0.4" />
              <text x={tower.x} y="64" textAnchor="middle" fontSize="2.8" fill="#64748b" fontWeight="600">
                {tower.label}
              </text>
            </g>
          ))}

          {map.zones.map((zone) => {
            const colors = riskColors[zone.riskLevel]
            const isSelected = zone.id === selectedZoneId
            return (
              <g
                key={zone.id}
                className="cursor-pointer"
                onClick={() => setSelectedZoneId(zone.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => event.key === 'Enter' && setSelectedZoneId(zone.id)}
              >
                <ellipse
                  cx={zone.cx}
                  cy={zone.cy}
                  rx={zone.rx}
                  ry={zone.ry}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? 0.9 : 0.5}
                  opacity={isSelected ? 1 : 0.85}
                />
                {isSelected && (
                  <ellipse
                    cx={zone.cx}
                    cy={zone.cy}
                    rx={zone.rx + 1.5}
                    ry={zone.ry + 1.2}
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth="0.4"
                    strokeDasharray="1 0.8"
                    opacity="0.7"
                  />
                )}
              </g>
            )
          })}

          <g transform="translate(8, 12)">
            <rect width="22" height="6" rx="1.2" fill="white" fillOpacity="0.9" stroke="#e2e8f0" strokeWidth="0.3" />
            <text x="2" y="4.2" fontSize="2.4" fill="#475569" fontWeight="600">
              {t('scada.riskMapSchematic')}
            </text>
          </g>
        </svg>

        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5">
          {(Object.keys(riskColors) as StructuralRiskLevel[]).map((level) => (
            <span
              key={level}
              className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-200"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: riskColors[level].stroke }} />
              {t(riskColors[level].labelKey)}
            </span>
          ))}
        </div>
      </div>

      {selectedZone && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <MapPin className={`mt-0.5 h-4 w-4 shrink-0 ${riskColors[selectedZone.riskLevel].text}`} />
              <div>
                <p className="text-sm font-medium text-slate-800">{tm(selectedZone.label)}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {t('scada.reference')}: {selectedZone.assetRef}
                </p>
              </div>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${riskColors[selectedZone.riskLevel].text} bg-white ring-current/20`}
            >
              {t('scada.riskLevel', {
                level: t(riskColors[selectedZone.riskLevel].labelKey).toLowerCase(),
              })}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">{tm(selectedZone.insight)}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Brain className="h-3 w-3 text-violet-500" />
              {tm(selectedZone.detectionModel)}
            </span>
            <span>
              {t('scada.monthlyAcceleration')}:{' '}
              <strong className="text-orange-700">+{selectedZone.monthlyAccelerationPct}%</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
