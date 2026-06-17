import type { WorkCategory } from '../../types'

export const progressCategoryConfig: Record<
  WorkCategory,
  { subtitle: string; progressLabel: string }
> = {
  construction: {
    subtitle: 'Inspección de obra: avance planificado vs. ejecutado hoy',
    progressLabel: 'Avance del día',
  },
  powerline: {
    subtitle: 'Revisión de línea: tramos planificados vs. inspeccionados hoy',
    progressLabel: 'Cobertura del día',
  },
  tower: {
    subtitle: 'Inspección de torres: planificado vs. ejecutado hoy',
    progressLabel: 'Torres revisadas hoy',
  },
  substation: {
    subtitle: 'Revisión de subestación: activos planificados vs. inspeccionados hoy',
    progressLabel: 'Activos revisados hoy',
  },
}
