import { useState, useEffect }          from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById }               from '../../services/catalogueService';

const Star = ({ filled }) => (
  <svg className={`w-5 h-5 ${filled ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

function ReviewCard({ review }) {
  const date = review.created_at
    ? new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  return (
    <div className="border-b border-gray-100 last:border-0 py-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600 flex-shrink-0">
          {review.buyer?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">{review.buyer?.name || 'Anonyme'}</span>
              <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} filled={s <= (review.rating || 0)} />)}</div>
            </div>
            {date && <span className="text-xs text-gray-400">{date}</span>}
          </div>
          {review.comment && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch {
        setError('Impossible de charger ce produit.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
          <div className="h-4 w-32 bg-gray-100 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="h-96 bg-gray-100 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-8 bg-gray-100 rounded w-1/3 mt-6" />
              <div className="h-20 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-gray-600 font-medium mb-4">{error || 'Produit introuvable.'}</p>
          <button onClick={() => navigate('/products')} className="text-sm text-purple-600 hover:underline">← Retour au catalogue</button>
        </div>
      </div>
    );
  }

  const formattedPrice = Number(product.effective_price || product.price || 0).toLocaleString('fr-FR', {
    style: 'currency', currency: 'XOF', minimumFractionDigits: 0,
  });
  const reviews      = product.reviews || [];
  const avgRating    = Number(product.rating || 0);
  const isOutOfStock = product.quantity === 0;
  const isLowStock   = !isOutOfStock && product.quantity <= 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link to="/products" className="hover:text-purple-600 transition">Catalogue</Link>
          <span>›</span>
          {product.category?.name && (
            <><Link to={`/products?category_id=${product.category.id}`} className="hover:text-purple-600 transition">{product.category.name}</Link><span>›</span></>
          )}
          <span className="text-gray-600 truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="relative rounded-xl overflow-hidden bg-gray-50 aspect-square">
            {product.image ? (
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                <span className="text-7xl mb-3">🛍️</span>
                <span className="text-sm">Aucune image disponible</span>
              </div>
            )}
            {product.is_on_sale && (
              <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-full shadow">
                Promo
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {product.category?.name && (
              <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">{product.category.name}</span>
            )}
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.title}</h1>

            {avgRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} filled={s <= Math.round(avgRating)} />)}</div>
                <span className="text-sm font-semibold text-gray-700">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({product.total_reviews} avis)</span>
              </div>
            )}

            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl font-bold text-purple-700">{formattedPrice}</span>
              {product.is_on_sale && (
                <span className="text-lg text-gray-400 line-through">
                  {Number(product.price).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-400' : isLowStock ? 'bg-orange-400' : 'bg-green-400'}`} />
              <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-700'}`}>
                {isOutOfStock ? 'Rupture de stock' : isLowStock ? `Plus que ${product.quantity} en stock` : `${product.quantity} en stock`}
              </span>
            </div>

            {product.description && (
              <div className="mt-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.seller?.name && (
              <div className="mt-2 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Vendu par <span className="font-medium text-gray-700">{product.seller.name}</span>
                </p>
                {product.seller.city && (
                  <p className="text-xs text-gray-400 mt-1">📍 {product.seller.city}</p>
                )}
              </div>
            )}

            <div className="mt-auto pt-4">
              <button disabled={isOutOfStock} className="w-full py-3 px-6 rounded-xl text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm hover:shadow-md">
                {isOutOfStock ? 'Indisponible' : '🛒 Ajouter au panier'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Avis clients
              {reviews.length > 0 && <span className="ml-2 text-sm font-normal text-gray-400">({reviews.length} avis)</span>}
            </h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-4 py-2">
                <span className="text-2xl font-bold text-amber-600">{avgRating.toFixed(1)}</span>
                <div>
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} filled={s <= Math.round(avgRating)} />)}</div>
                  <p className="text-xs text-amber-600">{reviews.length} avis</p>
                </div>
              </div>
            )}
          </div>
          {reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-3xl mb-3">💬</p>
              <p className="text-sm">Aucun avis pour ce produit.</p>
            </div>
          ) : (
            <div>{reviews.map((review, idx) => <ReviewCard key={review.id || idx} review={review} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
