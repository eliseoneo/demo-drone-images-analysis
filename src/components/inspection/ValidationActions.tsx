import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { ConfirmFailureDialog } from './ConfirmFailureDialog'
import type { Detection, DetectionStatus, InspectionSession } from '../../types'

interface ValidationActionsProps {
  session: InspectionSession
  detections: Detection[]
  activeId: string | null
  onSelect: (id: string) => void
  onValidate: (id: string, status: DetectionStatus) => void
  onConfirmFailure: (id: string, message: string) => void
  feedback: string | null
}

export function ValidationActions({
  session,
  detections,
  activeId,
  onSelect,
  onValidate,
  onConfirmFailure,
  feedback,
}: ValidationActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const active = detections.find((d) => d.id === activeId)
  const pending = detections.filter((d) => d.status === 'pending')

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Detección IA — Nivel 1
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Seleccione una anomalía para validar
        </p>

        <ul className="mt-4 space-y-2">
          {detections.map((det) => (
            <li key={det.id}>
              <button
                type="button"
                onClick={() => onSelect(det.id)}
                className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                  det.id === activeId
                    ? 'border-teal-200 bg-teal-50 text-slate-800'
                    : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{det.label}</span>
                  <StatusBadge status={det.status} />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Confianza: {Math.round(det.confidence * 100)}%
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {active && active.status === 'pending' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-medium text-slate-800">Acción rápida</h3>
          <p className="mt-1 text-xs text-slate-500">{active.label}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-500"
            >
              <CheckCircle className="h-4 w-4" />
              Confirmar falla
            </button>
            <button
              type="button"
              onClick={() => onValidate(active.id, 'dismissed')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <XCircle className="h-4 w-4" />
              Descartar
            </button>
          </div>
        </div>
      )}

      {active && (
        <ConfirmFailureDialog
          detection={active}
          session={session}
          open={confirmOpen && active.status === 'pending'}
          onClose={() => setConfirmOpen(false)}
          onConfirmed={(message) => {
            onConfirmFailure(active.id, message)
            setConfirmOpen(false)
          }}
        />
      )}

      {feedback && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          {feedback}
        </div>
      )}

      {pending.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Todas las detecciones han sido revisadas.
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: DetectionStatus }) {
  const styles = {
    pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    confirmed: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
    dismissed: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  }
  const labels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    dismissed: 'Descartada',
  }

  return (
    <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
