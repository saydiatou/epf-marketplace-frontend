import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories, getProducts } from '../../services/catalogueService'
import { ROUTES } from '../../constants/routes'
import { Spinner } from '../../components/ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import api from '../../services/api' // Instance Axios configurée (baseURL + intercepteurs)

// ----- CONSTANTES -----
const BLEU = '#1E3A8A'
const BLEU_CLAIR = '#3B82F6'

// Images Pexels pour les catégories (clé = nom de catégorie en base)
const CAT_IMAGES = {
  'Électronique': 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  'Maison': 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  'Mode': 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  'Loisirs': 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  'Fournitures de bureau': 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  'Meubles': 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  'Informatique et logiciels': 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  'Industriel': 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  'Santé et sécurité': 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
}

// Images placeholder pour produits
const DEFAULT_PROD_IMGS = [
  'https://picsum.photos/id/0/300/300',
  'https://picsum.photos/id/20/300/300',
  'https://picsum.photos/id/18/300/300',
  'https://picsum.photos/id/26/300/300',
]

function getCatImg(name) { return CAT_IMAGES[name] || 'https://via.placeholder.com/100?text=Cat' }
function getProdImg(prod) { return prod.image || DEFAULT_PROD_IMGS[(prod.id || 0) % DEFAULT_PROD_IMGS.length] }
const formatPrice = p => (parseFloat(p || 0)).toLocaleString('fr-FR') + ' FCFA'

