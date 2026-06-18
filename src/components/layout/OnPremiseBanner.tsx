import { ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { canAccessTechnicalSupport } from '../../utils/accessControl'

export function OnPremiseBanner() {
  const { user } = useAuth()
  const showSecurityLink = user && canAccessTechnicalSupport(user.role)

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
      <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
      <span className="font-medium">Modo On-Premise: Activo</span>
      <span className="hidden text-emerald-700/80 sm:inline">
        — Los datos permanecen seguros en su red corporativa
      </span>
      {showSecurityLink && (
        <Link
          to="/soporte-tecnico"
          className="ml-1 font-medium text-emerald-700 underline-offset-2 hover:underline"
        >
          Ver detalles de seguridad
        </Link>
      )}
    </div>
  )
}
