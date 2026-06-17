import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartService } from '../../services/cart.service'
import { orderService } from '../../services/order.service'
import { ROUTES } from '../../constants/routes'
import { Spinner } from '../../components/ui/Spinner'
import { BuyerTabs } from '../../components/layout/BuyerTabs'
import { useCartStore } from '../../store/cart.store'
import toast from 'react-hot-toast'

export default function CartPage() {
  const navigate = useNavigate()
  const { setCart, reset } = useCartStore()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState('0.00')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [orderLoading, setOrderLoading] = useState(false)
  const [form, setForm] = useState({
    shipping_address: '', shipping_city: '', shipping_postal_code: '', shipping_phone: '', notes: ''
  })

  const loadCart = async () => {
    try {
      setLoading(true)
      const res = await cartService.getCart()
      const data = res.data
      setItems(data.items || [])
      setTotal(data.total || '0.00')
      setCart({ items: data.items || [], total: data.total, item_count: data.items?.length || 0 })
    } catch {
      toast.error('Impossible de charger le panier')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCart() }, [])

  const handleQty = async (itemId, qty) => {
    if (qty < 1) return
    setUpdatingId(itemId)
    try {
      await cartService.updateItem(itemId, qty)
      await loadCart()
    } catch { toast.error('Erreur mise à jour') }
    finally { setUpdatingId(null) }
  }

  const handleRemove = async (itemId) => {
    setUpdatingId(itemId)
    try {
      await cartService.removeItem(itemId)
      toast.success('Article retiré')
      await loadCart()
    } catch { toast.error('Erreur suppression') }
    finally { setUpdatingId(null) }
  }

  const handleClear = async () => {
    try {
      await cartService.clearCart()
      reset()
      setItems([])
      setTotal('0.00')
      toast.success('Panier vidé')
    } catch { toast.error('Erreur') }
  }

  const handleOrder = async (e) => {
    e.preventDefault()
    setOrderLoading(true)
    try {
      const payload = { ...form }
      if (coupon.trim()) payload.coupon_code = coupon.trim()
      const res = await orderService.createOrder(payload)
      reset()
      toast.success('Commande passée avec succès !')
      navigate(ROUTES.ORDER_DETAIL(res.data.order.id))
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la commande'
      toast.error(msg)
    } finally { setOrderLoading(false) }
  }

  if (loading) return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh' }}>
      <BuyerTabs />
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner /></div>
    </div>
  )

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh', padding: '24px 16px' }}>
      <BuyerTabs />
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>🛒 Mon Panier</h1>
            <p style={{ fontSize: 13, color: '#718096', marginTop: 2 }}>{items.length} article{items.length > 1 ? 's' : ''}</p>
          </div>
          {items.length > 0 && (
            <button onClick={handleClear}
              style={{ background: 'none', border: '1px solid #e53e3e', color: '#e53e3e', padding: '7px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
              🗑️ Vider le panier
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🛒</p>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>Votre panier est vide</h2>
            <p style={{ color: '#718096', fontSize: 13, marginBottom: 24 }}>Découvrez nos produits et ajoutez-en au panier</p>
            <button onClick={() => navigate(ROUTES.PRODUCTS)}
              style={{ background: '#f0b429', color: '#1a1a2e', border: 'none', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Voir les produits
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

            {/* Liste articles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map(item => (
                <div key={item.id} style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 80, height: 80, background: '#f7fafc', borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                    {item.product?.image
                      ? <img src={item.product.image} alt={item.product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🛍️</div>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 4, lineHeight: 1.4 }}>{item.product?.title}</p>
                    <p style={{ fontSize: 11, color: '#718096', marginBottom: 8 }}>par {item.product?.seller?.name || 'Vendeur'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                        <button onClick={() => handleQty(item.id, item.quantity - 1)}
                          disabled={updatingId === item.id}
                          style={{ width: 32, height: 32, border: 'none', background: '#f7f8fa', cursor: 'pointer', fontSize: 16, color: '#4a5568' }}>−</button>
                        <span style={{ width: 36, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>
                          {updatingId === item.id ? '…' : item.quantity}
                        </span>
                        <button onClick={() => handleQty(item.id, item.quantity + 1)}
                          disabled={updatingId === item.id}
                          style={{ width: 32, height: 32, border: 'none', background: '#f7f8fa', cursor: 'pointer', fontSize: 16, color: '#4a5568' }}>+</button>
                      </div>
                      <button onClick={() => handleRemove(item.id)}
                        style={{ background: 'none', border: 'none', color: '#e53e3e', fontSize: 12, cursor: 'pointer' }}>✕ Retirer</button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#e53e3e' }}>
                      {(parseFloat(item.price_at_add) * item.quantity).toLocaleString('fr-FR')} XOF
                    </p>
                    <p style={{ fontSize: 11, color: '#718096' }}>{parseFloat(item.price_at_add).toLocaleString('fr-FR')} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Résumé de commande</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#4a5568' }}>
                  <span>Sous-total ({items.length} articles)</span>
                  <span>{parseFloat(total).toLocaleString('fr-FR')} XOF</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 13, color: '#4a5568' }}>
                  <span>Livraison</span>
                  <span style={{ color: '#48bb78' }}>Gratuite</span>
                </div>
                <div style={{ borderTop: '0.5px solid #e2e8f0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Total</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: '#e53e3e' }}>{parseFloat(total).toLocaleString('fr-FR')} XOF</span>
                </div>
                <button onClick={() => setShowCheckout(true)}
                  style={{ width: '100%', background: '#f0b429', color: '#1a1a2e', border: 'none', padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  ⚡ Passer la commande
                </button>
              </div>

              {/* Coupon */}
              <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>🏷️ Code promo</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Ex: DEMO10"
                    style={{ flex: 1, border: '0.5px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 12, outline: 'none' }} />
                  <button style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>OK</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Checkout */}
        {showCheckout && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
            <div style={{ background: 'white', borderRadius: 20, padding: 28, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>📦 Informations de livraison</h2>
                <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#718096' }}>✕</button>
              </div>
              <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'shipping_address', label: 'Adresse', placeholder: '10 rue de la Paix' },
                  { key: 'shipping_city', label: 'Ville', placeholder: 'Dakar' },
                  { key: 'shipping_postal_code', label: 'Code postal', placeholder: '10000' },
                  { key: 'shipping_phone', label: 'Téléphone', placeholder: '77 000 00 00' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 5 }}>{f.label} *</label>
                    <input required value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: '100%', border: '0.5px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', fontSize: 13, outline: 'none' }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 5 }}>Notes (optionnel)</label>
                  <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Instructions spéciales..." rows={3}
                    style={{ width: '100%', border: '0.5px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', fontSize: 13, outline: 'none', resize: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 5 }}>Code promo</label>
                  <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="DEMO10"
                    style={{ width: '100%', border: '0.5px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', fontSize: 13, outline: 'none' }} />
                </div>
                <div style={{ borderTop: '0.5px solid #e2e8f0', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Total: {parseFloat(total).toLocaleString('fr-FR')} XOF</span>
                  <button type="submit" disabled={orderLoading}
                    style={{ background: '#f0b429', color: '#1a1a2e', border: 'none', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    {orderLoading ? '⏳ En cours...' : '✅ Confirmer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
