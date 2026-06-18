import type { DegradationCurve } from '../types/scada'
import type { AnomalySummaryBlock, WorkProgressBlock } from '../types/executiveReport'
import { createTranslator, getInitialLanguage, type Language, type TranslateFn } from '../i18n'

const SCALE = 2

export interface PdfChartImage {
  dataUrl: string
  width: number
  height: number
}

export interface PdfChartI18nOptions {
  language?: Language
  t?: TranslateFn
}

function resolveTranslator(options?: PdfChartI18nOptions): TranslateFn {
  if (options?.t) return options.t
  const language = options?.language ?? getInitialLanguage()
  return createTranslator(language)
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width * SCALE
  canvas.height = height * SCALE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D no disponible')
  ctx.scale(SCALE, SCALE)
  return { canvas, ctx }
}

function toChartImage(canvas: HTMLCanvasElement, width: number, height: number): PdfChartImage {
  return {
    dataUrl: canvas.toDataURL('image/png'),
    width,
    height,
  }
}

export function fitChartDimensions(
  image: PdfChartImage,
  maxWidth: number,
  maxHeight?: number,
): { width: number; height: number } {
  const aspect = image.width / image.height
  let width = maxWidth
  let height = maxWidth / aspect

  if (maxHeight != null && height > maxHeight) {
    height = maxHeight
    width = maxHeight * aspect
  }

  return { width, height }
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.fill()
}

export function renderProgressBarsChart(
  progress: WorkProgressBlock,
  i18nOptions?: PdfChartI18nOptions,
): PdfChartImage {
  const t = resolveTranslator(i18nOptions)
  const width = 360
  const height = 108
  const { canvas, ctx } = createCanvas(width, height)

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  const rows = [
    { label: t('pdf.plannedProgress'), value: progress.plannedProgressPct, color: '#94a3b8' },
    { label: t('pdf.actualProgress'), value: progress.actualProgressPct, color: '#14b8a6' },
  ]

  rows.forEach((row, index) => {
    const y = 16 + index * 44
    ctx.fillStyle = '#64748b'
    ctx.font = '11px system-ui, sans-serif'
    ctx.fillText(row.label, 0, y)
    ctx.fillStyle = '#334155'
    ctx.font = 'bold 11px system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${row.value}%`, width, y)
    ctx.textAlign = 'left'

    const barY = y + 8
    const barW = width
    const barH = 10
    ctx.fillStyle = '#f1f5f9'
    fillRoundRect(ctx, 0, barY, barW, barH, 5)
    ctx.fillStyle = row.color
    fillRoundRect(ctx, 0, barY, barW * (Math.min(row.value, 100) / 100), barH, 5)
  })

  const deviationColor = progress.deviationPct >= 0 ? '#0d9488' : '#e11d48'
  const deviationValue = `${progress.deviationPct > 0 ? '+' : ''}${progress.deviationPct}`
  ctx.fillStyle = deviationColor
  ctx.font = 'bold 12px system-ui, sans-serif'
  ctx.fillText(t('pdf.deviation', { value: deviationValue }), 0, height - 8)

  return toChartImage(canvas, width, height)
}

export function renderReviewDonutChart(
  anomalies: AnomalySummaryBlock,
  i18nOptions?: PdfChartI18nOptions,
): PdfChartImage {
  const t = resolveTranslator(i18nOptions)
  const width = 280
  const height = 200
  const { canvas, ctx } = createCanvas(width, height)

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  const segments = [
    { label: t('pdf.pending'), value: anomalies.pendingReview, color: '#f59e0b' },
    { label: t('pdf.inProgress'), value: anomalies.inProgress, color: '#3b82f6' },
    { label: t('pdf.resolved'), value: anomalies.resolved, color: '#14b8a6' },
  ]

  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1
  const cx = 78
  const cy = 98
  const outerR = 58
  const innerR = 34
  let start = -Math.PI / 2

  segments.forEach((segment) => {
    const angle = (segment.value / total) * Math.PI * 2
    if (segment.value <= 0) return
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, outerR, start, start + angle)
    ctx.closePath()
    ctx.fillStyle = segment.color
    ctx.fill()
    start += angle
  })

  ctx.beginPath()
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  ctx.fillStyle = '#334155'
  ctx.font = 'bold 16px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${anomalies.totalAnomalies}`, cx, cy + 2)
  ctx.font = '9px system-ui, sans-serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText(t('pdf.anomaliesLabel'), cx, cy + 14)
  ctx.textAlign = 'left'

  ctx.font = 'bold 11px system-ui, sans-serif'
  ctx.fillStyle = '#334155'
  ctx.fillText(t('pdf.reviewStatus'), 150, 24)

  segments.forEach((segment, index) => {
    const y = 44 + index * 28
    ctx.fillStyle = segment.color
    ctx.beginPath()
    ctx.arc(158, y - 4, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#334155'
    ctx.font = 'bold 11px system-ui, sans-serif'
    ctx.fillText(`${segment.value}`, 172, y)
    ctx.fillStyle = '#64748b'
    ctx.font = '10px system-ui, sans-serif'
    ctx.fillText(segment.label, 192, y)
  })

  ctx.fillStyle = '#64748b'
  ctx.font = '9px system-ui, sans-serif'
  ctx.fillText(t('pdf.thermalPeak', { temp: anomalies.thermalMaxC }), 150, height - 12)

  return toChartImage(canvas, width, height)
}

