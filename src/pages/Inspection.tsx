import { useState } from 'react'
import { DualImageViewer } from '../components/inspection/DualImageViewer'
import { ValidationActions } from '../components/inspection/ValidationActions'
import { inspectionSession } from '../data/mocks/detections'
import type { Detection, DetectionStatus } from '../types'

export function Inspection() {
  const [detections, setDetections] = useState<Detection[]>(
    inspectionSession.detections,
  )
  const [activeId, setActiveId] = useState<string | null>(
    inspectionSession.detections[0]?.id ?? null,
  )
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleValidate = (id: string, status: DetectionStatus) => {
    setDetections((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d)),
    )
    const det = detections.find((d) => d.id === id)
    if (det && status === 'dismissed') {
      setFeedback(
        `Detección descartada: "${det.label}" marcada como falso positivo.`,
      )
      setTimeout(() => setFeedback(null), 4000)
    }
  }

  const handleConfirmFailure = (id: string, message: string) => {
    setDetections((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'confirmed' as const } : d)),
    )
    setFeedback(message)
    setTimeout(() => setFeedback(null), 6000)
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">
          Inspección y Detección de Anomalías
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Nivel 1 — Validación humana asistida por IA
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Captura: {inspectionSession.capturedAt}
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <DualImageViewer
          visualImage={inspectionSession.visualImage}
          thermalImage={inspectionSession.thermalImage}
          location={inspectionSession.location}
          detections={detections}
          activeId={activeId}
        />
        <ValidationActions
          session={inspectionSession}
          detections={detections}
          activeId={activeId}
          onSelect={setActiveId}
          onValidate={handleValidate}
          onConfirmFailure={handleConfirmFailure}
          feedback={feedback}
        />
      </div>
    </div>
  )
}
