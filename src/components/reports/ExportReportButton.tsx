import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { ExportReportDialog } from './ExportReportDialog'

interface ExportReportButtonProps {
  selectedReportId?: string
}

export function ExportReportButton({ selectedReportId }: ExportReportButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-500"
      >
        <FileDown className="h-5 w-5" />
        Exportar Reporte Ejecutivo
      </button>

      <ExportReportDialog
        open={open}
        onClose={() => setOpen(false)}
        initialReportId={selectedReportId}
      />
    </>
  )
}
