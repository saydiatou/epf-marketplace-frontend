import { NavLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { useRole } from '../../hooks/useRole'
import { ROLES } from '../../constants/roles'
import { Button } from '../ui/Button'

const sellerLinks = [
  { to: ROUTES.SELLER.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.SELLER.PRODUCTS, label: 'Mes produits' },
  { to: ROUTES.SELLER.ORDERS, label: 'Commandes' },
  { to: ROUTES.SELLER.STATISTICS, label: 'Statistiques' },
  { to: ROUTES.MESSAGES, label: 'Messages' },
  { to: ROUTES.PROFILE, label: 'Mon profil' },
]

const adminLinks = [
  { to: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard' },
  { to: ROUTES.ADMIN.USERS, label: 'Utilisateurs' },
  { to: ROUTES.ADMIN.PRODUCTS, label: 'Modération' },
  { to: ROUTES.ADMIN.COUPONS, label: 'Coupons' },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const { isSeller, isAdmin } = useRole()
  const navigate = useNavigate()

  const links = isAdmin ? adminLinks : isSeller ? sellerLinks : []

  async function handleLogout() {
    await logout()
    navigate(ROUTES.HOME)
  }

  return (
    <aside className="flex h-full w-64 flex-col bg-brand-900 text-white">
      <div className="border-b border-white/10 p-6">
        <p className="text-xs uppercase tracking-widest text-brand-100">Espace</p>
        <h2 className="mt-1 text-lg font-semibold">{isAdmin ? 'Administration' : 'Vendeur'}</h2>
        <p className="mt-2 truncate text-sm text-brand-100">{user?.name}</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-2.5 text-sm transition ${
                isActive ? 'bg-white text-brand-900' : 'text-brand-50 hover:bg-white/10'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to={ROUTES.SELLER.DASHBOARD}
            className="mt-4 block rounded-xl px-4 py-2.5 text-sm text-brand-100 hover:bg-white/10"
          >
            Voir espace vendeur
          </NavLink>
        )}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Button variant="secondary" className="w-full" onClick={handleLogout}>
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}

export function getDashboardHomeRoute(role) {
  if (role === ROLES.ADMIN) return ROUTES.ADMIN.DASHBOARD
  if (role === ROLES.SELLER) return ROUTES.SELLER.DASHBOARD
  return ROUTES.HOME
}
