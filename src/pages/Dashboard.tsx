import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DockSensorPanel } from '../components/dashboard/DockSensorPanel'
import { ProgressChart } from '../components/dashboard/ProgressChart'
import { ExecutionSemaphore } from '../components/dashboard/ExecutionSemaphore'
import { ActiveWorksPanel } from '../components/dashboard/ActiveWorksPanel'
import { ScadaAlertsPanel } from '../components/dashboard/ScadaAlertsPanel'
import { useAuth } from '../context/AuthContext'
import { allFleets } from '../data/mocks/dockSensors'
import { executionGanttData } from '../data/mocks/executionGantt'
import {
  activeWorks,
  getDefaultSelectedWorkId,
  progressMetricsByWorkId,
} from '../data/mocks/progress'
import { canAccessScadaIntegration } from '../utils/accessControl'
import { hasScadaAlerts } from '../utils/scadaAlerts'
import { buildSyncedExecutionView } from '../utils/progressForecast'

export function Dashboard() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedWorkId, setSelectedWorkId] = useState(() =>
    getDefaultSelectedWorkId(activeWorks),
  )

  const showScadaAlerts = user && canAccessScadaIntegration(user.role) && hasScadaAlerts()

  useEffect(() => {
    const workId = searchParams.get('workId')
    const scrollTo = searchParams.get('scrollTo')

    if (workId && progressMetricsByWorkId[workId]) {
      setSelectedWorkId(workId)
    }

    if (scrollTo === 'execution') {
      requestAnimationFrame(() => {
        document
          .getElementById('proyeccion-ejecucion')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }

    if (scrollTo === 'scada') {
      requestAnimationFrame(() => {
        document
          .getElementById('alertas-scada')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }

    if (workId || scrollTo) {
      const next = new URLSearchParams(searchParams)
      next.delete('workId')
      next.delete('scrollTo')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const progressData = useMemo(() => {
    return (
      progressMetricsByWorkId[selectedWorkId] ??
      progressMetricsByWorkId[getDefaultSelectedWorkId(activeWorks)]
    )
  }, [selectedWorkId])

  const syncedExecution = useMemo(
    () => buildSyncedExecutionView(progressData),
    [progressData],
  )

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard Principal</h1>
        <p className="mt-1 text-sm text-slate-500">
          Centro de comando y resumen ejecutivo
        </p>
      </header>

      {showScadaAlerts && <ScadaAlertsPanel />}

      <ActiveWorksPanel
        works={activeWorks}
        selectedWorkId={selectedWorkId}
        onSelectWork={setSelectedWorkId}
      />

      <DockSensorPanel
        fleets={allFleets}
        selectedWorkId={selectedWorkId}
        onSelectWork={setSelectedWorkId}
      />

      <div id="proyeccion-ejecucion">
        <ExecutionSemaphore
          projection={syncedExecution.projection}
          projectionDetail={syncedExecution.detail}
          projectName={syncedExecution.projectName}
          ganttData={executionGanttData}
          selectedWorkId={selectedWorkId}
        />
      </div>

      <ProgressChart data={progressData} forecast={syncedExecution.forecast} />
    </div>
  )
}
