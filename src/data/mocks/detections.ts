import type { InspectionSession } from '../../types'

export const inspectionSession: InspectionSession = {
  id: 'insp-001',
  visualImage: '/assets/visual-sample.svg',
  thermalImage: '/assets/thermal-sample.svg',
  location: 'Transformador T-401 — Subestación Norte',
  capturedAt: '2026-06-17 11:45',
  detections: [
    {
      id: 'det-001',
      label: 'Sobrecalentamiento en transformador',
      x: 42,
      y: 28,
      width: 22,
      height: 30,
      confidence: 0.94,
      status: 'confirmed',
    },
    {
      id: 'det-002',
      label: 'Aislador dañado',
      x: 18,
      y: 52,
      width: 14,
      height: 18,
      confidence: 0.87,
      status: 'dismissed',
    },
  ],
}
