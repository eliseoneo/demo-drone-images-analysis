import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'

const Dashboard = lazy(() =>
  import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })),
)
const Inspection = lazy(() =>
  import('./pages/Inspection').then((m) => ({ default: m.Inspection })),
)
const History = lazy(() =>
  import('./pages/History').then((m) => ({ default: m.History })),
)
const FlightPlans = lazy(() =>
  import('./pages/FlightPlans').then((m) => ({ default: m.FlightPlans })),
)

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20 text-sm text-slate-500">
      Cargando…
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="flight-plans"
            element={
              <Suspense fallback={<PageLoader />}>
                <FlightPlans />
              </Suspense>
            }
          />
          <Route
            path="inspection"
            element={
              <Suspense fallback={<PageLoader />}>
                <Inspection />
              </Suspense>
            }
          />
          <Route
            path="history"
            element={
              <Suspense fallback={<PageLoader />}>
                <History />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
