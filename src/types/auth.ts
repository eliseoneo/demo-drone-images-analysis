export type UserRole = 'administrador' | 'monitoreo' | 'ejecutivo'

export interface AuthUser {
  id: string
  username: string
  displayName: string
  role: UserRole
}

export interface AuthSession {
  user: AuthUser
  loggedInAt: string
}

export type AppPermission =
  | 'dashboard'
  | 'flightPlans'
  | 'inspection'
  | 'history'
  | 'technicalSupport'
  | 'scadaIntegration'
