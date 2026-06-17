import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { orderService } from '../../services/order.service'
import { ROUTES } from '../../constants/routes'
import { Spinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending:    { bg: '#fff8e6', color: '#d97706', label: '⏳ En attente' },
  processing: { bg: '#e6f1fb', color: '#1a6db5', label: '🔄 En cours' },
  shipped:    { bg: '#eaf3fb', color: '#0f7ab0', label: '🚚 Expédié' },
  delivered:  { bg: '#eaf3de', color: '#3b6d11', label: '✅ Livré' },
  cancelled:  { bg: '#fce8e8', color: '#c0392b', label: '❌ Annulé' },
}

const STEPS = ['pending', 'processing', 'shipped', 'delivered']

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  const load = () => {
    orderService.getOrderDetail(id)
      .then(r => setOrder(r.data.order || r.data))
      .catch(() => toast.error('Impossible de charger la commande'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const handleCancel = async () => {
    if (!confirm('Annuler cette commande ?')) return
    setCancelling(true)
    try {
      await orderService.cancelOrder(id)
      toast.success('Commande annulée')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur annulation')
    } finally { setCancelling(false) }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner /></div>

  if (!order) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <p style={{ fontSize: 40, marginBottom: 12 }}>😕</p>
      <p style={{ color: '#718096', marginBottom: 20 }}>Commande introuvable</p>
      <button onClick={() => navigate(ROUTES.ORDERS)}
        style={{ background: '#f0b429', color: '#1a1a2e', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        Retour aux commandes
      </button>
    </div>
  )

  const st = STATUS_COLORS[order.status] || STATUS_COLORS.pending
  const stepIndex = STEPS.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        <div onClick={() => navigate(ROUTES.ORDERS)} style={{ fontSize: 12, color: '#718096', cursor: 'pointer', marginBottom: 16 }}>
          ← Retour à mes commandes
        </div>

        {/* Header */}
        <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
                Commande #{order.order_number}
              </h1>
              <p style={{ fontSize: 12, color: '#718096' }}>
                Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span style={{ background: st.bg, color: st.color, fontSize: 12, padding: '6px 14px', borderRadius: 20, fontWeight: 600 }}>
              {st.label}
            </span>
          </div>

          {/* Timeline de suivi */}
          {!isCancelled && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              {STEPS.map((step, i) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i <= stepIndex ? '#f0b429' : '#e2e8f0', color: i <= stepIndex ? '#1a1a2e' : '#a0aec0',
                    fontSize: 12, fontWeight: 700, flexShrink: 0
                  }}>
                    {i <= stepIndex ? '✓' : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 3, background: i < stepIndex ? '#f0b429' : '#e2e8f0', margin: '0 4px' }} />
                  )}
                </div>
              ))}
            </div>
          )}
          {!isCancelled && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#718096' }}>
              <span>Commandé</span><span>Préparation</span><span>Expédié</span><span>Livré</span>
            </div>
          )}
          {isCancelled && (
            <p style={{ fontSize: 13, color: '#c0392b', background: '#fce8e8', padding: 12, borderRadius: 8 }}>
              Cette commande a été annulée.
            </p>
          )}
        </div>

        {/* Articles */}
        <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 14 }}>📦 Articles commandés</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(order.items || []).map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '0.5px solid #f0f0f0' }}>
                <div style={{ width: 56, height: 56, background: '#f7fafc', borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                  {item.product?.image
                    ? <img src={item.product.image} alt={item.product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🛍️</div>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{item.product?.title}</p>
                  <p style={{ fontSize: 11, color: '#718096' }}>par {item.seller?.name} · Qté: {item.quantity}</p>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#e53e3e' }}>{parseFloat(item.subtotal).toLocaleString('fr-FR')} XOF</p>
              </div>
            ))}
          </div>

          {/* Totaux */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4a5568', marginBottom: 6 }}>
              <span>Sous-total</span>
              <span>{(parseFloat(order.total_amount) + parseFloat(order.discount_amount || 0)).toLocaleString('fr-FR')} XOF</span>
            </div>
            {parseFloat(order.discount_amount) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#48bb78', marginBottom: 6 }}>
                <span>Coupon {order.coupon?.code && `(${order.coupon.code})`}</span>
                <span>-{parseFloat(order.discount_amount).toLocaleString('fr-FR')} XOF</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4a5568', marginBottom: 10 }}>
              <span>Livraison</span>
              <span>{parseFloat(order.shipping_cost || 0) > 0 ? `${parseFloat(order.shipping_cost).toLocaleString('fr-FR')} XOF` : 'Gratuite'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.5px solid #e2e8f0', paddingTop: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Total</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#e53e3e' }}>{parseFloat(order.total_amount).toLocaleString('fr-FR')} XOF</span>
            </div>
          </div>
        </div>

        {/* Livraison */}
        <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 14 }}>🚚 Informations de livraison</h2>
          <div style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.7 }}>
            <p>{order.shipping_address}</p>
            <p>{order.shipping_city}, {order.shipping_postal_code}</p>
            <p>📞 {order.shipping_phone}</p>
            {order.notes && <p style={{ marginTop: 8, fontStyle: 'italic', color: '#718096' }}>Note: {order.notes}</p>}
          </div>
          {order.shipped_at && (
            <p style={{ fontSize: 12, color: '#0f7ab0', marginTop: 10 }}>
              Expédié le {new Date(order.shipped_at).toLocaleDateString('fr-FR')}
            </p>
          )}
          {order.delivered_at && (
            <p style={{ fontSize: 12, color: '#3b6d11', marginTop: 4 }}>
              Livré le {new Date(order.delivered_at).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>

        {order.status === 'pending' && (
          <button onClick={handleCancel} disabled={cancelling}
            style={{ width: '100%', background: 'white', border: '1px solid #e53e3e', color: '#e53e3e', padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {cancelling ? '⏳ Annulation...' : '✕ Annuler la commande'}
          </button>
        )}
      </div>
    </div>
  )
}
