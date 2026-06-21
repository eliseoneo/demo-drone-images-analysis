import type { TimelineEntry } from '../../types'
import { publicUrl } from '../../utils/publicUrl'

export const timelineEntries: TimelineEntry[] = [
  {
    id: 'tl-001',
    date: '2026-06-17',
    label: 'after',
    title: 'Post-reparación verificada',
    description: 'Inspección térmica confirma temperatura normalizada en T-401.',
    image: publicUrl('clips/clip-04.jpg'),
    milestone: 'timeline.milestone.t401',
  },
  {
    id: 'tl-002',
    date: '2026-06-15',
    label: 'repairCompleted',
    title: 'Intervención en campo finalizada',
    description: 'Equipo de mantenimiento reemplazó aislador dañado en torre 14.',
    image: publicUrl('clips/clip-03.jpg'),
    milestone: 'timeline.milestone.t401',
  },
  {
    id: 'tl-003',
    date: '2026-06-12',
    label: 'before',
    title: 'Detección inicial por drone',
    description: 'IA Nivel 1 identificó sobrecalentamiento y aislador comprometido.',
    image: publicUrl('assets/termica-transformador-01.jpeg'),
    milestone: 'timeline.milestone.t401',
  },
  {
    id: 'tl-004',
    date: '2026-06-10',
    label: 'before',
    title: 'Línea de referencia instalada',
    description: 'Estado inicial del tramo 7 antes del avance de obra.',
    image: publicUrl('clips/clip-01.jpg'),
    milestone: 'timeline.milestone.line138',
  },
]
