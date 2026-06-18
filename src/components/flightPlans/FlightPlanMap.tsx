import { useId, useMemo, useState } from 'react'
import { LayoutGrid, Map as MapIcon } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { Waypoint, WaypointAction } from '../../types/flightPlans'

interface FlightPlanMapProps {
  waypoints: Waypoint[]
  selectedWaypointId: string | null
  onSelectWaypoint: (id: string) => void
}

type ProjectedPoint = Waypoint & { x: number; y: number }

type GeoNode = {
  lat: number
  lng: number
  x: number
  y: number
  members: ProjectedPoint[]
}

type ViewMode = 'schema' | 'geo'

const GEO_MATCH_EPSILON = 0.00005
const MAP_PADDING = 28
const MAP_WIDTH = 340
const MAP_HEIGHT = 200

const actionColors: Record<WaypointAction, string> = {
  takeoff: '#0d9488',
  waypoint: '#64748b',
  hover: '#0284c7',
  photo: '#d97706',
  landing: '#0d9488',
}

const actionLabelKeys: Record<WaypointAction, string> = {
  takeoff: 'flightPlans.takeoff',
  landing: 'flightPlans.landing',
  waypoint: 'flightPlans.waypoint',
  hover: 'flightPlans.hover',
  photo: 'flightPlans.photo',
}

