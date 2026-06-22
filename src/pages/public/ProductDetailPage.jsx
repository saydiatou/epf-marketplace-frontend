import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../../services/catalogueService'
import { cartService } from '../../services/cart.service'
import { favoriteService } from '../../services/favorite.service'
import { reviewService } from '../../services/review.service'
import { messageService } from '../../services/message.service'
import { ROUTES } from '../../constants/routes'
import { Spinner } from '../../components/ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

function StarRating({ value, size = 14 }) {
  return (
    <span style={{ color: '#f0b429', fontSize: size }}>
      {'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}
    </span>
  )
}

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} onClick={() => onChange(n)}
          style={{ fontSize: 22, cursor: 'pointer', color: n <= value ? '#f0b429' : '#e2e8f0' }}>★</span>
      ))}
    </div>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewSort, setReviewSort] = useState('newest')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const [sendingMsg, setSendingMsg] = useState(false)

  const load = () => {
    setLoading(true)
    getProductById(id)
      .then(r => setProduct(r.data))
      .catch(() => setError('Produit introuvable'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  useEffect(() => {
    if (!isAuthenticated) return
    favoriteService.isFavorite(id)
      .then(r => setIsFavorite(r.data.is_favorite))
      .catch(() => {})
  }, [id, isAuthenticated])

  const loadReviews = () => {
    setReviewsLoading(true)
    reviewService.getReviews(id, reviewSort)
      .then(r => setReviews(r.data.data || r.data || []))
      .catch(() => {})
      .finally(() => setReviewsLoading(false))
  }

  useEffect(() => { loadReviews() }, [id, reviewSort])

  const images = product?.images?.length > 0 ? product.images : (product?.image ? [product.image] : [])

  const discount = product?.is_on_sale && product?.price && product?.sale_price
    ? Math.round((1 - parseFloat(product.sale_price) / parseFloat(product.price)) * 100)
    : null

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Connectez-vous pour ajouter au panier'); return }
    if (user.role !== 'buyer') { toast.error('Seuls les acheteurs peuvent acheter'); return }
    setAdding(true)
    try {
      await cartService.addItem(product.id, quantity)
      toast.success('Ajouté au panier !')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur ajout panier')
    } finally { setAdding(false) }
  }

  const handleFavorite = async () => {
    if (!isAuthenticated) { toast.error('Connectez-vous pour gérer vos favoris'); return }
    setFavLoading(true)
    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(product.id)
        setIsFavorite(false)
        toast.success('Retiré des favoris')
      } else {
        await favoriteService.addFavorite(product.id)
        setIsFavorite(true)
        toast.success('Ajouté aux favoris !')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur favoris')
    } finally { setFavLoading(false) }
  }

  const handleContactSeller = async () => {
    if (!isAuthenticated) { toast.error('Connectez-vous pour contacter le vendeur'); return }
    setSendingMsg(true)
    try {
      await messageService.sendMessage(product.seller.id, `Bonjour, je suis intéressé par "${product.title}"`, product.id)
      toast.success('Message envoyé !')
      navigate(ROUTES.MESSAGES)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur envoi message')
    } finally { setSendingMsg(false) }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    setSubmittingReview(true)
    try {
      await reviewService.createReview(product.id, reviewRating, reviewComment)
      toast.success('Avis publié !')
      setShowReviewForm(false)
      setReviewComment('')
      setReviewRating(5)
      loadReviews()
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || "Vous devez avoir acheté ce produit pour laisser un avis")
    } finally { setSubmittingReview(false) }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner /></div>

  if (error || !product) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <p style={{ fontSize: 40, marginBottom: 12 }}>😕</p>
      <p style={{ color: '#718096', marginBottom: 20 }}>{error || 'Produit introuvable'}</p>
      <button onClick={() => navigate(ROUTES.PRODUCTS)}
        style={{ background: '#f0b429', color: '#1a1a2e', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        Retour au catalogue
      </button>
    </div>
  )

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#718096', marginBottom: 16 }}>
          <span onClick={() => navigate(ROUTES.HOME)} style={{ cursor: 'pointer' }}>Accueil</span>
          <span>/</span>
          <span onClick={() => navigate(ROUTES.PRODUCTS)} style={{ cursor: 'pointer' }}>Produits</span>
          {product.category && (<><span>/</span><span>{product.category.name}</span></>)}
        </div>

        {/* Fiche produit */}
        <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 24 }}>

          {/* Galerie */}
          <div>
            <div style={{ aspectRatio: '1', background: '#f7fafc', borderRadius: 14, overflow: 'hidden', position: 'relative', marginBottom: 10 }}>
              {images.length > 0
                ? <img src={images[activeImage]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>🛍️</div>
              }
              {discount > 0 && (
                <span style={{ position: 'absolute', top: 12, left: 12, background: '#e53e3e', color: 'white', fontSize: 12, padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>
                  -{discount}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImage(i)}
                    style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: i === activeImage ? '2px solid #f0b429' : '0.5px solid #e2e8f0' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Infos */}
          <div>
            {product.category && (
              <p style={{ fontSize: 11, color: '#f0b429', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                {product.category.name}
              </p>
            )}
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 10, lineHeight: 1.3 }}>{product.title}</h1>

            {parseFloat(product.rating) > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <StarRating value={product.rating} />
                <span style={{ fontSize: 12, color: '#718096' }}>{parseFloat(product.rating).toFixed(1)} ({product.total_reviews} avis)</span>
                <span style={{ fontSize: 12, color: '#718096' }}>· {product.views} vues</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: '#e53e3e' }}>
                {parseFloat(product.effective_price).toLocaleString('fr-FR')} XOF
              </span>
              {discount > 0 && (
                <span style={{ fontSize: 15, color: '#a0aec0', textDecoration: 'line-through' }}>
                  {parseFloat(product.price).toLocaleString('fr-FR')} XOF
                </span>
              )}
            </div>

            <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.6, marginBottom: 18 }}>{product.description}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <span style={{ fontSize: 12, color: product.quantity > 0 ? '#48bb78' : '#e53e3e', fontWeight: 600 }}>
                {product.quantity > 0 ? `✓ En stock (${product.quantity} disponibles)` : '✕ Rupture de stock'}
              </span>
            </div>

            {/* Vendeur */}
            {product.seller && (
              <div onClick={() => navigate(ROUTES.SELLER_PROFILE(product.seller.id))}
                style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f7f8fa', borderRadius: 12, padding: 12, marginBottom: 18, cursor: 'pointer' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0b429', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1a1a2e', flexShrink: 0 }}>
                  {product.seller.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{product.seller.name}</p>
                  <p style={{ fontSize: 11, color: '#718096' }}>⭐ {parseFloat(product.seller.rating).toFixed(1)} · {product.seller.city || 'Sénégal'}</p>
                </div>
                <span style={{ fontSize: 11, color: '#0073e6' }}>Voir profil →</span>
              </div>
            )}

            {/* Actions */}
            {product.quantity > 0 && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ width: 38, height: 44, border: 'none', background: '#f7f8fa', cursor: 'pointer', fontSize: 18 }}>−</button>
                  <span style={{ width: 44, textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                    style={{ width: 38, height: 44, border: 'none', background: '#f7f8fa', cursor: 'pointer', fontSize: 18 }}>+</button>
                </div>
                <button onClick={handleAddToCart} disabled={adding}
                  style={{ flex: 1, background: '#f0b429', color: '#1a1a2e', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  {adding ? '⏳ Ajout...' : '🛒 Ajouter au panier'}
                </button>
                <button onClick={handleFavorite} disabled={favLoading}
                  style={{ width: 44, height: 44, borderRadius: 10, border: '0.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 18 }}>
                  {isFavorite ? '❤️' : '🤍'}
                </button>
              </div>
            )}

            {product.seller && user?.id !== product.seller.id && (
              <button onClick={handleContactSeller} disabled={sendingMsg}
                style={{ width: '100%', background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 600, color: '#1a1a2e', cursor: 'pointer' }}>
                💬 {sendingMsg ? 'Envoi...' : 'Contacter le vendeur'}
              </button>
            )}
          </div>
        </div>

        {/* Avis */}
        <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e' }}>⭐ Avis ({product.total_reviews || 0})</h2>
            <div style={{ display: 'flex', gap: 10 }}>
              <select value={reviewSort} onChange={e => setReviewSort(e.target.value)}
                style={{ border: '0.5px solid #e2e8f0', borderRadius: 8, padding: '6px 10px', fontSize: 12, outline: 'none' }}>
                <option value="newest">Plus récents</option>
                <option value="highest_rated">Mieux notés</option>
                <option value="lowest_rated">Moins bien notés</option>
              </select>
              {isAuthenticated && (
                <button onClick={() => setShowReviewForm(!showReviewForm)}
                  style={{ background: '#f0b429', color: '#1a1a2e', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  ✏️ Laisser un avis
                </button>
              )}
            </div>
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} style={{ background: '#f7f8fa', borderRadius: 12, padding: 16, marginBottom: 18 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 8 }}>Votre note</p>
              <StarPicker value={reviewRating} onChange={setReviewRating} />
              <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                placeholder="Votre commentaire (optionnel)..." rows={3}
                style={{ width: '100%', marginTop: 10, border: '0.5px solid #e2e8f0', borderRadius: 8, padding: 10, fontSize: 13, outline: 'none', resize: 'none' }} />
              <button type="submit" disabled={submittingReview}
                style={{ marginTop: 10, background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {submittingReview ? 'Envoi...' : 'Publier mon avis'}
              </button>
            </form>
          )}

          {reviewsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spinner /></div>
          ) : reviews.length === 0 ? (
            <p style={{ color: '#718096', fontSize: 13, textAlign: 'center', padding: 24 }}>Aucun avis pour ce produit.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {reviews.map(review => (
                <div key={review.id} style={{ borderBottom: '0.5px solid #f0f0f0', paddingBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#4a5568' }}>
                      {(review.buyer?.name || 'U')[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>{review.buyer?.name}</p>
                      <StarRating value={review.rating} size={11} />
                    </div>
                    <span style={{ fontSize: 11, color: '#a0aec0', marginLeft: 'auto' }}>
                      {new Date(review.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {review.comment && <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.5 }}>{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

