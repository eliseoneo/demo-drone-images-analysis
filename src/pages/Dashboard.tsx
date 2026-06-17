import { useMemo, useState } from 'react'
import { DockSensorPanel } from '../components/dashboard/DockSensorPanel'
import { ProgressChart } from '../components/dashboard/ProgressChart'
import { ExecutionSemaphore } from '../components/dashboard/ExecutionSemaphore'
import { ActiveWorksPanel } from '../components/dashboard/ActiveWorksPanel'
import { allFleets } from '../data/mocks/dockSensors'
import { executionGanttData } from '../data/mocks/executionGantt'
import {
  activeWorks,
  getDefaultSelectedWorkId,
  progressMetricsByWorkId,
} from '../data/mocks/progress'
import { buildSyncedExecutionView } from '../utils/progressForecast'

export function Dashboard() {
  const [selectedWorkId, setSelectedWorkId] = useState(() =>
    getDefaultSelectedWorkId(activeWorks),
  )

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

      <ExecutionSemaphore
        projection={syncedExecution.projection}
        projectionDetail={syncedExecution.detail}
        projectName={syncedExecution.projectName}
        ganttData={executionGanttData}
        selectedWorkId={selectedWorkId}
      />

      <ProgressChart data={progressData} forecast={syncedExecution.forecast} />
    </div>
  )
}
