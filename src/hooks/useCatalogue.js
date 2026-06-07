import { useState, useEffect, useCallback, useRef } from 'react';
import { getProducts, getCategories, searchCatalogue } from '../services/catalogueService';

export function useCatalogue() {
  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [meta, setMeta]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [filters, setFilters]         = useState({
    category_id : '',
    min_price   : '',
    max_price   : '',
    sort        : 'newest',
    page        : 1,
    per_page    : 12,
  });
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimer = useRef(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(Array.isArray(res.data) ? res.data : res.data?.data || []);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchQuery) return;
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProducts(filters);
        const payload = res.data;
        setProducts(payload?.data || []);
        setMeta(payload?.pagination || null);
      } catch {
        setError('Impossible de charger les produits.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [filters, searchQuery]);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await searchCatalogue(searchQuery);
        setSearchResults(res.data);
      } catch {
        setSearchResults(null);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(searchTimer.current);
  }, [searchQuery]);

  const setCategory = useCallback((categoryId) => {
    setFilters(prev => ({ ...prev, category_id: categoryId, page: 1 }));
    setSearchQuery('');
  }, []);

  const setSort = useCallback((sort) => {
    setFilters(prev => ({ ...prev, sort, page: 1 }));
  }, []);

  const setPriceRange = useCallback((min_price, max_price) => {
    setFilters(prev => ({ ...prev, min_price, max_price, page: 1 }));
  }, []);

  const setPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      category_id : '',
      min_price   : '',
      max_price   : '',
      sort        : 'newest',
      page        : 1,
      per_page    : 12,
    });
    setSearchQuery('');
  }, []);

  return {
    products, categories, meta, searchResults,
    loading, error, searchLoading, filters, searchQuery,
    setCategory, setSort, setPriceRange, setPage, setSearchQuery, resetFilters,
  };
}