// Carte produit
function ProductCard({ product, onClick }) {
  const finalPrice = product.effective_price || product.price
  const discount = product.is_on_sale && product.price > product.effective_price
    ? Math.round((1 - product.effective_price / product.price) * 100) : null
  return (
    <div onClick={onClick} className="bg-white rounded-lg border p-3 cursor-pointer hover:shadow-md flex gap-3 h-[130px]">
      <div className="w-1/3 h-full flex items-center"><img src={getProdImg(product)} alt={product.title} className="max-w-full max-h-full object-contain" /></div>
      <div className="w-2/3 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-semibold line-clamp-2">{product.title}</h3>
          <p className="text-[10px] text-slate-400">{product.seller?.name || 'Vendeur'}</p>
          <div className="flex gap-1 mt-1 text-[11px]"><span className="text-yellow-500">★</span><span>{product.rating || 4.5}</span><span className="text-slate-400">({product.total_reviews || 0})</span></div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs font-bold" style={{ color: BLEU }}>{formatPrice(finalPrice)}</span>
          {discount && <span className="text-[10px] text-red-500 bg-red-50 px-1 rounded">-{discount}%</span>}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { itemCount } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('') // stocke maintenant l'ID, pas le nom
  const [categories, setCategories] = useState([]) // tableau d'objets {id, name, ...}
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState('popular')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  // Chargement des catégories — on garde l'objet complet (id + name) pour pouvoir filtrer par ID
  useEffect(() => {
    getCategories().then(res => {
      const data = res.data?.data || res.data || []
      setCategories(data)
    }).catch(() => {})
  }, [])

  // Chargement des produits avec pagination, tri, filtres
  useEffect(() => {
    setLoading(true)
    const params = {
      sort,
      page,
      per_page: 4,
      ...(selectedCategory && { category_id: selectedCategory }),
      ...(priceMin && { min_price: priceMin }),
      ...(priceMax && { max_price: priceMax }),
    }
    getProducts(params).then(res => {
      const payload = res.data
      const data = payload?.data || []
      setProducts(data)
      setTotalPages(payload?.pagination?.last_page || 1)
    }).catch(() => setProducts([])).finally(() => setLoading(false))
  }, [page, sort, selectedCategory, priceMin, priceMax])

  // Recherche globale (appel direct à l'API, sans service externe)
  const handleGlobalSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`${ROUTES.PRODUCTS}?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId)
    setPage(1)
    // On scrolle directement vers la section produits pour que l'effet du clic soit visible
    document.getElementById('produits-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  const resetFilters = () => {
    setSelectedCategory('')
    setPriceMin('')
    setPriceMax('')
    setSort('popular')
    setPage(1)
  }

  // displayCategories est maintenant un tableau d'objets {id, name}
  const displayCategories = categories.slice(0, 6)

  return (
    <div className="bg-white min-h-screen">
      {/* ========== NAVBAR ========== */}
      <nav className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center gap-8 bg-white">
        <div onClick={() => navigate(ROUTES.HOME)} className="cursor-pointer leading-none">
          <div className="text-xl font-black" style={{ color: BLEU }}>EPF</div>
          <div className="text-[9px] font-bold uppercase" style={{ color: BLEU }}>Marketplace</div>
        </div>

        <form onSubmit={handleGlobalSearch} className="flex-1 max-w-2xl flex bg-slate-50 border rounded-md h-9">
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher produits, catégories, vendeurs..."
            className="flex-1 px-4 text-xs outline-none bg-transparent"
          />
          <button type="submit" className="px-4 text-white rounded-r-md" style={{ backgroundColor: BLEU }}>🔍</button>
        </form>

        <div className="flex items-center gap-5 text-xs font-medium">
          <div onClick={() => navigate(ROUTES.CART)} className="flex items-center gap-1.5 cursor-pointer relative">
            <span className="text-base">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ backgroundColor: BLEU }}>
                {itemCount}
              </span>
            )}
            <span>Panier</span>
          </div>
          <button onClick={() => navigate(isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN)} className="hover:opacity-80" style={{ color: BLEU_CLAIR }}>
            {isAuthenticated ? 'Profil' : 'Connexion'}
          </button>
          {!isAuthenticated && (
            <button onClick={() => navigate(ROUTES.REGISTER)} className="text-white px-4 py-1.5 rounded font-semibold" style={{ backgroundColor: BLEU }}>
              Inscription
            </button>
          )}
        </div>
      </nav>

      {/* ========== SOUS-BARRE CATÉGORIES ========== */}
      <div className="border-y bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center gap-6 text-[11px] font-semibold overflow-x-auto whitespace-nowrap">
          <span className="flex items-center gap-1 border-r pr-4 h-full">≡ Catégories</span>
          {displayCategories.map(cat => (
            <span
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="cursor-pointer hover:opacity-80"
              style={{ color: selectedCategory === cat.id ? BLEU : BLEU_CLAIR, fontWeight: selectedCategory === cat.id ? 700 : 600 }}
            >
              {cat.name}
            </span>
          ))}
          <span onClick={() => handleCategoryClick('')} className="cursor-pointer text-slate-400">Toutes</span>
        </div>
      </div>

      {/* ========== HERO BANNER ========== */}
      <header className="max-w-7xl mx-auto px-6 mt-5">
        <div className="rounded-xl p-8 md:p-10 flex md:flex-row flex-col items-center justify-between h-[240px] bg-[#E0F2FE]">
          <div className="max-w-md space-y-3">
            <h1 className="text-2xl md:text-3xl font-extrabold">Produits de confiance.<br />Une main-d'œuvre plus forte.</h1>
            <p className="text-[11px] text-slate-500">EPF Marketplace connecte employés, organisations et vendeurs.</p>
            <div className="flex gap-3">
              <button onClick={() => navigate(ROUTES.PRODUCTS)} className="text-white text-[11px] font-bold px-4 py-2 rounded shadow" style={{ backgroundColor: BLEU }}>Acheter maintenant</button>
              <button onClick={() => navigate(ROUTES.LOGIN)} className="border text-[11px] font-bold px-4 py-2 rounded" style={{ borderColor: BLEU, color: BLEU }}>Devenir vendeur</button>
            </div>
          </div>
          <div className="relative hidden md:flex"><span className="text-[110px]">🛒</span><div className="absolute bottom-6 right-2 text-white rounded-full p-1.5 shadow-md border-2 border-white text-xs" style={{ backgroundColor: BLEU }}>✓</div></div>
        </div>
      </header>

      {/* ========== CATÉGORIES VEDETTES ========== */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-900">Catégories vedettes</h2>
          <button onClick={() => navigate(ROUTES.PRODUCTS)} className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">Voir tout →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {displayCategories.map(cat => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="bg-white border rounded-xl p-3 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition hover:scale-105"
              style={{ borderColor: selectedCategory === cat.id ? BLEU : '#f1f5f9', borderWidth: selectedCategory === cat.id ? 2 : 1 }}
            >
              <img src={getCatImg(cat.name)} alt={cat.name} className="w-full max-w-[100px] h-auto aspect-square object-cover rounded-lg mb-2" />
              <span className="text-xs font-semibold text-slate-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========== PRODUITS LES PLUS VENDUS ========== */}
      <section id="produits-section" className="max-w-7xl mx-auto px-6 mt-8 mb-12">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h2 className="text-sm font-bold text-slate-900">
            {selectedCategory
              ? `Produits — ${categories.find(c => c.id === selectedCategory)?.name || ''}`
              : 'Produits les plus vendus'}
          </h2>
          <div className="flex flex-wrap gap-2 text-xs items-center">
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }} className="border rounded px-2 py-1">
              <option value="popular">Populaire</option>
              <option value="newest">Nouveautés</option>
              <option value="cheapest">Prix croissant</option>
              <option value="most_rated">Mieux notés</option>
            </select>
            <input type="number" placeholder="Prix min" value={priceMin} onChange={e => setPriceMin(e.target.value)} className="w-20 border rounded px-1 py-1 text-xs" />
            <input type="number" placeholder="Prix max" value={priceMax} onChange={e => setPriceMax(e.target.value)} className="w-20 border rounded px-1 py-1 text-xs" />
            <button onClick={resetFilters} className="text-blue-600 underline">Réinitialiser</button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-3xl mb-3">📦</p>
            <p className="text-sm">Aucun produit trouvé pour ces filtres.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} onClick={() => navigate(ROUTES.PRODUCT_DETAIL(p.id))} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Précédent</button>
                <span className="px-3 py-1">Page {page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Suivant</button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-slate-900 text-slate-300 pt-10 pb-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div><h3 className="text-white font-bold text-lg">EPF MARKETPLACE</h3><p className="text-xs mt-2">© 2024 EPF Marketplace</p></div>
            <div><h4 className="text-white text-sm mb-3">Service client</h4><ul className="space-y-1 text-xs">{['FAQ', 'Livraison', 'Retours', 'Contact'].map(l => <li key={l}><a href="#" onClick={e => { e.preventDefault(); navigate('/' + l.toLowerCase()) }} className="hover:text-white">{l}</a></li>)}</ul></div>
            <div><h4 className="text-white text-sm mb-3">Vendeurs</h4><ul className="space-y-1 text-xs">{['Vendre sur EPF', 'Centre vendeur', 'Politiques', 'Ressources'].map(l => <li key={l}><a href="#" onClick={e => { e.preventDefault(); navigate('/' + l.toLowerCase().replace(/ /g, '-')) }} className="hover:text-white">{l}</a></li>)}</ul></div>
            <div><h4 className="text-white text-sm mb-3">Entreprise</h4><ul className="space-y-1 text-xs">{['À propos', 'Carrières', 'Confidentialité', 'CGV'].map(l => <li key={l}><a href="#" onClick={e => { e.preventDefault(); navigate('/' + l.toLowerCase().replace(/ /g, '-')) }} className="hover:text-white">{l}</a></li>)}</ul></div>
            <div><h4 className="text-white text-sm mb-3">Suivez-nous</h4><div className="flex gap-3 text-xl">{['📘', '📸', '🐦', '💼'].map((icon, i) => <a key={i} href="#" onClick={e => { e.preventDefault(); window.open(['https://facebook.com', 'https://instagram.com', 'https://twitter.com', 'https://linkedin.com'][i], '_blank') }} className="hover:text-white">{icon}</a>)}</div></div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs">© 2026 EPF Marketplace. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  )
}
