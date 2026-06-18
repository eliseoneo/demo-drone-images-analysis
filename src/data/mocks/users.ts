import type { AuthUser } from '../../types/auth'

interface MockUserRecord extends AuthUser {
  password: string
}

export const mockUsers: MockUserRecord[] = [
  {
    id: 'user-admin',
    username: 'admin',
    password: 'demo',
    displayName: 'Administrador Sistema',
    role: 'administrador',
  },
  {
    id: 'user-monitoreo',
    username: 'monitoreo',
    password: 'demo',
    displayName: 'Operador Monitoreo',
    role: 'monitoreo',
  },
  {
    id: 'user-ejecutivo',
    username: 'ejecutivo',
    password: 'demo',
    displayName: 'Director Ejecutivo',
    role: 'ejecutivo',
  },
]

export const demoAccountsHint = mockUsers.map(({ username, role }) => ({
  username,
  password: 'demo',
  role,
}))
