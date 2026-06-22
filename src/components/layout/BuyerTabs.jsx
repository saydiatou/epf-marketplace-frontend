import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const TABS = [
  { path: ROUTES.HOME, label: '🏠 Accueil' },
  { path: ROUTES.CART, label: '🛒 Panier' },
  { path: ROUTES.ORDERS, label: '📦 Mes commandes' },
  { path: ROUTES.FAVORITES, label: '❤️ Favoris' },
  { path: ROUTES.MESSAGES, label: '💬 Messages' },
  { path: ROUTES.PROFILE, label: '👤 Profil' },
]

export function BuyerTabs() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ background: 'white', borderBottom: '0.5px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {TABS.map(tab => {
          const isActive = location.pathname === tab.path
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)}
              style={{
                background: 'none', border: 'none', padding: '14px 16px', fontSize: 13, cursor: 'pointer',
                color: isActive ? '#1a1a2e' : '#718096', fontWeight: isActive ? 700 : 500,
                borderBottom: isActive ? '2px solid #f0b429' : '2px solid transparent', whiteSpace: 'nowrap'
              }}>
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