export function renderAnomalySummaryCards(
  anomalies: AnomalySummaryBlock,
  i18nOptions?: PdfChartI18nOptions,
): PdfChartImage {
  const t = resolveTranslator(i18nOptions)
  const width = 360
  const height = 72
  const { canvas, ctx } = createCanvas(width, height)

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  const cards = [
    {
      label: t('pdf.anomaliesDetected'),
      value: `${anomalies.totalAnomalies}`,
      bg: '#fff1f2',
      border: '#fecdd3',
      text: '#be123c',
    },
    {
      label: t('pdf.maxTemperatureDetected'),
      value: `${anomalies.thermalMaxC}C`,
      sub: anomalies.thermalMaxC >= 120 ? t('pdf.criticalThermalPeak') : undefined,
      bg: '#fffbeb',
      border: '#fde68a',
      text: '#b45309',
    },
  ]

  cards.forEach((card, index) => {
    const x = index * 184
    const w = 172
    ctx.fillStyle = card.bg
    ctx.strokeStyle = card.border
    ctx.lineWidth = 1
    fillRoundRect(ctx, x, 0, w, height - 4, 8)
    ctx.stroke()

    ctx.fillStyle = card.text
    ctx.font = 'bold 22px system-ui, sans-serif'
    ctx.fillText(card.value, x + 12, 32)
    ctx.font = '10px system-ui, sans-serif'
    ctx.fillText(card.label, x + 12, 50)
    if ('sub' in card && card.sub) {
      ctx.fillStyle = '#92400e'
      ctx.font = '9px system-ui, sans-serif'
      ctx.fillText(card.sub, x + 12, 64)
    }
  })

  return toChartImage(canvas, width, height)
}

export function renderDegradationLineChart(
  curve: DegradationCurve,
  i18nOptions?: PdfChartI18nOptions,
): PdfChartImage {
  const t = resolveTranslator(i18nOptions)
  const width = 520
  const height = 220
  const { canvas, ctx } = createCanvas(width, height)

  const pad = { top: 28, right: 16, bottom: 36, left: 44 }
  const plotW = width - pad.left - pad.right
  const plotH = height - pad.top - pad.bottom

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  const points = curve.series
    .map((point) => ({
      label: point.timestamp,
      value: point.projectedTemp ?? point.droneTemp ?? null,
      projected: point.projectedTemp != null,
    }))
    .filter((point) => point.value != null) as { label: string; value: number; projected: boolean }[]

  if (points.length === 0) {
    ctx.fillStyle = '#64748b'
    ctx.font = '12px system-ui, sans-serif'
    ctx.fillText(t('pdf.noCurveData'), pad.left, pad.top + 20)
    return toChartImage(canvas, width, height)
  }

  const values = points.map((point) => point.value)
  const minY = Math.min(...values, curve.criticalTempThreshold) - 5
  const maxY = Math.max(...values, curve.criticalTempThreshold) + 5
  const rangeY = maxY - minY || 1

  const toX = (index: number) => pad.left + (index / Math.max(points.length - 1, 1)) * plotW
  const toY = (value: number) => pad.top + plotH - ((value - minY) / rangeY) * plotH

  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (plotH / 4) * i
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(pad.left + plotW, y)
    ctx.stroke()
  }

  const thresholdY = toY(curve.criticalTempThreshold)
  ctx.strokeStyle = '#ef4444'
  ctx.setLineDash([5, 4])
  ctx.beginPath()
  ctx.moveTo(pad.left, thresholdY)
  ctx.lineTo(pad.left + plotW, thresholdY)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#ef4444'
  ctx.font = '9px system-ui, sans-serif'
  ctx.fillText(t('pdf.criticalThreshold', { temp: curve.criticalTempThreshold }), pad.left + 4, thresholdY - 4)

  ctx.strokeStyle = '#8b5cf6'
  ctx.lineWidth = 2
  ctx.beginPath()
  points.forEach((point, index) => {
    const x = toX(index)
    const y = toY(point.value)
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()

  points.forEach((point, index) => {
    const x = toX(index)
    const y = toY(point.value)
    ctx.beginPath()
    ctx.arc(x, y, point.projected ? 2.5 : 3.5, 0, Math.PI * 2)
    ctx.fillStyle = point.projected ? '#c4b5fd' : '#8b5cf6'
    ctx.fill()
  })

  ctx.fillStyle = '#334155'
  ctx.font = 'bold 11px system-ui, sans-serif'
  ctx.fillText(t('pdf.degradationCurveTitle'), pad.left, 16)

  ctx.fillStyle = '#64748b'
  ctx.font = '9px system-ui, sans-serif'
  const labelStep = Math.max(1, Math.floor(points.length / 6))
  points.forEach((point, index) => {
    if (index % labelStep !== 0 && index !== points.length - 1) return
    ctx.save()
    ctx.translate(toX(index), height - 8)
    ctx.rotate(-0.45)
    ctx.textAlign = 'right'
    ctx.fillText(point.label, 0, 0)
    ctx.restore()
  })

  ctx.textAlign = 'right'
  ctx.fillStyle = '#64748b'
  ctx.fillText(`${Math.round(minY)} C`, pad.left - 6, pad.top + plotH)
  ctx.fillText(`${Math.round(maxY)} C`, pad.left - 6, pad.top + 4)

  return toChartImage(canvas, width, height)
}
