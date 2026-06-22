import { useState } from 'react';

const SORT_OPTIONS = [
  { label: 'Plus récents',   sort: 'newest'     },
  { label: 'Plus vendus',    sort: 'popular'    },
  { label: 'Prix croissant', sort: 'cheapest'   },
  { label: 'Mieux notés',    sort: 'most_rated' },
];

export default function CatalogueFilters({ categories, filters, setCategory, setSort, setPriceRange, resetFilters }) {
  const [localPriceMin, setLocalPriceMin] = useState(filters.min_price || '');
  const [localPriceMax, setLocalPriceMax] = useState(filters.max_price || '');

  const handlePriceBlur = () => setPriceRange(localPriceMin, localPriceMax);

  return (
    <aside className="w-64 flex-shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">Filtres</h2>
        <button onClick={resetFilters} className="text-xs text-purple-600 hover:underline">Réinitialiser</button>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Catégories</h3>
        <ul className="space-y-1">
          <li>
            <button onClick={() => setCategory('')} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${!filters.category_id ? 'bg-purple-600 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              Toutes les catégories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button onClick={() => setCategory(cat.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between gap-2 ${filters.category_id === cat.id ? 'bg-purple-600 text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <span className="truncate">{cat.name}</span>
                {cat.products_count !== undefined && (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 flex-shrink-0 ${filters.category_id === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.products_count}
                  </span>
                )}
              </button>
            </li>
          ))}
          {categories.length === 0 && [...Array(5)].map((_, i) => (
            <li key={i}><div className="h-9 rounded-lg bg-gray-100 animate-pulse" /></li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Fourchette de prix</h3>
        <div className="flex items-center gap-2">
          <input type="number" min={0} value={localPriceMin} onChange={(e) => setLocalPriceMin(e.target.value)} onBlur={handlePriceBlur} placeholder="Min" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-300" />
          <span className="text-gray-400 text-sm flex-shrink-0">–</span>
          <input type="number" min={0} value={localPriceMax} onChange={(e) => setLocalPriceMax(e.target.value)} onBlur={handlePriceBlur} placeholder="Max" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-300" />
        </div>
        <button onClick={handlePriceBlur} className="mt-2 w-full py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition">
          Appliquer le prix
        </button>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Trier par</h3>
        <ul className="space-y-1">
          {SORT_OPTIONS.map((option) => {
            const isActive = filters.sort === option.sort;
            return (
              <li key={option.label}>
                <button onClick={() => setSort(option.sort)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${isActive ? 'text-purple-700 font-medium bg-purple-50' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-purple-600' : 'bg-transparent'}`} />
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
