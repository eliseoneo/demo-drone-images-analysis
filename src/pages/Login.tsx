import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock, LogIn, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { demoAccountsHint } from '../data/mocks/users'
import { roleLabels } from '../utils/accessControl'

export function Login() {
  const { user, isLoading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isLoading && user) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const result = await login(username, password)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-teal-600" />
          <span className="text-sm font-medium text-slate-700">Drone Analytics — Acceso</span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-semibold text-slate-800">Iniciar sesión</h1>
            <p className="mt-1 text-sm text-slate-500">
              Ingrese sus credenciales corporativas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none ring-teal-500 focus:border-teal-500 focus:ring-2"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none ring-teal-500 focus:border-teal-500 focus:ring-2"
                required
              />
            </div>

            {error && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {submitting ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <details className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <summary className="cursor-pointer text-xs font-medium text-slate-600">
              Cuentas demo disponibles
            </summary>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
              {demoAccountsHint.map((account) => (
                <li key={account.username} className="font-mono">
                  {account.username} / {account.password} — {roleLabels[account.role]}
                </li>
              ))}
            </ul>
          </details>

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link to="/presentacion" className="font-medium text-teal-700 hover:underline">
              Volver a la presentación
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
