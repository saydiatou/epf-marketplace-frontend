import { Navigate, Outlet } from 'react-router-dom'
import { useRole } from '../../hooks/useRole'
import { ROUTES } from '../../constants/routes'

export function RoleRoute({ roles = [] }) {
  const { role, hasRole } = useRole()

  if (!role) return null

  if (!hasRole(...roles)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }

  return <Outlet />
}
