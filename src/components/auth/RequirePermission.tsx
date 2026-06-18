import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { AppPermission } from '../../types/auth'
import { hasPermission } from '../../utils/accessControl'

export function RequirePermission({
  permission,
  children,
}: {
  permission: AppPermission
  children: React.ReactNode
}) {
  const { user } = useAuth()

  if (!user || !hasPermission(user.role, permission)) {
    return <Navigate to="/" replace state={{ accessDenied: true }} />
  }

  return children
}
