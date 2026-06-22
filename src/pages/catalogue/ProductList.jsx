import { useCatalogue }     from '../../hooks/useCatalogue';
import SearchBar            from '../../components/catalogue/SearchBar';
import CatalogueFilters     from '../../components/catalogue/CatalogueFilters';
import ProductCard          from '../../components/catalogue/ProductCard';
import Pagination           from '../../components/catalogue/Pagination';

export default function ProductList() {
  const {
    products, categories, meta, searchResults,
    loading, error, searchLoading, filters, searchQuery,
    setCategory, setSort, setPriceRange, setPage, setSearchQuery, resetFilters,
  } = useCatalogue();

  const isSearchMode      = searchQuery.trim().length > 0;
  const displayedProducts = isSearchMode
    ? (searchResults?.products || searchResults?.data || [])
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Catalogue</h1>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchResults={searchResults} searchLoading={searchLoading} />
        </div>

        <div className="flex gap-8 items-start">
          {!isSearchMode && (
            <CatalogueFilters categories={categories} filters={filters} setCategory={setCategory} setSort={setSort} setPriceRange={setPriceRange} resetFilters={resetFilters} />
          )}

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                {isSearchMode ? (
                  <p className="text-sm text-gray-500">
                    Résultats pour <strong className="text-gray-800">« {searchQuery} »</strong>
                    {displayedProducts.length > 0 && ` — ${displayedProducts.length} produit${displayedProducts.length > 1 ? 's' : ''}`}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {meta?.total !== undefined ? `${meta.total} produit${meta.total > 1 ? 's' : ''} trouvé${meta.total > 1 ? 's' : ''}` : 'Chargement…'}
                    {filters.category_id && categories.find(c => c.id === filters.category_id) && (
                      <span className="ml-1">dans <strong>{categories.find(c => c.id === filters.category_id)?.name}</strong></span>
                    )}
                  </p>
                )}
              </div>
              {isSearchMode && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-purple-600 hover:underline">
                  ← Retour au catalogue
                </button>
              )}
            </div>

            {error && (
              <div className="text-center py-16">
                <p className="text-red-500 mb-4">⚠️ {error}</p>
                <button onClick={resetFilters} className="text-sm text-purple-600 hover:underline">Réessayer</button>
              </div>
            )}

            {loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-5 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && (
              <>
                {displayedProducts.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-5xl mb-4">🔍</p>
                    <p className="text-gray-500 font-medium mb-2">Aucun produit trouvé</p>
                    <p className="text-sm text-gray-400 mb-6">{isSearchMode ? 'Essayez un autre terme.' : 'Modifiez vos filtres.'}</p>
                    <button onClick={resetFilters} className="text-sm text-purple-600 hover:underline">Réinitialiser les filtres</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
                {!isSearchMode && <Pagination meta={meta} onPage={setPage} />}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
