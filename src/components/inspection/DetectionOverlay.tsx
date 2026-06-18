import type { Detection } from '../../types'
import { useLanguage } from '../../context/LanguageContext'

interface DetectionOverlayProps {
  detections: Detection[]
  activeId: string | null
}

export function DetectionOverlay({ detections, activeId }: DetectionOverlayProps) {
  const { td } = useLanguage()
  return (
    <div className="pointer-events-none absolute inset-0">
      {detections.map((det) => {
        const isActive = det.id === activeId
        const isConfirmed = det.status === 'confirmed'
        const isDismissed = det.status === 'dismissed'

        let borderColor = 'border-rose-400'
        let bgColor = 'bg-rose-400/15'
        let labelBg = 'bg-rose-500'

        if (isConfirmed) {
          borderColor = 'border-teal-400'
          bgColor = 'bg-teal-400/15'
          labelBg = 'bg-teal-500'
        } else if (isDismissed) {
          borderColor = 'border-slate-300'
          bgColor = 'bg-slate-400/10'
          labelBg = 'bg-slate-400'
        }

        return (
          <div
            key={det.id}
            className={`absolute border-2 transition-all ${borderColor} ${bgColor} ${
              isActive ? 'ring-2 ring-teal-300/60' : ''
            } ${isDismissed ? 'opacity-50' : ''}`}
            style={{
              left: `${det.x}%`,
              top: `${det.y}%`,
              width: `${det.width}%`,
              height: `${det.height}%`,
            }}
          >
            <span
              className={`absolute -top-6 left-0 max-w-[200px] truncate rounded px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm ${labelBg}`}
            >
              {td(det.id)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
