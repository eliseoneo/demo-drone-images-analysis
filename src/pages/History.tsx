import { PhotoTimeline } from '../components/reports/PhotoTimeline'
import { ExportReportButton } from '../components/reports/ExportReportButton'
import { timelineEntries } from '../data/mocks/timeline'

export function History() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Historial y Reportes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Evolución cronológica — Antes y Después
          </p>
        </div>
        <ExportReportButton />
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <PhotoTimeline entries={timelineEntries} />
      </div>
    </div>
  )
}
