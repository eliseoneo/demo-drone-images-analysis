import { useState } from 'react'
import { FileDown } from 'lucide-react'

export function ExportReportButton() {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const { generateExecutiveReport } = await import('../../services/reportExport')
      generateExecutiveReport()
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={exporting}
      className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-500 disabled:opacity-60"
    >
      <FileDown className="h-5 w-5" />
      {exporting ? 'Generando PDF…' : 'Exportar Reporte Ejecutivo'}
    </button>
  )
}
