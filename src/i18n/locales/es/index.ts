import * as common from './common'
import * as auth from './auth'
import * as landing from './landing'
import * as dashboard from './dashboard'
import * as flightPlans from './flightPlans'
import * as inspection from './inspection'
import * as history from './history'
import * as support from './support'
import * as scada from './scada'
import * as pdf from './pdf'
import type { NestedMessages } from '../../types'

export const es: NestedMessages = {
  common: common.common,
  nav: common.nav,
  roles: common.roles,
  onPremise: common.onPremise,
  auth: auth.auth,
  landing: landing.landing,
  dashboard: dashboard.dashboard,
  forecast: dashboard.forecast,
  flightPlans: flightPlans.flightPlans,
  inspection: inspection.inspection,
  history: history.history,
  support: support.support,
  scada: scada.scada,
  pdf: pdf.pdf,
}
