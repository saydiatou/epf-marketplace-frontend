import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderService } from '../../services/order.service'
import { ROUTES } from '../../constants/routes'
import { Spinner } from '../../components/ui/Spinner'
import { BuyerTabs } from '../../components/layout/BuyerTabs'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending:    { bg: '#fff8e6', color: '#d97706', label: '⏳ En attente' },
  processing: { bg: '#e6f1fb', color: '#1a6db5', label: '🔄 En cours' },
  shipped:    { bg: '#eaf3fb', color: '#0f7ab0', label: '🚚 Expédié' },
  delivered:  { bg: '#eaf3de', color: '#3b6d11', label: '✅ Livré' },
  cancelled:  { bg: '#fce8e8', color: '#c0392b', label: '❌ Annulé' },
}

export default function MyOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    orderService.getMyOrders()
      .then(r => setOrders(r.data.data || r.data || []))
      .catch(() => toast.error('Impossible de charger les commandes'))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (orderId) => {
    if (!confirm('Annuler cette commande ?')) return
    setCancellingId(orderId)
    try {
      await orderService.cancelOrder(orderId)
      toast.success('Commande annulée')
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur annulation')
    } finally { setCancellingId(null) }
  }

  if (loading) return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh' }}>
      <BuyerTabs />
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner /></div>
    </div>
  )

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh' }}>
      <BuyerTabs />
      <div style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>📦 Mes commandes</h1>
          <p style={{ fontSize: 13, color: '#718096', marginBottom: 24 }}>{orders.length} commande{orders.length > 1 ? 's' : ''}</p>

          {orders.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 60, textAlign: 'center' }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>📦</p>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>Aucune commande</h2>
              <p style={{ color: '#718096', fontSize: 13, marginBottom: 24 }}>Vous n'avez pas encore passé de commande</p>
              <button onClick={() => navigate(ROUTES.PRODUCTS)}
                style={{ background: '#f0b429', color: '#1a1a2e', border: 'none', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Voir les produits
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {orders.map(order => {
                const st = STATUS_COLORS[order.status] || STATUS_COLORS.pending
                return (
                  <div key={order.id} style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 3 }}>
                          Commande #{order.order_number}
                        </p>
                        <p style={{ fontSize: 11, color: '#718096' }}>
                          {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <span style={{ background: st.bg, color: st.color, fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
                        {st.label}
                      </span>
                    </div>

                    <div style={{ borderTop: '0.5px solid #f0f0f0', borderBottom: '0.5px solid #f0f0f0', padding: '12px 0', marginBottom: 12 }}>
                      {(order.items || []).slice(0, 3).map(item => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <div style={{ width: 44, height: 44, background: '#f7fafc', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                            {item.product?.image
                              ? <img src={item.product.image} alt={item.product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛍️</div>
                            }
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 12, color: '#2d3748', fontWeight: 500 }}>{item.product?.title}</p>
                            <p style={{ fontSize: 11, color: '#718096' }}>Qté: {item.quantity} × {parseFloat(item.unit_price).toLocaleString('fr-FR')} XOF</p>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <p style={{ fontSize: 11, color: '#718096' }}>+{order.items.length - 3} autre(s) article(s)</p>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#e53e3e' }}>
                        Total: {parseFloat(order.total_amount).toLocaleString('fr-FR')} XOF
                        {parseFloat(order.discount_amount) > 0 && (
                          <span style={{ fontSize: 11, color: '#48bb78', marginLeft: 8 }}>
                            (-{parseFloat(order.discount_amount).toLocaleString('fr-FR')} XOF)
                          </span>
                        )}
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {order.status === 'pending' && (
                          <button onClick={() => handleCancel(order.id)} disabled={cancellingId === order.id}
                            style={{ background: 'none', border: '1px solid #e53e3e', color: '#e53e3e', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
                            {cancellingId === order.id ? '...' : 'Annuler'}
                          </button>
                        )}
                        <button onClick={() => navigate(ROUTES.ORDER_DETAIL(order.id))}
                          style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
                          Voir détail →
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
