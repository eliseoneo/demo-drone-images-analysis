import type { AuthUser } from '../../types/auth'

interface MockUserRecord extends AuthUser {
  password: string
}

export const DEMO_PASSWORD = 'DroneDemo2026!Secure'

export const mockUsers: MockUserRecord[] = [
  {
    id: 'user-admin',
    username: 'admin',
    password: DEMO_PASSWORD,
    displayName: 'Administrador Sistema',
    role: 'administrador',
  },
  {
    id: 'user-monitoreo',
    username: 'monitoreo',
    password: DEMO_PASSWORD,
    displayName: 'Operador Monitoreo',
    role: 'monitoreo',
  },
  {
    id: 'user-ejecutivo',
    username: 'ejecutivo',
    password: DEMO_PASSWORD,
    displayName: 'Director Ejecutivo',
    role: 'ejecutivo',
  },
]

export const demoAccountsHint = mockUsers.map(({ username, password, role }) => ({
  username,
  password,
  role,
}))
