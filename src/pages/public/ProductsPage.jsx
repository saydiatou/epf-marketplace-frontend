import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCatalogue } from '../../hooks/useCatalogue'
import { cartService } from '../../services/cart.service'
import { favoriteService } from '../../services/favorite.service'
import { ROUTES } from '../../constants/routes'
import { Spinner } from '../../components/ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const SORT_OPTIONS = [
  { value: 'newest',    label: '🆕 Plus récents' },
  { value: 'popular',   label: '🔥 Populaires' },
  { value: 'cheapest',  label: '💰 Prix croissant' },
  { value: 'most_rated',label: '⭐ Mieux notés' },
]

function ProductCard({ product }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const discount = product.is_on_sale && product.price && product.effective_price
    ? Math.round((1 - parseFloat(product.effective_price) / parseFloat(product.price)) * 100)
    : null

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    if (!user) { toast.error('Connectez-vous pour ajouter au panier'); return }
    if (user.role !== 'buyer') { toast.error('Seuls les acheteurs peuvent acheter'); return }
    try {
      await cartService.addItem(product.id, 1)
      toast.success('Ajouté au panier !')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur ajout panier')
    }
  }

  const handleFavorite = async (e) => {
    e.stopPropagation()
    if (!user) { toast.error('Connectez-vous pour ajouter aux favoris'); return }
    try {
      await favoriteService.addFavorite(product.id)
      toast.success('Ajouté aux favoris !')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur favoris')
    }
  }

  return (
    <div
      onClick={() => navigate(ROUTES.PRODUCT_DETAIL(product.id))}
      style={{ background: 'white', borderRadius: 14, border: '0.5px solid #e2e8f0', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
    >
      <div style={{ aspectRatio: '1', background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {product.image
          ? <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.target.style.transform = 'none'} />
          : <span style={{ fontSize: 44 }}>🛍️</span>
        }
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 8, left: 8, background: '#e53e3e', color: 'white', fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>
            -{discount}%
          </span>
        )}
        <button onClick={handleFavorite}
          style={{ position: 'absolute', top: 8, right: 8, background: 'white', border: '0.5px solid #e2e8f0', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>
          🤍
        </button>
        {product.quantity === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: 12, fontWeight: 600, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 6 }}>Rupture de stock</span>
          </div>
        )}
      </div>

      <div style={{ padding: '10px 12px 12px' }}>
        {product.category && (
          <p style={{ fontSize: 10, color: '#f0b429', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>
            {product.category.name}
          </p>
        )}
        <p style={{ fontSize: 12, color: '#2d3748', fontWeight: 600, lineHeight: 1.4, marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.title}
        </p>
        {parseFloat(product.rating) > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 6 }}>
            <span style={{ color: '#f0b429', fontSize: 11 }}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span style={{ fontSize: 10, color: '#718096' }}>({product.total_reviews || 0})</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
          <span style={{ color: '#e53e3e', fontSize: 14, fontWeight: 700 }}>
            {parseFloat(product.effective_price || product.price).toLocaleString('fr-FR')} XOF
          </span>
          {discount > 0 && (
            <span style={{ color: '#a0aec0', fontSize: 10, textDecoration: 'line-through' }}>
              {parseFloat(product.price).toLocaleString('fr-FR')}
            </span>
          )}
        </div>
        {product.seller && <p style={{ fontSize: 10, color: '#718096', marginBottom: 8 }}>par {product.seller.name}</p>}
        {product.quantity > 0 && (
          <button onClick={handleAddToCart}
            style={{ width: '100%', background: '#f0b429', color: '#1a1a2e', border: 'none', borderRadius: 8, padding: '8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            🛒 Ajouter au panier
          </button>
        )}
      </div>
    </div>
  )
}

function Pagination({ meta, setPage }) {
  if (!meta || meta.last_page <= 1) return null
  const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1)
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 32, flexWrap: 'wrap' }}>
      <button onClick={() => setPage(meta.current_page - 1)} disabled={meta.current_page === 1}
        style={{ padding: '8px 14px', borderRadius: 8, border: '0.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13, color: meta.current_page === 1 ? '#a0aec0' : '#1a1a2e' }}>
        ← Préc
      </button>
      {pages.map(p => (
        <button key={p} onClick={() => setPage(p)}
          style={{ padding: '8px 14px', borderRadius: 8, border: '0.5px solid', borderColor: p === meta.current_page ? '#f0b429' : '#e2e8f0', background: p === meta.current_page ? '#f0b429' : 'white', color: p === meta.current_page ? '#1a1a2e' : '#4a5568', cursor: 'pointer', fontSize: 13, fontWeight: p === meta.current_page ? 700 : 400 }}>
          {p}
        </button>
      ))}
      <button onClick={() => setPage(meta.current_page + 1)} disabled={meta.current_page === meta.last_page}
        style={{ padding: '8px 14px', borderRadius: 8, border: '0.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13, color: meta.current_page === meta.last_page ? '#a0aec0' : '#1a1a2e' }}>
        Suiv →
      </button>
    </div>
  )
}

export default function ProductsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    products, categories, meta, searchResults,
    loading, error, searchLoading, filters, searchQuery,
    setCategory, setSort, setPriceRange, setPage, setSearchQuery, resetFilters,
  } = useCatalogue()

  // Lire les params URL au chargement
  useEffect(() => {
    const q = searchParams.get('q')
    const cat = searchParams.get('category_id')
    const sort = searchParams.get('sort')
    if (q) setSearchQuery(q)
    if (cat) setCategory(cat)
    if (sort) setSort(sort)
  }, [])

  const displayProducts = searchResults?.products || products
  const isSearching = !!searchQuery

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#1a1a2e', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="🔍 Rechercher un produit, une catégorie..."
              style={{ flex: 1, border: 'none', borderRadius: 10, padding: '12px 16px', fontSize: 14, outline: 'none', color: '#2d3748' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                style={{ background: '#e53e3e', color: 'white', border: 'none', borderRadius: 10, padding: '12px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                ✕ Effacer
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>

        {/* Sidebar filtres */}
        <aside>
          <div style={{ background: 'white', borderRadius: 14, border: '0.5px solid #e2e8f0', padding: 18, position: 'sticky', top: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>🎛️ Filtres</h3>
              <button onClick={resetFilters}
                style={{ background: 'none', border: 'none', color: '#e53e3e', fontSize: 11, cursor: 'pointer' }}>
                Réinitialiser
              </button>
            </div>

            {/* Tri */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 8 }}>Trier par</p>
              {SORT_OPTIONS.map(opt => (
                <div key={opt.value} onClick={() => setSort(opt.value)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', background: filters.sort === opt.value ? '#fff8e6' : 'transparent', marginBottom: 2 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${filters.sort === opt.value ? '#f0b429' : '#e2e8f0'}`, background: filters.sort === opt.value ? '#f0b429' : 'white', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: filters.sort === opt.value ? '#1a1a2e' : '#4a5568', fontWeight: filters.sort === opt.value ? 600 : 400 }}>{opt.label}</span>
                </div>
              ))}
            </div>

            {/* Catégories */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 8 }}>Catégorie</p>
              <div onClick={() => setCategory('')}
                style={{ padding: '7px 10px', borderRadius: 8, cursor: 'pointer', background: !filters.category_id ? '#fff8e6' : 'transparent', fontSize: 12, color: !filters.category_id ? '#1a1a2e' : '#4a5568', fontWeight: !filters.category_id ? 600 : 400, marginBottom: 2 }}>
                Toutes les catégories
              </div>
              {categories.map(cat => (
                <div key={cat.id} onClick={() => setCategory(cat.id)}
                  style={{ padding: '7px 10px', borderRadius: 8, cursor: 'pointer', background: filters.category_id == cat.id ? '#fff8e6' : 'transparent', fontSize: 12, color: filters.category_id == cat.id ? '#1a1a2e' : '#4a5568', fontWeight: filters.category_id == cat.id ? 600 : 400, marginBottom: 2 }}>
                  {cat.name}
                </div>
              ))}
            </div>

            {/* Prix */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 8 }}>Prix (XOF)</p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="number" placeholder="Min"
                  defaultValue={filters.min_price}
                  onBlur={e => setPriceRange(e.target.value, filters.max_price)}
                  style={{ flex: 1, border: '0.5px solid #e2e8f0', borderRadius: 8, padding: '7px 10px', fontSize: 12, outline: 'none', width: 0 }}
                />
                <span style={{ color: '#718096', fontSize: 12 }}>–</span>
                <input
                  type="number" placeholder="Max"
                  defaultValue={filters.max_price}
                  onBlur={e => setPriceRange(filters.min_price, e.target.value)}
                  style={{ flex: 1, border: '0.5px solid #e2e8f0', borderRadius: 8, padding: '7px 10px', fontSize: 12, outline: 'none', width: 0 }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Contenu principal */}
        <main>
          {/* Barre résultats */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>
                {isSearching ? `Résultats pour "${searchQuery}"` : 'Catalogue produits'}
              </h2>
              {meta && !isSearching && (
                <p style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>{meta.total} produit{meta.total > 1 ? 's' : ''}</p>
              )}
            </div>
            {filters.category_id && (
              <span style={{ background: '#fff8e6', color: '#d97706', fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
                {categories.find(c => c.id == filters.category_id)?.name} ✕
              </span>
            )}
          </div>

          {/* Résultats recherche globale */}
          {isSearching && searchResults && (
            <div style={{ marginBottom: 20 }}>
              {searchResults.sellers?.length > 0 && (
                <div style={{ background: 'white', borderRadius: 12, border: '0.5px solid #e2e8f0', padding: 16, marginBottom: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>👤 Vendeurs</p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {searchResults.sellers.map(s => (
                      <div key={s.id} onClick={() => navigate(ROUTES.SELLER_PROFILE(s.id))}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#f7f8fa', borderRadius: 20, cursor: 'pointer' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f0b429', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>
                          {s.name[0]}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#2d3748' }}>{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {searchResults.categories?.length > 0 && (
                <div style={{ background: 'white', borderRadius: 12, border: '0.5px solid #e2e8f0', padding: 16, marginBottom: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>📂 Catégories</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {searchResults.categories.map(c => (
                      <button key={c.id} onClick={() => { setCategory(c.id); setSearchQuery('') }}
                        style={{ background: '#fff8e6', color: '#d97706', border: 'none', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {(loading || searchLoading) && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner /></div>
          )}

          {/* Erreur */}
          {error && !loading && (
            <div style={{ background: '#fce8e8', border: '0.5px solid #f7c1c1', borderRadius: 12, padding: 20, textAlign: 'center', color: '#c0392b', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Grille produits */}
          {!loading && !searchLoading && !error && (
            <>
              {displayProducts.length === 0 ? (
                <div style={{ background: 'white', borderRadius: 16, border: '0.5px solid #e2e8f0', padding: 60, textAlign: 'center' }}>
                  <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>Aucun produit trouvé</h3>
                  <p style={{ color: '#718096', fontSize: 13, marginBottom: 20 }}>Essayez d'autres filtres ou une autre recherche</p>
                  <button onClick={resetFilters}
                    style={{ background: '#f0b429', color: '#1a1a2e', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {displayProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
              <Pagination meta={meta} setPage={setPage} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
