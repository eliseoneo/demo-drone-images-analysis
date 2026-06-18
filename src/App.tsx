import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { RequireAuth } from './components/auth/RequireAuth'
import { RequirePermission } from './components/auth/RequirePermission'
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
const TechnicalSupport = lazy(() =>
  import('./pages/TechnicalSupport').then((m) => ({ default: m.TechnicalSupport })),
)
const ScadaIntegration = lazy(() =>
  import('./pages/ScadaIntegration').then((m) => ({ default: m.ScadaIntegration })),
)
const Presentation = lazy(() =>
  import('./pages/Presentation').then((m) => ({ default: m.Presentation })),
)
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })))

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
        <Route
          path="/presentacion"
          element={
            <Suspense fallback={<PageLoader />}>
              <Presentation />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          }
        />
        <Route element={<RequireAuth />}>
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
                <RequirePermission permission="flightPlans">
                  <Suspense fallback={<PageLoader />}>
                    <FlightPlans />
                  </Suspense>
                </RequirePermission>
              }
            />
            <Route
              path="inspection"
              element={
                <RequirePermission permission="inspection">
                  <Suspense fallback={<PageLoader />}>
                    <Inspection />
                  </Suspense>
                </RequirePermission>
              }
            />
            <Route
              path="history"
              element={
                <RequirePermission permission="history">
                  <Suspense fallback={<PageLoader />}>
                    <History />
                  </Suspense>
                </RequirePermission>
              }
            />
            <Route
              path="soporte-tecnico"
              element={
                <RequirePermission permission="technicalSupport">
                  <Suspense fallback={<PageLoader />}>
                    <TechnicalSupport />
                  </Suspense>
                </RequirePermission>
              }
            />
            <Route
              path="integracion-scada"
              element={
                <RequirePermission permission="scadaIntegration">
                  <Suspense fallback={<PageLoader />}>
                    <ScadaIntegration />
                  </Suspense>
                </RequirePermission>
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/presentacion" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
