import type { TimelineEntry } from '../../types'

export const timelineEntries: TimelineEntry[] = [
  {
    id: 'tl-001',
    date: '2026-06-17',
    label: 'Después',
    title: 'Post-reparación verificada',
    description: 'Inspección térmica confirma temperatura normalizada en T-401.',
    image: '/assets/timeline-after.svg',
    milestone: 'Transformador T-401',
  },
  {
    id: 'tl-002',
    date: '2026-06-15',
    label: 'Reparación completada',
    title: 'Intervención en campo finalizada',
    description: 'Equipo de mantenimiento reemplazó aislador dañado en torre 14.',
    image: '/assets/timeline-repair.svg',
    milestone: 'Transformador T-401',
  },
  {
    id: 'tl-003',
    date: '2026-06-12',
    label: 'Antes',
    title: 'Detección inicial por drone',
    description: 'IA Nivel 1 identificó sobrecalentamiento y aislador comprometido.',
    image: '/assets/timeline-before.svg',
    milestone: 'Transformador T-401',
  },
  {
    id: 'tl-004',
    date: '2026-06-10',
    label: 'Antes',
    title: 'Línea de referencia instalada',
    description: 'Estado inicial del tramo 7 antes del avance de obra.',
    image: '/assets/timeline-line.svg',
    milestone: 'Línea 138 kV — Tramo Norte',
  },
]
