import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { OnPremiseBanner } from './OnPremiseBanner'
import { NavSidebar } from './NavSidebar'
import { TopAlertIndicators } from './TopAlertIndicators'
import { UserMenu } from './UserMenu'
import { LanguageToggle } from './LanguageToggle'
import { useLanguage } from '../../context/LanguageContext'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const accessDenied = (location.state as { accessDenied?: boolean } | null)?.accessDenied

  useEffect(() => {
    if (!accessDenied) return
    const timer = window.setTimeout(() => {
      navigate(location.pathname, { replace: true, state: {} })
    }, 5000)
    return () => window.clearTimeout(timer)
  }, [accessDenied, location.pathname, navigate])

  return (
    <div className="flex min-h-svh flex-col bg-slate-50 text-slate-700">
      <OnPremiseBanner />
      {accessDenied && (
        <div
          role="alert"
          className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800"
        >
          {t('common.accessDenied')}
        </div>
      )}
      <div className="flex items-center justify-end border-b border-slate-200 bg-white px-4 py-2">
        <div className="flex flex-1 items-center justify-end gap-2">
          <TopAlertIndicators />
          <LanguageToggle />
          <UserMenu />
        </div>
      </div>
      <div className="flex flex-1 flex-col lg:flex-row">
        <NavSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
