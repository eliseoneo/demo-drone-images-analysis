import type {
  Detection,
  FailureNotificationOptions,
  FailureNotificationResult,
  InspectionSession,
} from '../types'
import {
  createTranslator,
  getInitialLanguage,
  getMockText,
  type Language,
  type TranslationParams,
} from '../i18n'

const STORAGE_KEY = 'drone-inspection-notification-prefs'

export interface StoredNotificationPrefs {
  emailTo: string
  slackWebhookUrl: string
  slackChannel: string
}

const defaultEmail =
  import.meta.env.VITE_DEFAULT_FAILURE_EMAIL ?? 'operaciones@empresa.cl'

type NotificationTranslateFn = (key: string, params?: TranslationParams) => string

interface NotificationI18nContext {
  t: NotificationTranslateFn
  tm: (mockKey: string) => string
  td: (detectionId: string) => string
}

export interface FailureNotificationI18nOptions {
  t?: NotificationTranslateFn
  tm?: (mockKey: string) => string
  td?: (detectionId: string) => string
  language?: Language
}

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

function resolveI18nContext(options?: FailureNotificationI18nOptions): NotificationI18nContext {
  const language = options?.language ?? getInitialLanguage()
  const t = options?.t ?? createTranslator(language)
  const tm = options?.tm ?? ((mockKey: string) => getMockText(mockKey, language))
  const td =
    options?.td ??
    ((detectionId: string) => getMockText(`detections.${detectionId}.label`, language))

  return { t, tm, td }
}

function buildEmailBody(
  detection: Detection,
  session: InspectionSession,
  i18n: NotificationI18nContext,
) {
  const locationText = i18n.tm('inspection.location')
  const resolvedLocation =
    locationText === 'inspection.location' ? session.location : locationText

  return [
    i18n.t('inspection.notification.emailSubject'),
    '',
    `${i18n.t('inspection.notification.anomaly')}: ${i18n.td(detection.id)}`,
    `${i18n.t('inspection.notification.confidence')}: ${Math.round(detection.confidence * 100)}%`,
    `${i18n.t('inspection.notification.location')}: ${resolvedLocation}`,
    `${i18n.t('inspection.notification.capturedAt')}: ${session.capturedAt}`,
    `${i18n.t('inspection.notification.session')}: ${session.id}`,
    `${i18n.t('inspection.notification.detection')}: ${detection.id}`,
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
  i18n: NotificationI18nContext,
): Promise<FailureNotificationResult['email']> {
  const locationText = i18n.tm('inspection.location')
  const resolvedLocation =
    locationText === 'inspection.location' ? session.location : locationText
  const subject = `[${i18n.t('inspection.failureConfirmed')}] ${i18n.td(detection.id)} — ${resolvedLocation}`
  const body = buildEmailBody(detection, session, i18n)
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
        message: i18n.t('inspection.notification.emailError', { status: response.status }),
      }
    }

    return { ok: true, message: i18n.t('inspection.notification.emailSent', { email: emailTo }) }
  }

  await new Promise((resolve) => setTimeout(resolve, 700))

  const mailto = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(mailto, '_blank', 'noopener,noreferrer')

  return {
    ok: true,
    message: i18n.t('inspection.notification.emailPrepared', { email: emailTo }),
  }
}

async function sendSlackNotification(
  detection: Detection,
  session: InspectionSession,
  i18n: NotificationI18nContext,
  options: Pick<
    FailureNotificationOptions,
    'slackWebhookUrl' | 'slackChannel' | 'includeImageInSlack'
  >,
): Promise<FailureNotificationResult['slack']> {
  const webhookUrl = options.slackWebhookUrl.trim()
  if (!webhookUrl) {
    return { ok: false, message: i18n.t('inspection.notification.slackWebhookMissing') }
  }

  const locationText = i18n.tm('inspection.location')
  const resolvedLocation =
    locationText === 'inspection.location' ? session.location : locationText

  const text = [
    `*${i18n.t('inspection.notification.emailSubject')}*`,
    `• *${i18n.t('inspection.notification.anomaly')}:* ${i18n.td(detection.id)}`,
    `• *${i18n.t('inspection.notification.confidence')}:* ${Math.round(detection.confidence * 100)}%`,
    `• *${i18n.t('inspection.notification.location')}:* ${resolvedLocation}`,
    `• *${i18n.t('inspection.notification.capturedAt')}:* ${session.capturedAt}`,
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
      alt_text: i18n.td(detection.id),
    })
  }

  const payload: Record<string, unknown> = { blocks, text: i18n.td(detection.id) }
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
      const detail = await response.text()
      return {
        ok: false,
        message: i18n.t('inspection.notification.slackError', {
          status: response.status,
          detail: detail.slice(0, 120),
        }),
      }
    }

    const target = channel || i18n.t('inspection.notification.slackTargetConfigured')
    const imageSuffix = options.includeImageInSlack
      ? i18n.t('inspection.notification.slackSentWithImage')
      : i18n.t('inspection.notification.slackSentPlain')
    return {
      ok: true,
      message: i18n.t('inspection.notification.slackSent', { target, imageSuffix }),
    }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      const target = channel || i18n.t('inspection.notification.slackTargetConfigured')
      const imageSuffix = options.includeImageInSlack
        ? i18n.t('inspection.notification.slackSentWithImage')
        : i18n.t('inspection.notification.slackSentPlain')
      return {
        ok: true,
        message: i18n.t('inspection.notification.slackSent', { target, imageSuffix }),
      }
    }

    const detail = await response.text()
    return {
      ok: false,
      message: i18n.t('inspection.notification.slackError', {
        status: response.status,
        detail: detail.slice(0, 120),
      }),
    }
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const target = channel || i18n.t('inspection.notification.slackTargetWebhook')
    return {
      ok: true,
      message: i18n.t('inspection.notification.slackDemo', { target }),
    }
  }
}

export async function sendFailureNotification(
  detection: Detection,
  session: InspectionSession,
  options: FailureNotificationOptions,
  i18nOptions?: FailureNotificationI18nOptions,
): Promise<FailureNotificationResult> {
  const i18n = resolveI18nContext(i18nOptions)

  saveNotificationPrefs({
    emailTo: options.emailTo,
    slackWebhookUrl: options.slackWebhookUrl,
    slackChannel: options.slackChannel,
  })

  const email = await sendEmailNotification(detection, session, options.emailTo, i18n)

  let slack: FailureNotificationResult['slack']
  if (options.slackEnabled) {
    slack = await sendSlackNotification(detection, session, i18n, options)
  }

  return { email, slack }
}
