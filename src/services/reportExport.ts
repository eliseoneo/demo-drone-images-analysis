import jsPDF from 'jspdf'
import type { ExecutiveReportData } from '../types/executiveReport'
import {
  defaultExecutiveReportId,
  getExecutiveReportData,
} from '../data/mocks/executiveReport'
import {
  fitChartDimensions,
  renderAnomalySummaryCards,
  renderDegradationLineChart,
  renderProgressBarsChart,
  renderReviewDonutChart,
  type PdfChartImage,
} from '../utils/reportPdfCharts'

const PAGE_W = 210
const MARGIN = 14
const CONTENT_W = PAGE_W - MARGIN * 2
const FOOTER_Y = 285

function addFooter(doc: jsPDF) {
  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.text(
    'Documento generado en modo On-Premise. Datos procesados en red corporativa.',
    MARGIN,
    FOOTER_Y,
  )
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed <= FOOTER_Y - 8) return y
  addFooter(doc)
  doc.addPage()
  return 20
}

function addChartImage(
  doc: jsPDF,
  chart: PdfChartImage,
  y: number,
  maxWidth = CONTENT_W,
  maxHeight?: number,
): number {
  const { width, height } = fitChartDimensions(chart, maxWidth, maxHeight)
  const nextY = ensureSpace(doc, y, height + 4)
  const x = MARGIN + (CONTENT_W - width) / 2

  doc.addImage(chart.dataUrl, 'PNG', x, nextY, width, height, undefined, 'FAST')
  return nextY + height + 6
}

export function generateExecutiveReport(report?: ExecutiveReportData) {
  const data = report ?? getExecutiveReportData(defaultExecutiveReportId)
  if (!data) return

  const doc = new jsPDF()
  const date = new Date().toISOString().split('T')[0]
  const scopeLabel = data.scope === 'work' ? 'Obra' : 'Inspección'

  doc.setFontSize(18)
  doc.setTextColor(30, 41, 59)
  doc.text('Reporte Ejecutivo — Análisis con Drones', MARGIN, 22)

  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(`Generado: ${date}`, MARGIN, 30)
  doc.text(`${scopeLabel}: ${data.title}`, MARGIN, 36)
  doc.text(data.subtitle, MARGIN, 42)

  let y = 52

  // Bloque 1 — Avance de obra y desviaciones
  doc.setFontSize(12)
  doc.setTextColor(30, 41, 59)
  doc.text('1. Avance de obra y desviaciones', MARGIN, y)
  y += 8

  y = addChartImage(doc, renderProgressBarsChart(data.workProgress), y)

  const alertColor =
    data.workProgress.delayAlertSeverity === 'critical' ? [225, 29, 72] : [217, 119, 6]
  doc.setFontSize(10)
  doc.setTextColor(alertColor[0], alertColor[1], alertColor[2])
  y = ensureSpace(doc, y, 8)
  doc.text(data.workProgress.delayAlert, MARGIN, y)
  y += 12

  // Bloque 2 — Anomalías y revisiones
  y = ensureSpace(doc, y, 14)
  doc.setFontSize(12)
  doc.setTextColor(30, 41, 59)
  doc.text('2. Indicadores de anomalías y estado de revisiones', MARGIN, y)
  y += 8

  y = addChartImage(doc, renderAnomalySummaryCards(data.anomalies), y)

  if (data.anomalies.thermalHighlight) {
    y = ensureSpace(doc, y, 8)
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text(data.anomalies.thermalHighlight, MARGIN, y)
    y += 8
  }

  y = addChartImage(doc, renderReviewDonutChart(data.anomalies), y)

  // Bloque 3 — Proyecciones por desgaste
  y = ensureSpace(doc, y, 14)
  doc.setFontSize(12)
  doc.setTextColor(30, 41, 59)
  doc.text('3. Proyecciones por desgaste (IA predictiva)', MARGIN, y)
  y += 8

  y = ensureSpace(doc, y, 8)
  doc.setFontSize(10)
  doc.setTextColor(30, 41, 59)
  doc.text(data.wearProjection.wearRateHeadline, MARGIN, y)
  y += 6

  y = addChartImage(doc, renderDegradationLineChart(data.wearProjection.curve), y)

  y = ensureSpace(doc, y, 18)
  doc.setTextColor(225, 29, 72)
  doc.setFontSize(10)
  doc.text(data.wearProjection.projectionText, MARGIN, y)
  y += 6

  doc.setTextColor(100, 116, 139)
  doc.text(data.wearProjection.actionLabel, MARGIN, y)
  y += 6
  doc.text(
    `Activo: ${data.wearProjection.assetName} · Ventana crítica: ${data.wearProjection.criticalFailureDays} días`,
    MARGIN,
    y,
  )

  addFooter(doc)

  const slug = data.id.replace(/[^a-z0-9-]/gi, '-')
  doc.save(`reporte-ejecutivo-${slug}-${date}.pdf`)
}
