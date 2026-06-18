import { useEffect, useState } from 'react'
import { Hash, Loader2, Mail, Send, X } from 'lucide-react'
import {
  loadNotificationPrefs,
  sendFailureNotification,
} from '../../services/failureNotification'
import { useLanguage } from '../../context/LanguageContext'
import type { Detection, FailureNotificationOptions, InspectionSession } from '../../types'

interface ConfirmFailureDialogProps {
  detection: Detection
  session: InspectionSession
  open: boolean
  onClose: () => void
  onConfirmed: (resultMessage: string) => void
}

export function ConfirmFailureDialog({
  detection,
  session,
  open,
  onClose,
  onConfirmed,
}: ConfirmFailureDialogProps) {
  const { t } = useLanguage()
  const [emailTo, setEmailTo] = useState('')
  const [slackEnabled, setSlackEnabled] = useState(false)
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('')
  const [slackChannel, setSlackChannel] = useState('')
  const [includeImageInSlack, setIncludeImageInSlack] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const prefs = loadNotificationPrefs()
    setEmailTo(prefs.emailTo)
    setSlackWebhookUrl(prefs.slackWebhookUrl)
    setSlackChannel(prefs.slackChannel)
    setSlackEnabled(Boolean(prefs.slackWebhookUrl))
    setIncludeImageInSlack(true)
    setError(null)
  }, [open, detection.id])

  if (!open) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!emailTo.trim()) {
      setError(t('Indique un correo de destino.'))
      return
    }

    if (slackEnabled && !slackWebhookUrl.trim()) {
      setError(t('Para Slack, configure la URL del webhook entrante.'))
      return
    }

    const options: FailureNotificationOptions = {
      emailTo: emailTo.trim(),
      slackEnabled,
      slackWebhookUrl: slackWebhookUrl.trim(),
      slackChannel: slackChannel.trim(),
      includeImageInSlack,
    }

    setSending(true)
    try {
      const result = await sendFailureNotification(detection, session, options)
      const parts = [result.email.message]
      if (result.slack) parts.push(result.slack.message)

      const allOk =
        result.email.ok && (result.slack ? result.slack.ok : true)

      if (!allOk) {
        setError(parts.join(' '))
        return
      }

      onConfirmed(
        `${t('Falla confirmada')}: "${t(detection.label)}". ${parts.join(' ')}`,
      )
      onClose()
    } catch {
      setError(t('Error inesperado al enviar las notificaciones.'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-failure-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2
              id="confirm-failure-title"
              className="text-base font-semibold text-slate-800"
            >
              {t('Confirmar falla y notificar')}
            </h2>
            <p className="mt-1 text-xs text-slate-500">{t(detection.label)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label={t('Cerrar')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-5 py-4">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail className="h-4 w-4 text-teal-600" />
              {t('Correo electrónico')}
            </div>
            <label className="block text-xs text-slate-500">
              {t('Destinatario')}
              <input
                type="email"
                required
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="operaciones@empresa.cl"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none ring-teal-500 focus:ring-2"
              />
            </label>
            <p className="text-[11px] text-slate-400">
              {t('Se enviará un reporte con la anomalía, ubicación y datos de la captura.')}
            </p>
          </section>

          <section className="space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={slackEnabled}
                onChange={(e) => setSlackEnabled(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <Hash className="h-4 w-4 text-[#611f69]" />
              {t('Notificar también en Slack')}
            </label>

            {slackEnabled && (
              <div className="space-y-3 pl-6">
                <label className="block text-xs text-slate-500">
                  {t('Webhook entrante (Incoming Webhook)')}
                  <input
                    type="url"
                    value={slackWebhookUrl}
                    onChange={(e) => setSlackWebhookUrl(e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-teal-500 focus:ring-2"
                  />
                </label>
                <label className="block text-xs text-slate-500">
                  {t('Canal de Slack')}
                  <input
                    type="text"
                    value={slackChannel}
                    onChange={(e) => setSlackChannel(e.target.value)}
                    placeholder="#alertas-drones"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-teal-500 focus:ring-2"
                  />
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={includeImageInSlack}
                    onChange={(e) => setIncludeImageInSlack(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  {t('Incluir foto de la captura en el mensaje')}
                </label>
                {includeImageInSlack && (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <img
                      src={session.visualImage}
                      alt={detection.label}
                      className="aspect-[4/3] w-full object-contain bg-slate-900"
                    />
                    <p className="px-2 py-1.5 text-[10px] text-slate-400">
                      {t('Slack requiere URL pública de la imagen (visible al desplegar la app).')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              {t('Cancelar')}
            </button>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-500 disabled:opacity-60"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('Enviando…')}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t('Confirmar y enviar')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
