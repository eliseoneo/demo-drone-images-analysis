import type { InspectionSession } from '../../types'

export const inspectionSession: InspectionSession = {
  id: 'insp-001',
  visualImage: '/assets/termica-transformador-01.jpeg',
  thermalImage: '/assets/termica-transformador.jpeg',
  location: 'inspection.location',
  capturedAt: '2026-06-17 11:45',
  detections: [
    {
      id: 'det-001',
      label: 'Sobrecalentamiento en transformador',
      x: 36,
      y: 30,
      width: 26,
      height: 32,
      confidence: 0.94,
      status: 'confirmed',
    },
    {
      id: 'det-002',
      label: 'Punto caliente en bushings',
      x: 40,
      y: 18,
      width: 16,
      height: 14,
      confidence: 0.87,
      status: 'pending',
    },
  ],
}
