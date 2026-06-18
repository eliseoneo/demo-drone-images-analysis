import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DualImageViewer } from '../components/inspection/DualImageViewer'
import { ValidationActions } from '../components/inspection/ValidationActions'
import { useLanguage } from '../context/LanguageContext'
import { inspectionSession } from '../data/mocks/detections'
import type { Detection, DetectionStatus } from '../types'

export function Inspection() {
  const { t, td } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [detections, setDetections] = useState<Detection[]>(
    inspectionSession.detections,
  )
  const [activeId, setActiveId] = useState<string | null>(
    inspectionSession.detections[0]?.id ?? null,
  )
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    const detectionId = searchParams.get('detectionId')
    const scrollTo = searchParams.get('scrollTo')

    if (detectionId && detections.some((d) => d.id === detectionId)) {
      setActiveId(detectionId)
    }

    if (scrollTo === 'anomalies') {
      requestAnimationFrame(() => {
        document
          .getElementById('detecciones-anomalias')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }

    if (detectionId || scrollTo) {
      const next = new URLSearchParams(searchParams)
      next.delete('detectionId')
      next.delete('scrollTo')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams, detections])

  const handleValidate = (id: string, status: DetectionStatus) => {
    setDetections((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d)),
    )
    const det = detections.find((d) => d.id === id)
    if (det && status === 'dismissed') {
      setFeedback(
        `${t('inspection.dismissedTitle')}: "${td(det.id)}" ${t('inspection.falsePositive')}`,
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
          {t('inspection.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t('inspection.subtitle')}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {t('inspection.capture')}: {inspectionSession.capturedAt}
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
        <div id="detecciones-anomalias">
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
    </div>
  )
}
