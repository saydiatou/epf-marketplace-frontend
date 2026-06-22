import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount, refresh } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  // Recharge le panier au montage (et quand l'auth change) pour que le badge
  // soit correct dès le F5, sans attendre que l'utilisateur visite /cart
  useEffect(() => {
    if (isAuthenticated) refresh()
  }, [isAuthenticated])

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    navigate(ROUTES.HOME)
  }

  return (
    <nav style={{ background: '#1a1a2e', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 100 }}>
      <Link to={ROUTES.HOME} style={{ color: '#f0b429', fontSize: 18, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
        🛍️ EPF Market
      </Link>

      <div style={{ display: 'flex', gap: 18, flex: 1 }}>
        <Link to={ROUTES.PRODUCTS} style={{ color: 'white', fontSize: 13, textDecoration: 'none' }}>Produits</Link>
        {user?.role === 'seller' && (
          <Link to={ROUTES.SELLER.DASHBOARD} style={{ color: 'white', fontSize: 13, textDecoration: 'none' }}>Espace vendeur</Link>
        )}
        {user?.role === 'admin' && (
          <Link to={ROUTES.ADMIN.DASHBOARD} style={{ color: 'white', fontSize: 13, textDecoration: 'none' }}>Administration</Link>
        )}
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to={ROUTES.FAVORITES} style={{ color: 'white', fontSize: 11, textDecoration: 'none', textAlign: 'center', lineHeight: 1.6 }}>
              🤍<br />Favoris
            </Link>
            <Link to={ROUTES.MESSAGES} style={{ color: 'white', fontSize: 11, textDecoration: 'none', textAlign: 'center', lineHeight: 1.6 }}>
              💬<br />Messages
            </Link>
            <Link to={ROUTES.CART} style={{ color: 'white', fontSize: 11, textDecoration: 'none', textAlign: 'center', lineHeight: 1.6, position: 'relative' }}>
              🛒<br />Panier
              {itemCount > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -10, background: '#e53e3e', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {itemCount}
                </span>
              )}
            </Link>

            <div style={{ position: 'relative' }}>
              <div onClick={() => setMenuOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'white', fontSize: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f0b429', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', fontWeight: 700, fontSize: 13 }}>
                  {(user?.name || 'U')[0].toUpperCase()}
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
              </div>

              {menuOpen && (
                <div style={{ position: 'absolute', right: 0, top: 40, background: 'white', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: 170, overflow: 'hidden', zIndex: 200 }}>
                  <Link to={ROUTES.PROFILE} onClick={() => setMenuOpen(false)}
                    style={{ display: 'block', padding: '10px 16px', fontSize: 13, color: '#1a1a2e', textDecoration: 'none' }}>
                    👤 Mon profil
                  </Link>
                  <Link to={ROUTES.ORDERS} onClick={() => setMenuOpen(false)}
                    style={{ display: 'block', padding: '10px 16px', fontSize: 13, color: '#1a1a2e', textDecoration: 'none' }}>
                    📦 Mes commandes
                  </Link>
                  <div onClick={handleLogout}
                    style={{ padding: '10px 16px', fontSize: 13, color: '#e53e3e', cursor: 'pointer', borderTop: '0.5px solid #f0f0f0' }}>
                    🚪 Déconnexion
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to={ROUTES.LOGIN} style={{ color: 'white', fontSize: 13, textDecoration: 'none' }}>Connexion</Link>
            <Link to={ROUTES.REGISTER}
              style={{ background: '#f0b429', color: '#1a1a2e', fontSize: 13, fontWeight: 600, textDecoration: 'none', padding: '8px 16px', borderRadius: 8 }}>
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
