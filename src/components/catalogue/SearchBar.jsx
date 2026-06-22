import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ searchQuery, setSearchQuery, searchResults, searchLoading }) {
  const navigate     = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {}
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setSearchQuery('');
  };

  const handleResultClick = (productId) => {
    setSearchQuery('');
    navigate(`/products/${productId}`);
  };

  const resultList = searchResults?.products || searchResults?.data || (Array.isArray(searchResults) ? searchResults : []);
  const showDropdown = searchQuery.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher un produit, une catégorie…"
          className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition placeholder:text-gray-400"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
            ✕
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-2 w-full z-50 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto">
          {searchLoading && (
            <div className="p-4 text-center text-sm text-gray-500">
              <span className="inline-block w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2" />
              Recherche en cours…
            </div>
          )}
          {!searchLoading && resultList.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-400">
              Aucun résultat pour « <strong>{searchQuery}</strong> »
            </div>
          )}
          {!searchLoading && resultList.length > 0 && (
            <>
              <div className="px-4 pt-3 pb-1 text-xs text-gray-400 font-medium uppercase tracking-wide">
                {resultList.length} résultat{resultList.length > 1 ? 's' : ''}
              </div>
              {resultList.map((product) => (
                <button key={product.id} onClick={() => handleResultClick(product.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition text-left border-t border-gray-50 first:border-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🛍️</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                    {product.price !== undefined && (
                      <p className="text-xs text-purple-600 font-semibold">
                        {Number(product.price).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
