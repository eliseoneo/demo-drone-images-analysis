import { useMemo, useState } from 'react'
import { Plus, Save, Building2 } from 'lucide-react'
import { FlightPlanMap } from '../components/flightPlans/FlightPlanMap'
import { FlightPlanSummary } from '../components/flightPlans/FlightPlanSummary'
import { WaypointEditor } from '../components/flightPlans/WaypointEditor'
import { initialFlightPlansData } from '../data/mocks/flightPlans'
import { useLanguage } from '../context/LanguageContext'
import type { FlightPlan, Waypoint, WorkWithFlightPlans } from '../types/flightPlans'
import type { FlightTime } from '../types'

function cloneData(data: WorkWithFlightPlans[]) {
  return structuredClone(data)
}

function createWaypoint(order: number, name: string): Waypoint {
  return {
    id: `wp-new-${Date.now()}`,
    order,
    name,
    lat: -33.45,
    lng: -70.66,
    altitudeM: 60,
    action: 'waypoint',
  }
}

export function FlightPlans() {
  const { t, tw, tm } = useLanguage()
  const [worksData, setWorksData] = useState<WorkWithFlightPlans[]>(() =>
    cloneData(initialFlightPlansData),
  )
  const [selectedWorkId, setSelectedWorkId] = useState(worksData[0]?.workId ?? '')
  const [selectedPlanId, setSelectedPlanId] = useState(
    worksData[0]?.plans[0]?.id ?? '',
  )
  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(null)
  const [editingWaypointId, setEditingWaypointId] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  const selectedWork = worksData.find((w) => w.workId === selectedWorkId)

  const selectedPlan = useMemo(() => {
    return selectedWork?.plans.find((p) => p.id === selectedPlanId) ?? null
  }, [selectedWork, selectedPlanId])

  const updatePlan = (planId: string, patch: Partial<FlightPlan>) => {
    setWorksData((prev) =>
      prev.map((work) =>
        work.workId === selectedWorkId
          ? {
              ...work,
              plans: work.plans.map((plan) =>
                plan.id === planId ? { ...plan, ...patch } : plan,
              ),
            }
          : work,
      ),
    )
  }

  const updateWaypoint = (waypointId: string, patch: Partial<Waypoint>) => {
    if (!selectedPlan) return
    updatePlan(selectedPlan.id, {
      waypoints: selectedPlan.waypoints.map((wp) =>
        wp.id === waypointId ? { ...wp, ...patch } : wp,
      ),
    })
  }

  const deleteWaypoint = (waypointId: string) => {
    if (!selectedPlan) return
    const filtered = selectedPlan.waypoints
      .filter((wp) => wp.id !== waypointId)
      .map((wp, index) => ({ ...wp, order: index + 1 }))
    updatePlan(selectedPlan.id, { waypoints: filtered })
    if (selectedWaypointId === waypointId) setSelectedWaypointId(null)
    if (editingWaypointId === waypointId) setEditingWaypointId(null)
  }

  const addWaypoint = () => {
    if (!selectedPlan) return
    const nextOrder = selectedPlan.waypoints.length + 1
    const newWp = createWaypoint(
      nextOrder,
      t('flightPlans.waypointN', { order: nextOrder }),
    )
    updatePlan(selectedPlan.id, {
      waypoints: [...selectedPlan.waypoints, newWp],
    })
    setSelectedWaypointId(newWp.id)
    setEditingWaypointId(newWp.id)
  }

  const handleSave = () => {
    setSavedMessage(t('flightPlans.savedSuccess'))
    setTimeout(() => setSavedMessage(null), 3000)
  }

  const handleWorkChange = (workId: string) => {
    setSelectedWorkId(workId)
    const work = worksData.find((w) => w.workId === workId)
    const firstPlan = work?.plans[0]
    setSelectedPlanId(firstPlan?.id ?? '')
    setSelectedWaypointId(null)
    setEditingWaypointId(null)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{t('flightPlans.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {t('flightPlans.subtitle')}
          </p>
        </div>
        {selectedPlan && (
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500"
          >
            <Save className="h-4 w-4" />
            {t('flightPlans.savePlan')}
          </button>
        )}
      </header>

      {savedMessage && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          {savedMessage}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('flightPlans.works')}
          </h2>
          {worksData.map((work) => (
            <button
              key={work.workId}
              type="button"
              onClick={() => handleWorkChange(work.workId)}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                selectedWorkId === work.workId
                  ? 'border-teal-300 bg-teal-50 ring-1 ring-teal-200'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-2">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-800">{tw(work.workId)}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {work.plans.length}{' '}
                    {work.plans.length !== 1
                      ? t('flightPlans.flightPlansPlural')
                      : t('flightPlans.flightPlan')}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </aside>

        <div className="space-y-6">
          {selectedWork && (
            <>
              <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-800">
                  {t('flightPlans.title')} — {tw(selectedWork.workId)}
                </h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {selectedWork.plans.map((plan) => (
                    <FlightPlanSummary
                      key={plan.id}
                      plan={plan}
                      isSelected={plan.id === selectedPlanId}
                      onSelect={() => {
                        setSelectedPlanId(plan.id)
                        setSelectedWaypointId(null)
                        setEditingWaypointId(null)
                      }}
                    />
                  ))}
                </div>
              </section>

              {selectedPlan && (
                <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <label className="text-xs font-medium text-slate-500">
                        {t('flightPlans.planName')}
                      </label>
                      <input
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800"
                        value={tm(selectedPlan.name)}
                        onChange={(e) => updatePlan(selectedPlan.id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        {t('flightPlans.scheduled')}
                      </label>
                      <input
                        className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                        value={selectedPlan.scheduledAt}
                        onChange={(e) =>
                          updatePlan(selectedPlan.id, { scheduledAt: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        {t('flightPlans.flightType')}
                      </label>
                      <select
                        className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                        value={selectedPlan.flightTime}
                        onChange={(e) =>
                          updatePlan(selectedPlan.id, {
                            flightTime: e.target.value as FlightTime,
                          })
                        }
                      >
                        <option value="diurnal">{t('flightPlans.day')}</option>
                        <option value="nocturnal">{t('flightPlans.night')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        {t('flightPlans.estimatedDuration')}
                      </label>
                      <input
                        type="number"
                        className="mt-1 w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                        value={selectedPlan.estimatedDurationMin}
                        onChange={(e) =>
                          updatePlan(selectedPlan.id, {
                            estimatedDurationMin: parseInt(e.target.value, 10) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-slate-700">
                      {t('flightPlans.routeView')}
                    </h3>
                    <FlightPlanMap
                      key={selectedPlan.id}
                      waypoints={selectedPlan.waypoints}
                      selectedWaypointId={selectedWaypointId}
                      onSelectWaypoint={(id) => {
                        setSelectedWaypointId(id)
                        setEditingWaypointId(null)
                      }}
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-700">
                        {t('flightPlans.waypoints')}
                      </h3>
                      <button
                        type="button"
                        onClick={addWaypoint}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        {t('flightPlans.addWaypoint')}
                      </button>
                    </div>
                    <WaypointEditor
                      waypoints={selectedPlan.waypoints}
                      selectedWaypointId={selectedWaypointId}
                      editingWaypointId={editingWaypointId}
                      onSelect={setSelectedWaypointId}
                      onEdit={setEditingWaypointId}
                      onUpdate={updateWaypoint}
                      onDelete={deleteWaypoint}
                      onCancelEdit={() => setEditingWaypointId(null)}
                    />
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
