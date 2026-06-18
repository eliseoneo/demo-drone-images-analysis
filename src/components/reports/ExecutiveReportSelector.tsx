import { useEffect, useMemo } from 'react'
import { Building2, ChevronDown, Telescope } from 'lucide-react'
import {
  getExecutiveReportData,
  getExecutiveReportOptions,
} from '../../data/mocks/executiveReport'
import { useLanguage } from '../../context/LanguageContext'
import type { ExecutiveReportScope } from '../../types/executiveReport'

interface ExecutiveReportSelectorProps {
  selectedId: string
  scope: ExecutiveReportScope
  onSelectedIdChange: (id: string) => void
  onScopeChange: (scope: ExecutiveReportScope) => void
}

export function ExecutiveReportSelector({
  selectedId,
  scope,
  onSelectedIdChange,
  onScopeChange,
}: ExecutiveReportSelectorProps) {
  const { t } = useLanguage()
  const options = useMemo(() => getExecutiveReportOptions(scope), [scope])

  useEffect(() => {
    if (options.some((o) => o.id === selectedId)) return
    if (options[0]) onSelectedIdChange(options[0].id)
  }, [options, selectedId, onSelectedIdChange])

  const selectedOption = options.find((o) => o.id === selectedId)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
        <ScopeTab
          active={scope === 'work'}
          onClick={() => onScopeChange('work')}
          icon={Building2}
          label={t('Obras')}
        />
        <ScopeTab
          active={scope === 'inspection'}
          onClick={() => onScopeChange('inspection')}
          icon={Telescope}
          label={t('Inspecciones')}
        />
      </div>

      <div className="relative min-w-[min(100%,20rem)] flex-1 sm:flex-none">
        <label htmlFor="executive-report-select" className="sr-only">
          {scope === 'work' ? t('Seleccionar obra') : t('Seleccionar inspección')}
        </label>
        <select
          id="executive-report-select"
          value={selectedId}
          onChange={(e) => onSelectedIdChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-800 outline-none ring-teal-500 focus:ring-2"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {t(option.label)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      {selectedOption && (
        <p className="w-full text-xs text-slate-500 sm:w-auto">
          {t(selectedOption.category)} · {selectedOption.lastUpdated}
        </p>
      )}
    </div>
  )
}

export function resolveExecutiveReportScope(reportId: string): ExecutiveReportScope {
  return getExecutiveReportData(reportId)?.scope ?? 'work'
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
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'bg-teal-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-white hover:text-slate-800'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}
