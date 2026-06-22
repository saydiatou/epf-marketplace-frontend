import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

// Le vrai processus de commande (formulaire livraison + coupon) est intégré
// directement dans CartPage.jsx via une modal, pour éviter une étape de navigation
// supplémentaire (l'utilisateur reste sur la même page panier -> checkout -> confirmation).
// Cette page redirige donc vers le panier où se trouve le bouton "Passer la commande".
export default function CheckoutPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 40, textAlign: 'center', maxWidth: 420 }}>
        <p style={{ fontSize: 44, marginBottom: 16 }}>🛒</p>
        <h1 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
          Finalisez votre commande
        </h1>
        <p style={{ fontSize: 13, color: '#718096', marginBottom: 24, lineHeight: 1.6 }}>
          Le processus de commande (adresse de livraison + code promo) se fait directement depuis votre panier.
        </p>
        <button onClick={() => navigate(ROUTES.CART)}
          style={{ background: '#f0b429', color: '#1a1a2e', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Aller à mon panier →
        </button>
      </div>
    </div>
  )
}
