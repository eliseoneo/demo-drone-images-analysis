import { Pencil, Trash2 } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { Waypoint, WaypointAction } from '../../types/flightPlans'

interface WaypointEditorProps {
  waypoints: Waypoint[]
  selectedWaypointId: string | null
  editingWaypointId: string | null
  onSelect: (id: string) => void
  onEdit: (id: string) => void
  onUpdate: (id: string, patch: Partial<Waypoint>) => void
  onDelete: (id: string) => void
  onCancelEdit: () => void
}

const actionLabels: Record<WaypointAction, string> = {
  takeoff: 'flightPlans.takeoff',
  waypoint: 'flightPlans.waypoint',
  hover: 'flightPlans.hover',
  photo: 'flightPlans.photo',
  landing: 'flightPlans.landing',
}

export function WaypointEditor({
  waypoints,
  selectedWaypointId,
  editingWaypointId,
  onSelect,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
}: WaypointEditorProps) {
  const { t, tm } = useLanguage()
  const sorted = [...waypoints].sort((a, b) => a.order - b.order)

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-semibold">#</th>
              <th className="px-3 py-2 font-semibold">{t('common.name')}</th>
              <th className="px-3 py-2 font-semibold">{t('flightPlans.latitude')}</th>
              <th className="px-3 py-2 font-semibold">{t('flightPlans.longitude')}</th>
              <th className="px-3 py-2 font-semibold">{t('flightPlans.altitude')}</th>
              <th className="px-3 py-2 font-semibold">{t('flightPlans.action')}</th>
              <th className="px-3 py-2 font-semibold"> </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((wp) => {
              const isEditing = editingWaypointId === wp.id
              const isSelected = selectedWaypointId === wp.id

              return (
                <tr
                  key={wp.id}
                  className={`transition-colors ${
                    isSelected ? 'bg-teal-50/60' : 'bg-white hover:bg-slate-50'
                  }`}
                  onClick={() => onSelect(wp.id)}
                >
                  <td className="px-3 py-2 font-medium text-slate-700">{wp.order}</td>
                  <td className="px-3 py-2">
                    {isEditing ? (
                      <input
                        className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
                        value={wp.name}
                        onChange={(e) => onUpdate(wp.id, { name: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-slate-800">{tm(wp.name)}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-600">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.0001"
                        className="w-28 rounded border border-slate-200 px-2 py-1 text-sm"
                        value={wp.lat}
                        onChange={(e) => onUpdate(wp.id, { lat: parseFloat(e.target.value) || 0 })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      wp.lat.toFixed(4)
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-600">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.0001"
                        className="w-28 rounded border border-slate-200 px-2 py-1 text-sm"
                        value={wp.lng}
                        onChange={(e) => onUpdate(wp.id, { lng: parseFloat(e.target.value) || 0 })}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      wp.lng.toFixed(4)
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-20 rounded border border-slate-200 px-2 py-1 text-sm"
                        value={wp.altitudeM}
                        onChange={(e) =>
                          onUpdate(wp.id, { altitudeM: parseInt(e.target.value, 10) || 0 })
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-slate-700">{wp.altitudeM}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {isEditing ? (
                      <select
                        className="rounded border border-slate-200 px-2 py-1 text-sm"
                        value={wp.action}
                        onChange={(e) =>
                          onUpdate(wp.id, { action: e.target.value as WaypointAction })
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        {Object.entries(actionLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {t(label)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {t(actionLabels[wp.action])}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={onCancelEdit}
                          className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                        >
                          {t('flightPlans.finishEdit')}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onEdit(wp.id)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-teal-700"
                          title={t('flightPlans.editWaypoint')}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {wp.action !== 'takeoff' && wp.action !== 'landing' && (
                        <button
                          type="button"
                          onClick={() => onDelete(wp.id)}
                          className="rounded p-1 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                          title={t('flightPlans.deleteWaypoint')}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
