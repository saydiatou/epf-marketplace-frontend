import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { favoriteService } from '../../services/favorite.service'
import { cartService } from '../../services/cart.service'
import { ROUTES } from '../../constants/routes'
import { Spinner } from '../../components/ui/Spinner'
import { BuyerTabs } from '../../components/layout/BuyerTabs'
import toast from 'react-hot-toast'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)
  const [addingId, setAddingId] = useState(null)

  const load = () => {
    favoriteService.getFavorites()
      .then(r => setFavorites(r.data.data || r.data || []))
      .catch(() => toast.error('Impossible de charger les favoris'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleRemove = async (productId) => {
    setRemovingId(productId)
    try {
      await favoriteService.removeFavorite(productId)
      setFavorites(prev => prev.filter(f => f.product?.id !== productId && f.id !== productId))
      toast.success('Retiré des favoris')
    } catch { toast.error('Erreur') }
    finally { setRemovingId(null) }
  }

  const handleAddToCart = async (productId) => {
    setAddingId(productId)
    try {
      await cartService.addItem(productId, 1)
      toast.success('Ajouté au panier !')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur ajout panier')
    } finally { setAddingId(null) }
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
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>❤️ Mes Favoris</h1>
        <p style={{ fontSize: 13, color: '#718096', marginBottom: 24 }}>{favorites.length} produit{favorites.length > 1 ? 's' : ''} sauvegardé{favorites.length > 1 ? 's' : ''}</p>

        {favorites.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🤍</p>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>Aucun favori</h2>
            <p style={{ color: '#718096', fontSize: 13, marginBottom: 24 }}>Cliquez sur ♡ sur un produit pour l'ajouter à vos favoris</p>
            <button onClick={() => navigate(ROUTES.PRODUCTS)}
              style={{ background: '#f0b429', color: '#1a1a2e', border: 'none', padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Découvrir les produits
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {favorites.map(fav => {
              const product = fav.product || fav
              const productId = product.id
              const discount = product.is_on_sale && product.price && product.effective_price
                ? Math.round((1 - parseFloat(product.effective_price) / parseFloat(product.price)) * 100)
                : null

              return (
                <div key={fav.id || productId} style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>

                  <div onClick={() => navigate(ROUTES.PRODUCT_DETAIL(productId))}
                    style={{ aspectRatio: '1', background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
                    {product.image
                      ? <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 44 }}>🛍️</span>
                    }
                    {discount > 0 && (
                      <span style={{ position: 'absolute', top: 8, left: 8, background: '#e53e3e', color: 'white', fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>
                        -{discount}%
                      </span>
                    )}
                    <button onClick={e => { e.stopPropagation(); handleRemove(productId) }}
                      disabled={removingId === productId}
                      style={{ position: 'absolute', top: 8, right: 8, background: '#e53e3e', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 13 }}>
                      {removingId === productId ? '…' : '♥'}
                    </button>
                  </div>

                  <div style={{ padding: '12px 14px 14px' }}>
                    <p style={{ fontSize: 12, color: '#2d3748', fontWeight: 600, lineHeight: 1.4, marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.title}
                    </p>
                    {parseFloat(product.rating) > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 6 }}>
                        <span style={{ color: '#f0b429', fontSize: 10 }}>{'★'.repeat(Math.round(product.rating))}</span>
                        <span style={{ fontSize: 10, color: '#718096' }}>({product.total_reviews || 0})</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                      <span style={{ color: '#e53e3e', fontSize: 14, fontWeight: 700 }}>
                        {parseFloat(product.effective_price || product.price).toLocaleString('fr-FR')} XOF
                      </span>
                      {discount > 0 && (
                        <span style={{ color: '#a0aec0', fontSize: 10, textDecoration: 'line-through' }}>
                          {parseFloat(product.price).toLocaleString('fr-FR')}
                        </span>
                      )}
                    </div>
                    <button onClick={() => handleAddToCart(productId)} disabled={addingId === productId}
                      style={{ width: '100%', background: '#f0b429', color: '#1a1a2e', border: 'none', borderRadius: 8, padding: '9px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {addingId === productId ? '⏳ Ajout...' : '🛒 Ajouter au panier'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
