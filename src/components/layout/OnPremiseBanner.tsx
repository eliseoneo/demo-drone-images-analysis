import { ShieldCheck } from 'lucide-react'

export function OnPremiseBanner() {
  return (
    <div className="flex items-center justify-center gap-2 border-b border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
      <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
      <span className="font-medium">Modo On-Premise: Activo</span>
      <span className="hidden text-emerald-700/80 sm:inline">
        — Los datos permanecen seguros en su red corporativa
      </span>
    </div>
  )
}