function projectWaypoints(waypoints: Waypoint[]): ProjectedPoint[] {
  const sorted = [...waypoints].sort((a, b) => a.order - b.order)
  const lats = sorted.map((w) => w.lat)
  const lngs = sorted.map((w) => w.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const latRange = maxLat - minLat || 0.001
  const lngRange = maxLng - minLng || 0.001

  return sorted.map((wp) => ({
    ...wp,
    x: MAP_PADDING + ((wp.lng - minLng) / lngRange) * (MAP_WIDTH - MAP_PADDING * 2),
    y: MAP_PADDING + ((maxLat - wp.lat) / latRange) * (MAP_HEIGHT - MAP_PADDING * 2),
  }))
}

function buildGeoNodes(points: ProjectedPoint[]): GeoNode[] {
  const nodes: GeoNode[] = []

  for (const point of points) {
    const existing = nodes.find(
      (node) =>
        Math.abs(node.lat - point.lat) < GEO_MATCH_EPSILON &&
        Math.abs(node.lng - point.lng) < GEO_MATCH_EPSILON,
    )

    if (existing) {
      existing.members.push(point)
    } else {
      nodes.push({
        lat: point.lat,
        lng: point.lng,
        x: point.x,
        y: point.y,
        members: [point],
      })
    }
  }

  for (const node of nodes) {
    node.members.sort((a, b) => a.order - b.order)
  }

  return nodes
}

function buildGeoBbox(points: ProjectedPoint[]) {
  const lats = points.map((p) => p.lat)
  const lngs = points.map((p) => p.lng)
  const latPad = 0.002
  const lngPad = 0.002
  const south = Math.min(...lats) - latPad
  const north = Math.max(...lats) + latPad
  const west = Math.min(...lngs) - lngPad
  const east = Math.max(...lngs) + lngPad

  return { south, north, west, east }
}

function buildOsmEmbedUrl(points: ProjectedPoint[]) {
  const { south, north, west, east } = buildGeoBbox(points)
  const marker = points[0]
  const bbox = `${west},${south},${east},${north}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${marker.lat}%2C${marker.lng}`
}

function nodeLabel(node: GeoNode) {
  return node.members.map((member) => member.order).join('·')
}

function nodePrimaryAction(node: GeoNode): WaypointAction {
  if (node.members.length === 1) return node.members[0].action
  if (node.members.some((m) => m.action === 'takeoff')) return 'takeoff'
  if (node.members.some((m) => m.action === 'landing')) return 'landing'
  return node.members[0].action
}

export function FlightPlanMap({
  waypoints,
  selectedWaypointId,
  onSelectWaypoint,
}: FlightPlanMapProps) {
  const { t } = useLanguage()
  const patternId = useId().replace(/:/g, '')
  const [viewMode, setViewMode] = useState<ViewMode>('schema')

  const points = useMemo(() => projectWaypoints(waypoints), [waypoints])
  const nodes = useMemo(() => buildGeoNodes(points), [points])
  const osmUrl = useMemo(() => buildOsmEmbedUrl(points), [points])

  if (points.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
        {t('flightPlans.noWaypoints')}
      </div>
    )
  }

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  const handleNodeClick = (node: GeoNode) => {
    const selectedInNode = node.members.find((member) => member.id === selectedWaypointId)
    if (selectedInNode) {
      const index = node.members.findIndex((member) => member.id === selectedInNode.id)
      const next = node.members[(index + 1) % node.members.length]
      onSelectWaypoint(next.id)
      return
    }

    onSelectWaypoint(node.members[0].id)
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-xs text-slate-500">
          {t('flightPlans.geoSummary', { nodes: nodes.length, waypoints: points.length })}
        </p>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
          <ViewToggle
            active={viewMode === 'schema'}
            label={t('flightPlans.schemaView')}
            icon={LayoutGrid}
            onClick={() => setViewMode('schema')}
          />
          <ViewToggle
            active={viewMode === 'geo'}
            label={t('flightPlans.geoView')}
            icon={MapIcon}
            onClick={() => setViewMode('geo')}
          />
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_240px]">
        {viewMode === 'schema' ? (
          <div className="border-b border-slate-200 bg-slate-50 lg:border-b-0 lg:border-r">
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              className="h-52 w-full"
              role="img"
              aria-label={t('flightPlans.schemaAriaLabel')}
            >
              <defs>
                <pattern
                  id={patternId}
                  width="16"
                  height="16"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={`url(#${patternId})`} />
              <rect
                x={MAP_PADDING - 8}
                y={MAP_PADDING - 8}
                width={MAP_WIDTH - (MAP_PADDING - 8) * 2}
                height={MAP_HEIGHT - (MAP_PADDING - 8) * 2}
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="1"
                rx="4"
              />

              <path
                d={pathD}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                strokeLinecap="round"
              />

              {nodes.map((node) => {
                const isSelected = node.members.some((member) => member.id === selectedWaypointId)
                const color = actionColors[nodePrimaryAction(node)]
                const orders = nodeLabel(node)
                const radius = isSelected ? 9 : 7

                return (
                  <g
                    key={`${node.lat}-${node.lng}`}
                    className="cursor-pointer"
                    onClick={() => handleNodeClick(node)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleNodeClick(node)}
                  >
                    <circle cx={node.x} cy={node.y} r={radius + 3} fill={color} opacity={0.18} />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius}
                      fill="white"
                      stroke={color}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                    <text
                      x={node.x}
                      y={node.y + 3}
                      textAnchor="middle"
                      fontSize={orders.length > 2 ? '7' : '8'}
                      fontWeight="700"
                      fill={color}
                    >
                      {orders}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        ) : (
          <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
            <iframe
              title="Mapa geográfico de la ruta"
              src={osmUrl}
              className="h-52 w-full border-0"
              loading="lazy"
            />
          </div>
        )}

        <WaypointList
          points={points}
          selectedWaypointId={selectedWaypointId}
          onSelectWaypoint={onSelectWaypoint}
        />
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-200 px-3 py-2 text-[10px] text-slate-600">
        <LegendItem color="#0d9488" label={t('flightPlans.legendTakeoffLanding')} />
        <LegendItem color="#64748b" label={t('flightPlans.waypoint')} />
        <LegendItem color="#0284c7" label={t('flightPlans.hover')} />
        <LegendItem color="#d97706" label={t('flightPlans.legendPhoto')} />
      </div>
    </div>
  )
}

function WaypointList({
  points,
  selectedWaypointId,
  onSelectWaypoint,
}: {
  points: ProjectedPoint[]
  selectedWaypointId: string | null
  onSelectWaypoint: (id: string) => void
}) {
  const { t, tm } = useLanguage()

  return (
    <div className="max-h-52 overflow-y-auto p-2">
      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {t('flightPlans.waypointSequence')}
      </p>
      <ul className="space-y-1">
        {points.map((point) => {
          const isSelected = point.id === selectedWaypointId
          const color = actionColors[point.action]

          return (
            <li key={point.id}>
              <button
                type="button"
                onClick={() => onSelectWaypoint(point.id)}
                className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
                  isSelected ? 'bg-teal-50 ring-1 ring-teal-200' : 'hover:bg-slate-50'
                }`}
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  {point.order}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-slate-800">
                    {tm(point.name)}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-slate-400">
                    {point.lat.toFixed(4)}, {point.lng.toFixed(4)} · {t(actionLabelKeys[point.action])}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ViewToggle({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean
  label: string
  icon: typeof LayoutGrid
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
        active ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
