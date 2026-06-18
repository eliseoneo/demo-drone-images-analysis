import {
  History,
  LayoutDashboard,
  LifeBuoy,
  Radio,
  Route,
  ScanSearch,
  type LucideIcon,
} from 'lucide-react'
import type { AppPermission, UserRole } from '../types/auth'

const rolePermissions: Record<UserRole, AppPermission[]> = {
  administrador: [
    'dashboard',
    'flightPlans',
    'inspection',
    'history',
    'technicalSupport',
    'scadaIntegration',
  ],
  monitoreo: ['dashboard', 'flightPlans', 'inspection', 'history', 'scadaIntegration'],
  ejecutivo: ['dashboard', 'history'],
}

const permissionRoutes: Record<AppPermission, string> = {
  dashboard: '/dashboard',
  flightPlans: '/flight-plans',
  inspection: '/inspection',
  history: '/history',
  technicalSupport: '/soporte-tecnico',
  scadaIntegration: '/integracion-scada',
}

export interface NavItemConfig {
  to: string
  label: string
  icon: LucideIcon
  end: boolean
  permission: AppPermission
}

export const allNavItems: NavItemConfig[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true, permission: 'dashboard' },
  { to: '/flight-plans', label: 'Planes de vuelo', icon: Route, end: false, permission: 'flightPlans' },
  { to: '/inspection', label: 'Inspección', icon: ScanSearch, end: false, permission: 'inspection' },
  { to: '/history', label: 'Historial', icon: History, end: false, permission: 'history' },
  {
    to: '/soporte-tecnico',
    label: 'Soporte Técnico',
    icon: LifeBuoy,
    end: false,
    permission: 'technicalSupport',
  },
  {
    to: '/integracion-scada',
    label: 'Integración SCADA',
    icon: Radio,
    end: false,
    permission: 'scadaIntegration',
  },
]

export function getPermissionsForRole(role: UserRole): AppPermission[] {
  return rolePermissions[role]
}

export function hasPermission(role: UserRole, permission: AppPermission): boolean {
  return rolePermissions[role].includes(permission)
}

export function canAccessTechnicalSupport(role: UserRole): boolean {
  return hasPermission(role, 'technicalSupport')
}

export function canAccessScadaIntegration(role: UserRole): boolean {
  return hasPermission(role, 'scadaIntegration')
}

export function canAccessRoute(role: UserRole, path: string): boolean {
  const normalized = path === '' ? '/' : path.replace(/\/$/, '') || '/'
  const permission = (Object.entries(permissionRoutes) as [AppPermission, string][]).find(
    ([, route]) => route === normalized,
  )?.[0]

  if (!permission) return true
  return hasPermission(role, permission)
}

export function getVisibleNavItems(role: UserRole): NavItemConfig[] {
  const permissions = getPermissionsForRole(role)
  return allNavItems.filter((item) => permissions.includes(item.permission))
}

export const roleLabels: Record<UserRole, string> = {
  administrador: 'Administrador',
  monitoreo: 'Monitoreo',
  ejecutivo: 'Ejecutivo',
}
