import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getVisibleNavItems } from '../../utils/accessControl'

export function NavSidebar() {
  const { user } = useAuth()
  const navItems = user ? getVisibleNavItems(user.role) : []

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white lg:w-56 lg:border-b-0 lg:border-r">
      <div className="px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Drone Analytics
        </p>
        <p className="mt-1 text-sm font-medium text-slate-700">
          Centro de Comando
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-col lg:px-3 lg:pb-6">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
