import { Outlet } from 'react-router-dom'
import { OnPremiseBanner } from './OnPremiseBanner'
import { NavSidebar } from './NavSidebar'

export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col bg-slate-50 text-slate-700">
      <OnPremiseBanner />
      <div className="flex flex-1 flex-col lg:flex-row">
        <NavSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
