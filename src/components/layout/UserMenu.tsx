import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { roleLabels } from '../../utils/accessControl'
import { useLanguage } from '../../context/LanguageContext'

const roleBadgeClass: Record<string, string> = {
  administrador: 'bg-violet-50 text-violet-700 ring-violet-200',
  monitoreo: 'bg-sky-50 text-sky-700 ring-sky-200',
  ejecutivo: 'bg-amber-50 text-amber-700 ring-amber-200',
}

export function UserMenu() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/presentacion')
  }

  return (
    <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
      <div className="hidden text-right sm:block">
        <p className="text-xs font-medium text-slate-800">{user.displayName}</p>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${roleBadgeClass[user.role]}`}
        >
          {t(roleLabels[user.role])}
        </span>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
        title={t('Cerrar sesión')}
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden font-medium md:inline">{t('Salir')}</span>
      </button>
    </div>
  )
}
