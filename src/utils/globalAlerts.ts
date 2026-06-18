import { inspectionSession } from '../data/mocks/detections'
import { activeWorks, progressMetricsByWorkId } from '../data/mocks/progress'
import type { Detection, ProgressForecastStatus } from '../types'
import { computeProgressForecast } from './progressForecast'

export interface AlertedWork {
  workId: string
  name: string
  status: Exclude<ProgressForecastStatus, 'on_track'>
  headlineKey: string
}

export function getAlertedWorks(): AlertedWork[] {
  return activeWorks.flatMap((work) => {
    const metrics = progressMetricsByWorkId[work.id]
    if (!metrics) return []

    const forecast = computeProgressForecast(metrics)
    if (forecast.status === 'on_track') return []

    return [
      {
        workId: work.id,
        name: work.name,
        status: forecast.status,
        headlineKey: forecast.headlineKey,
      },
    ]
  })
}

export function getPendingDetections(): Detection[] {
  return inspectionSession.detections.filter((d) => d.status === 'pending')
}
