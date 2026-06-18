import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Globe,
  Lock,
  Server,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { encryptionProfile, endpointTraces, unauthorizedAccessAlerts } from '../data/mocks/technicalSupport'
import { useLanguage } from '../context/LanguageContext'
import type { EndpointTrace, UnauthorizedAccessAlert } from '../types'
import { formatDateTime } from '../i18n/format'

const methodColors: Record<EndpointTrace['method'], string> = {
  GET: 'bg-sky-50 text-sky-700 ring-sky-200',
  POST: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  PUT: 'bg-amber-50 text-amber-700 ring-amber-200',
  PATCH: 'bg-violet-50 text-violet-700 ring-violet-200',
  DELETE: 'bg-rose-50 text-rose-700 ring-rose-200',
}

const severityStyles: Record<
  UnauthorizedAccessAlert['severity'],
  { banner: string; badge: string; labelKey: string }
> = {
  critical: {
    banner: 'border-rose-200 bg-rose-50',
    badge: 'bg-rose-100 text-rose-800 ring-rose-200',
    labelKey: 'common.critical',
  },
  warning: {
    banner: 'border-amber-200 bg-amber-50',
    badge: 'bg-amber-100 text-amber-800 ring-amber-200',
    labelKey: 'common.warning',
  },
}

function selectPlural(text: string, count: number): string {
  const [singular, plural] = text.split('|').map((part) => part.trim())
  return count === 1 ? singular : (plural ?? singular)
}

export function TechnicalSupport() {
  const { t, tm, language } = useLanguage()
  const criticalCount = unauthorizedAccessAlerts.filter((alert) => alert.severity === 'critical').length

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">{t('support.title')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('support.subtitle')}</p>
      </header>

      {criticalCount > 0 && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900"
        >
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div>
            <p className="font-semibold">
              {selectPlural(t('support.criticalAccessBanner', { count: criticalCount }), criticalCount)}
            </p>
            <p className="mt-0.5 text-rose-800/80">{t('support.criticalAccessDetail')}</p>
          </div>
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-600" />
          <h2 className="text-lg font-semibold text-slate-800">{t('support.unauthorizedSection')}</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {t('common.simulation')}
          </span>
        </div>
        <div className="space-y-3">
          {unauthorizedAccessAlerts.map((alert) => {
            const styles = severityStyles[alert.severity]
            return (
              <div key={alert.id} className={`rounded-lg border p-4 ${styles.banner}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {alert.severity === 'critical' ? (
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    )}
                    <span className="font-medium text-slate-800">{tm(alert.reason)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${styles.badge}`}
                    >
                      {t(styles.labelKey)}
                    </span>
                    {alert.blocked && (
                      <span className="flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        <Ban className="h-3 w-3" />
                        {t('common.blocked')}
                      </span>
                    )}
                  </div>
                </div>
                <dl className="mt-3 grid gap-x-6 gap-y-1 text-xs sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="text-slate-500">{t('common.origin')}</dt>
                    <dd className="font-mono font-medium text-slate-800">{alert.sourceIp}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{t('common.region')}</dt>
                    <dd className="text-slate-800">{tm(alert.sourceRegion)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{t('common.endpoint')}</dt>
                    <dd className="font-mono text-slate-800">
                      {alert.method} {alert.targetEndpoint}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{t('support.attemptsPerHour')}</dt>
                    <dd className="text-slate-800">
                      {alert.attempts} - {formatDateTime(alert.timestamp, language)}
                    </dd>
                  </div>
                </dl>
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-teal-600" />
          <h2 className="text-lg font-semibold text-slate-800">{t('support.encryptionSection')}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <EncryptionField label={t('support.encryption.tlsVersion')} value={encryptionProfile.tlsVersion} />
          <EncryptionField label={t('support.encryption.cipherSuite')} value={encryptionProfile.cipherSuite} />
          <EncryptionField label={t('support.encryption.keyExchange')} value={encryptionProfile.keyExchange} />
          <EncryptionField label={t('support.encryption.hashAlgorithm')} value={encryptionProfile.hashAlgorithm} />
          <EncryptionField label={t('support.encryption.dataAtRest')} value={encryptionProfile.dataAtRestAlgorithm} />
          <EncryptionField label={t('support.encryption.keyStorage')} value={tm(encryptionProfile.keyStorage)} />
          <EncryptionField label={t('support.encryption.certIssuer')} value={tm(encryptionProfile.certificateIssuer)} />
          <EncryptionField
            label={t('support.encryption.certExpiry')}
            value={formatDateTime(encryptionProfile.certificateExpiresAt, language)}
          />
        </div>
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            {t('support.complianceTitle')}
          </div>
          <ul className="mt-2 space-y-1 text-sm text-emerald-700/90">
            {encryptionProfile.complianceNotes.map((note) => (
              <li key={note} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {tm(note)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-800">{t('support.endpointTraceSection')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4">{t('support.table.time')}</th>
                <th className="pb-3 pr-4">{t('support.table.service')}</th>
                <th className="pb-3 pr-4">{t('support.table.method')}</th>
                <th className="pb-3 pr-4">{t('support.table.endpoint')}</th>
                <th className="pb-3 pr-4">{t('support.table.status')}</th>
                <th className="pb-3 pr-4">{t('support.table.duration')}</th>
                <th className="pb-3 pr-4">{t('support.table.origin')}</th>
                <th className="pb-3">{t('support.table.correlationId')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {endpointTraces.map((trace) => (
                <tr key={trace.id} className="text-slate-700">
                  <td className="py-3 pr-4 whitespace-nowrap text-xs text-slate-500">
                    {formatDateTime(trace.timestamp, language)}
                  </td>
                  <td className="py-3 pr-4 font-medium text-slate-800">{trace.service}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ring-1 ${methodColors[trace.method]}`}
                    >
                      {trace.method}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">{trace.endpoint}</td>
                  <td className="py-3 pr-4">
                    <span className={`font-medium ${trace.statusCode < 400 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {trace.statusCode}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{trace.durationMs} ms</td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1 text-xs">
                      {trace.origin === 'internal' ? (
                        <>
                          <Server className="h-3.5 w-3.5 text-teal-600" />
                          {t('common.internal')}
                        </>
                      ) : (
                        <>
                          <Globe className="h-3.5 w-3.5 text-rose-600" />
                          {t('common.external')}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-xs text-slate-500">{trace.correlationId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function EncryptionField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-800">{value}</dd>
    </div>
  )
}
