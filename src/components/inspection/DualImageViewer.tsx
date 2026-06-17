import { Thermometer } from 'lucide-react'
import { DetectionOverlay } from './DetectionOverlay'
import type { Detection } from '../../types'

interface DualImageViewerProps {
  visualImage: string
  thermalImage: string
  location: string
  detections: Detection[]
  activeId: string | null
}

export function DualImageViewer({
  visualImage,
  thermalImage,
  location,
  detections,
  activeId,
}: DualImageViewerProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Vista dual — Matrice 3TD
          </h2>
          <p className="mt-1 text-sm text-slate-700">{location}</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
          <Thermometer className="h-3.5 w-3.5 text-orange-500" />
          Rango térmico: -20°C a 500°C
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ImagePanel title="Imagen visual (RGB)" src={visualImage}>
          <DetectionOverlay detections={detections} activeId={activeId} />
        </ImagePanel>
        <ImagePanel title="Imagen térmica" src={thermalImage} thermal />
      </div>
    </div>
  )
}

function ImagePanel({
  title,
  src,
  children,
  thermal = false,
}: {
  title: string
  src: string
  children?: React.ReactNode
  thermal?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-2">
        <p className="text-xs font-medium text-slate-500">{title}</p>
      </div>
      <div className="relative aspect-[4/3] bg-slate-100">
        <img
          src={src}
          alt={title}
          className={`h-full w-full object-cover ${thermal ? 'opacity-95' : ''}`}
        />
        {children}
      </div>
    </div>
  )
}
