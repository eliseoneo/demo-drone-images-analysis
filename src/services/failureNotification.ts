import type {
  Detection,
  FailureNotificationOptions,
  FailureNotificationResult,
  InspectionSession,
} from '../types'

const STORAGE_KEY = 'drone-inspection-notification-prefs'

export interface StoredNotificationPrefs {
  emailTo: string
  slackWebhookUrl: string
  slackChannel: string
}

const defaultEmail =
  import.meta.env.VITE_DEFAULT_FAILURE_EMAIL ?? 'operaciones@empresa.cl'

export function loadNotificationPrefs(): StoredNotificationPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return { ...defaultPrefs(), ...JSON.parse(raw) }
    }
  } catch {
    /* ignore */
  }
  return defaultPrefs()
}

export function saveNotificationPrefs(prefs: StoredNotificationPrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

function defaultPrefs(): StoredNotificationPrefs {
  return {
    emailTo: defaultEmail,
    slackWebhookUrl: import.meta.env.VITE_SLACK_WEBHOOK_URL ?? '',
    slackChannel: import.meta.env.VITE_SLACK_CHANNEL ?? '#alertas-drones',
  }
}

function buildEmailBody(detection: Detection, session: InspectionSession) {
  return [
    'Falla confirmada — Inspección con drone',
    '',
    `Anomalía: ${detection.label}`,
    `Confianza IA: ${Math.round(detection.confidence * 100)}%`,
    `Ubicación: ${session.location}`,
    `Captura: ${session.capturedAt}`,
    `Sesión: ${session.id}`,
    `Detección: ${detection.id}`,
  ].join('\n')
}

function resolveImageUrl(imagePath: string) {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  return `${window.location.origin}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

async function sendEmailNotification(
  detection: Detection,
  session: InspectionSession,
  emailTo: string,
): Promise<FailureNotificationResult['email']> {
  const subject = `[Falla confirmada] ${detection.label} — ${session.location}`
  const body = buildEmailBody(detection, session)
  const apiUrl = import.meta.env.VITE_NOTIFICATION_API_URL

  if (apiUrl) {
    const response = await fetch(`${apiUrl}/notify/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: emailTo,
        subject,
        body,
        imageUrl: resolveImageUrl(session.visualImage),
        detectionId: detection.id,
        sessionId: session.id,
      }),
    })

    if (!response.ok) {
      return {
        ok: false,
        message: `Error al enviar correo (${response.status}).`,
      }
    }

    return { ok: true, message: `Correo enviado a ${emailTo}.` }
  }

  await new Promise((resolve) => setTimeout(resolve, 700))

  const mailto = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(mailto, '_blank', 'noopener,noreferrer')

  return {
    ok: true,
    message: `Reporte preparado para ${emailTo} (cliente de correo o simulación demo).`,
  }
}

async function sendSlackNotification(
  detection: Detection,
  session: InspectionSession,
  options: Pick<
    FailureNotificationOptions,
    'slackWebhookUrl' | 'slackChannel' | 'includeImageInSlack'
  >,
): Promise<FailureNotificationResult['slack']> {
  const webhookUrl = options.slackWebhookUrl.trim()
  if (!webhookUrl) {
    return { ok: false, message: 'URL de webhook de Slack no configurada.' }
  }

  const text = [
    '*Falla confirmada — Inspección con drone*',
    `• *Anomalía:* ${detection.label}`,
    `• *Confianza IA:* ${Math.round(detection.confidence * 100)}%`,
    `• *Ubicación:* ${session.location}`,
    `• *Captura:* ${session.capturedAt}`,
  ].join('\n')

  const blocks: Record<string, unknown>[] = [
    {
      type: 'section',
      text: { type: 'mrkdwn', text },
    },
  ]

  if (options.includeImageInSlack) {
    blocks.push({
      type: 'image',
      image_url: resolveImageUrl(session.visualImage),
      alt_text: detection.label,
    })
  }

  const payload: Record<string, unknown> = { blocks, text: detection.label }
  const channel = options.slackChannel.trim()
  if (channel) {
    payload.channel = channel
  }

  const apiUrl = import.meta.env.VITE_NOTIFICATION_API_URL
  if (apiUrl) {
    const response = await fetch(`${apiUrl}/notify/slack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webhookUrl,
        channel,
        payload,
        detectionId: detection.id,
        sessionId: session.id,
      }),
    })

    if (!response.ok) {
      return {
        ok: false,
        message: `Error al enviar a Slack (${response.status}).`,
      }
    }

    const target = channel || 'canal configurado en webhook'
    return {
      ok: true,
      message: `Notificación enviada a Slack (${target})${options.includeImageInSlack ? ' con imagen adjunta.' : '.'}`,
    }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      const target = channel || 'canal configurado en webhook'
      return {
        ok: true,
        message: `Notificación enviada a Slack (${target})${options.includeImageInSlack ? ' con imagen adjunta.' : '.'}`,
      }
    }

    const detail = await response.text()
    return {
      ok: false,
      message: `Slack respondió con error (${response.status}): ${detail.slice(0, 120)}`,
    }
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const target = channel || 'canal del webhook'
    return {
      ok: true,
      message: `Slack (${target}): notificación registrada en modo demo. Para envío real, configure VITE_NOTIFICATION_API_URL o un proxy backend.`,
    }
  }
}

export async function sendFailureNotification(
  detection: Detection,
  session: InspectionSession,
  options: FailureNotificationOptions,
): Promise<FailureNotificationResult> {
  saveNotificationPrefs({
    emailTo: options.emailTo,
    slackWebhookUrl: options.slackWebhookUrl,
    slackChannel: options.slackChannel,
  })

  const email = await sendEmailNotification(detection, session, options.emailTo)

  let slack: FailureNotificationResult['slack']
  if (options.slackEnabled) {
    slack = await sendSlackNotification(detection, session, options)
  }

  return { email, slack }
}
