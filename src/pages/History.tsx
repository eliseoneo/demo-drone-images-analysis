import { useState } from 'react'
import { PhotoTimeline } from '../components/reports/PhotoTimeline'
import { ExportReportButton } from '../components/reports/ExportReportButton'
import { ExecutiveSummaryPanel } from '../components/reports/ExecutiveSummaryPanel'
import {
  ExecutiveReportSelector,
  resolveExecutiveReportScope,
} from '../components/reports/ExecutiveReportSelector'
import {
  defaultExecutiveReportId,
  getExecutiveReportData,
  getExecutiveReportOptions,
} from '../data/mocks/executiveReport'
import { useLanguage } from '../context/LanguageContext'
import type { ExecutiveReportScope } from '../types/executiveReport'
import { timelineEntries } from '../data/mocks/timeline'

export function History() {
  const { t } = useLanguage()
  const [selectedReportId, setSelectedReportId] = useState(defaultExecutiveReportId)
  const [scope, setScope] = useState<ExecutiveReportScope>(() =>
    resolveExecutiveReportScope(defaultExecutiveReportId),
  )

  const executiveData = getExecutiveReportData(selectedReportId)

  const handleScopeChange = (nextScope: ExecutiveReportScope) => {
    setScope(nextScope)
    const firstInScope = getExecutiveReportOptions(nextScope)[0]
    if (firstInScope) setSelectedReportId(firstInScope.id)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{t('history.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {t('history.timelineTitle')}
          </p>
        </div>
        <ExportReportButton selectedReportId={selectedReportId} />
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
              {t('history.executiveSummary')}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {t('history.selectHint')}
            </p>
          </div>
          <ExecutiveReportSelector
            selectedId={selectedReportId}
            scope={scope}
            onSelectedIdChange={setSelectedReportId}
            onScopeChange={handleScopeChange}
          />
        </div>

        {executiveData ? (
          <ExecutiveSummaryPanel data={executiveData} hideSectionLabel />
        ) : (
          <p className="text-sm text-slate-500">
            {t('history.noData')}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <PhotoTimeline entries={timelineEntries} />
      </div>
    </div>
  )
}
