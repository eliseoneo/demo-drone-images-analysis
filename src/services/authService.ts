import { mockUsers } from '../data/mocks/users'
import type { AuthSession, AuthUser } from '../types/auth'

const STORAGE_KEY = 'drone-analytics-auth-session'

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthSession
    if (!parsed?.user?.id || !parsed?.user?.role) return null
    return parsed
  } catch {
    return null
  }
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}

export function authenticate(
  username: string,
  password: string,
): { ok: true; user: AuthUser } | { ok: false; message: string } {
  const normalizedUsername = username.trim().toLowerCase()
  const record = mockUsers.find(
    (user) => user.username.toLowerCase() === normalizedUsername && user.password === password,
  )

  if (!record) {
    return { ok: false, message: 'auth.invalidCredentials' }
  }

  const { password: _password, ...user } = record
  return { ok: true, user }
}

export function createSession(user: AuthUser): AuthSession {
  return {
    user,
    loggedInAt: new Date().toISOString(),
  }
}
