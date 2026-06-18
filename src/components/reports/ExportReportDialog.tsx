import { useEffect, useMemo, useState } from 'react'
import { Building2, FileDown, Loader2, Search, Telescope, X } from 'lucide-react'
import {
  defaultExecutiveReportId,
  getExecutiveReportData,
  getExecutiveReportOptions,
} from '../../data/mocks/executiveReport'
import type { ExecutiveReportScope } from '../../types/executiveReport'
import { ExecutiveSummaryPanel } from './ExecutiveSummaryPanel'

interface ExportReportDialogProps {
  open: boolean
  onClose: () => void
  initialReportId?: string
}

export function ExportReportDialog({
  open,
  onClose,
  initialReportId = defaultExecutiveReportId,
}: ExportReportDialogProps) {
  const [scope, setScope] = useState<ExecutiveReportScope>('work')
  const [selectedId, setSelectedId] = useState(initialReportId)
  const [query, setQuery] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (!open) return
    setSelectedId(initialReportId)
    setQuery('')
    const initial = getExecutiveReportData(initialReportId)
    if (initial) setScope(initial.scope)
  }, [open, initialReportId])

  const options = useMemo(() => getExecutiveReportOptions(scope), [scope])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q),
    )
  }, [options, query])

  useEffect(() => {
    if (filtered.some((o) => o.id === selectedId)) return
    if (filtered[0]) setSelectedId(filtered[0].id)
  }, [filtered, selectedId])

  const reportData = getExecutiveReportData(selectedId)

  if (!open) return null

  const handleExport = async () => {
    if (!reportData) return
    setExporting(true)
    try {
      const { generateExecutiveReport } = await import('../../services/reportExport')
      generateExecutiveReport(reportData)
      onClose()
    } finally {
      setExporting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-report-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="export-report-title" className="text-base font-semibold text-slate-800">
              Exportar reporte ejecutivo
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Seleccione una obra o inspección para generar el PDF con los tres bloques del resumen.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={exporting}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <aside className="flex w-full shrink-0 flex-col border-b border-slate-100 lg:w-72 lg:border-b-0 lg:border-r">
            <div className="flex border-b border-slate-100 p-2">
              <ScopeTab
                active={scope === 'work'}
                onClick={() => setScope('work')}
                icon={Building2}
                label="Obras"
              />
              <ScopeTab
                active={scope === 'inspection'}
                onClick={() => setScope('inspection')}
                icon={Telescope}
                label="Inspecciones"
              />
            </div>

            <div className="p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar…"
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none ring-teal-500 focus:ring-2"
                />
              </div>
            </div>

            <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
              {filtered.length === 0 ? (
                <li className="px-2 py-4 text-center text-xs text-slate-400">
                  Sin resultados
                </li>
              ) : (
                filtered.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(option.id)}
                      className={`mb-1 w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                        selectedId === option.id
                          ? 'bg-teal-50 ring-1 ring-teal-200'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-800">{option.label}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {option.category} · {option.lastUpdated}
                      </p>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </aside>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {reportData ? (
              <ExecutiveSummaryPanel data={reportData} hideSectionLabel compact />
            ) : (
              <p className="text-sm text-slate-500">Seleccione un elemento para previsualizar.</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={exporting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting || !reportData}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-500 disabled:opacity-60"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando PDF…
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                Descargar PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function ScopeTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Building2
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
        active
          ? 'bg-teal-600 text-white'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}
