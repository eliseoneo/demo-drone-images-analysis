import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { dockSensorStatus } from '../data/mocks/dockSensors'
import { progressMetrics, executionProjection } from '../data/mocks/progress'
import { inspectionSession } from '../data/mocks/detections'
import { timelineEntries } from '../data/mocks/timeline'

const statusLabels = {
  on_time: 'En tiempo',
  delay_warning: 'Alerta de retraso',
  critical_delay: 'Retraso crítico',
}

export function generateExecutiveReport() {
  const doc = new jsPDF()
  const date = new Date().toISOString().split('T')[0]

  doc.setFontSize(18)
  doc.setTextColor(30, 41, 59)
  doc.text('Reporte Ejecutivo — Análisis con Drones', 14, 22)

  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(`Generado: ${date}`, 14, 30)
  doc.text(`Proyecto: ${progressMetrics.projectName}`, 14, 36)

  doc.setFontSize(12)
  doc.setTextColor(30, 41, 59)
  doc.text('Resumen de sensores — DJI Dock 2', 14, 48)

  autoTable(doc, {
    startY: 52,
    head: [['Sensor', 'Valor', 'Estado']],
    body: [
      ['Viento', `${dockSensorStatus.windSpeedKmh} km/h`, 'Normal'],
      [
        'Lluvia',
        dockSensorStatus.rainMmH > 0
          ? `${dockSensorStatus.rainMmH} mm/h`
          : 'Sin lluvia',
        'Sin precipitación',
      ],
      ['Sincronización', dockSensorStatus.lastSync, 'Sincronizado'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
  })

  const y1 = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

  doc.setFontSize(12)
  doc.text('Avance de obra — Instalación de líneas', 14, y1)

  autoTable(doc, {
    startY: y1 + 4,
    head: [['Métrica', 'Valor']],
    body: [
      ['Planificado hoy', `${progressMetrics.plannedToday} ${progressMetrics.unit}`],
      ['Ejecutado hoy', `${progressMetrics.executedToday} ${progressMetrics.unit}`],
      [
        'Cumplimiento',
        `${Math.round((progressMetrics.executedToday / progressMetrics.plannedToday) * 100)}%`,
      ],
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
  })

  const y2 = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

  doc.setFontSize(12)
  doc.text('Proyección de ejecución', 14, y2)
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(`Estado: ${statusLabels[executionProjection.status]}`, 14, y2 + 6)
  doc.text(executionProjection.message, 14, y2 + 12)

  const confirmed = inspectionSession.detections.filter((d) => d.status === 'confirmed')
  const y3 = y2 + 22

  doc.setFontSize(12)
  doc.setTextColor(30, 41, 59)
  doc.text('Detecciones confirmadas (IA Nivel 1)', 14, y3)

  const detectionRows =
    confirmed.length > 0
      ? confirmed.map((d) => [
          d.label,
          `${Math.round(d.confidence * 100)}%`,
          inspectionSession.location,
        ])
      : [['Sin detecciones confirmadas en sesión actual', '—', '—']]

  autoTable(doc, {
    startY: y3 + 4,
    head: [['Anomalía', 'Confianza', 'Ubicación']],
    body: detectionRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
  })

  const y4 = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

  doc.setFontSize(12)
  doc.text('Línea de tiempo — Antes y Después', 14, y4)

  autoTable(doc, {
    startY: y4 + 4,
    head: [['Fecha', 'Hito', 'Etapa', 'Descripción']],
    body: timelineEntries.map((e) => [e.date, e.milestone, e.label, e.title]),
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
    styles: { fontSize: 8 },
  })

  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.text(
    'Documento generado en modo On-Premise. Datos procesados en red corporativa.',
    14,
    285,
  )

  doc.save(`reporte-ejecutivo-${date}.pdf`)
}
