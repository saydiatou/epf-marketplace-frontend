import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const formattedPrice = Number(product.price || 0).toLocaleString('fr-FR', {
    style: 'currency', currency: 'XOF', minimumFractionDigits: 0,
  });

  const stockStatus = () => {
    if (product.stock === 0)  return { label: 'Rupture de stock',       color: 'text-red-500 bg-red-50' };
    if (product.stock <= 5)   return { label: `Plus que ${product.stock}`, color: 'text-orange-500 bg-orange-50' };
    return                           { label: 'En stock',                color: 'text-green-600 bg-green-50' };
  };

  const stock = stockStatus();

  return (
    <article onClick={() => navigate(`/products/${product.id}`)} className="group cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
            <span className="text-5xl mb-2">🛍️</span>
            <span className="text-xs">Pas d'image</span>
          </div>
        )}
        {product.category?.name && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-purple-700 rounded-full shadow-sm">
            {product.category.name}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-purple-700 transition-colors">{product.name}</h3>
        {product.description && <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>}
        <div className="flex-1" />
        {product.average_rating !== undefined && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(product.average_rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-400">{Number(product.average_rating).toFixed(1)}{product.reviews_count !== undefined && ` (${product.reviews_count})`}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className="text-base font-bold text-purple-700">{formattedPrice}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stock.color}`}>{stock.label}</span>
        </div>
      </div>
    </article>
  );
}
