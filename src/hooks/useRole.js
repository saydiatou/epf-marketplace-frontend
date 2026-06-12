import { useAuth } from './useAuth'
import { ROLES } from '../constants/roles'

export function useRole() {
  const { user } = useAuth()
  const role = user?.role

  return {
    role,
    isBuyer: role === ROLES.BUYER,
    isSeller: role === ROLES.SELLER,
    isAdmin: role === ROLES.ADMIN,
    hasRole: (...roles) => roles.includes(role),
  }
}
