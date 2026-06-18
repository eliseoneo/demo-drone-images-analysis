import jsPDF from 'jspdf'
import type { ExecutiveReportData } from '../types/executiveReport'
import { defaultExecutiveReportId, getExecutiveReportData } from '../data/mocks/executiveReport'
import {
  fitChartDimensions,
  renderAnomalySummaryCards,
  renderDegradationLineChart,
  renderProgressBarsChart,
  renderReviewDonutChart,
  type PdfChartImage,
} from '../utils/reportPdfCharts'
import { createTranslator, getInitialLanguage, getMockText, type Language, type TranslateFn } from '../i18n'

const PAGE_W = 210
const MARGIN = 14
const CONTENT_W = PAGE_W - MARGIN * 2
const FOOTER_Y = 285

function addFooter(doc: jsPDF, t: TranslateFn) {
  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.text(t('pdf.footer'), MARGIN, FOOTER_Y)
}

function ensureSpace(doc: jsPDF, y: number, needed: number, t: TranslateFn): number {
  if (y + needed <= FOOTER_Y - 8) return y
  addFooter(doc, t)
  doc.addPage()
  return 20
}

function addChartImage(
  doc: jsPDF,
  chart: PdfChartImage,
  y: number,
  t: TranslateFn,
  maxWidth = CONTENT_W,
  maxHeight?: number,
): number {
  const { width, height } = fitChartDimensions(chart, maxWidth, maxHeight)
  const nextY = ensureSpace(doc, y, height + 4, t)
  const x = MARGIN + (CONTENT_W - width) / 2

  doc.addImage(chart.dataUrl, 'PNG', x, nextY, width, height, undefined, 'FAST')
  return nextY + height + 6
}

export function generateExecutiveReport(report?: ExecutiveReportData, language?: Language) {
  const data = report ?? getExecutiveReportData(defaultExecutiveReportId)
  if (!data) return

  const activeLanguage = language ?? getInitialLanguage()
  const t = createTranslator(activeLanguage)
  const tm = (value: string) => getMockText(value, activeLanguage)

  const doc = new jsPDF()
  const date = new Date().toISOString().split('T')[0]
  const scopeLabel = data.scope === 'work' ? t('pdf.scopeWork') : t('pdf.scopeInspection')

  doc.setFontSize(18)
  doc.setTextColor(30, 41, 59)
  doc.text(t('pdf.title'), MARGIN, 22)

  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(`${t('pdf.generated')}: ${date}`, MARGIN, 30)
  doc.text(`${scopeLabel}: ${tm(data.title)}`, MARGIN, 36)
  doc.text(tm(data.subtitle), MARGIN, 42)

  let y = 52

  doc.setFontSize(12)
  doc.setTextColor(30, 41, 59)
  doc.text(t('pdf.section1'), MARGIN, y)
  y += 8

  y = addChartImage(doc, renderProgressBarsChart(data.workProgress, { language: activeLanguage, t }), y, t)

  const alertColor = data.workProgress.delayAlertSeverity === 'critical' ? [225, 29, 72] : [217, 119, 6]
  doc.setFontSize(10)
  doc.setTextColor(alertColor[0], alertColor[1], alertColor[2])
  y = ensureSpace(doc, y, 8, t)
  doc.text(t('forecast.delayAlert', { days: data.workProgress.delayAlertDays }), MARGIN, y)
  y += 12

  y = ensureSpace(doc, y, 14, t)
  doc.setFontSize(12)
  doc.setTextColor(30, 41, 59)
  doc.text(t('pdf.section2'), MARGIN, y)
  y += 8

  y = addChartImage(doc, renderAnomalySummaryCards(data.anomalies, { language: activeLanguage, t }), y, t)

  if (data.anomalies.thermalHighlight) {
    y = ensureSpace(doc, y, 8, t)
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text(tm(data.anomalies.thermalHighlight), MARGIN, y)
    y += 8
  }

  y = addChartImage(doc, renderReviewDonutChart(data.anomalies, { language: activeLanguage, t }), y, t)

  y = ensureSpace(doc, y, 14, t)
  doc.setFontSize(12)
  doc.setTextColor(30, 41, 59)
  doc.text(t('pdf.section3'), MARGIN, y)
  y += 8

  y = ensureSpace(doc, y, 8, t)
  doc.setFontSize(10)
  doc.setTextColor(30, 41, 59)
  doc.text(tm(data.wearProjection.wearRateHeadline), MARGIN, y)
  y += 6

  y = addChartImage(doc, renderDegradationLineChart(data.wearProjection.curve, { language: activeLanguage, t }), y, t)

  y = ensureSpace(doc, y, 18, t)
  doc.setTextColor(225, 29, 72)
  doc.setFontSize(10)
  doc.text(tm(data.wearProjection.projectionText), MARGIN, y)
  y += 6

  doc.setTextColor(100, 116, 139)
  doc.text(tm(data.wearProjection.actionLabel), MARGIN, y)
  y += 6
  doc.text(
    t('pdf.assetLine', {
      asset: tm(data.wearProjection.assetName),
      days: data.wearProjection.criticalFailureDays,
    }),
    MARGIN,
    y,
  )

  addFooter(doc, t)

  const slug = data.id.replace(/[^a-z0-9-]/gi, '-')
  doc.save(`${t('pdf.filenamePrefix')}-${slug}-${date}.pdf`)
}
