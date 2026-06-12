import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spinner } from '../ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'

export function ProtectedRoute() {
  const { isAuthenticated, isHydrated } = useAuth()
  const location = useLocation()

  if (!isHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
