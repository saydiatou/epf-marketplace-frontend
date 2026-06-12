import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  total: '0.00',
  itemCount: 0,
  isLoading: false,

  setCart(payload) {
    set({
      items: payload.items ?? [],
      total: payload.total ?? '0.00',
      itemCount: payload.item_count ?? 0,
    })
  },

  reset() {
    set({ items: [], total: '0.00', itemCount: 0 })
  },

  // Méthodes fetch/add/update — implémentées par le binôme (buyer)
  async refresh() {
    // placeholder pour éviter les erreurs d'import côté Navbar
    return get()
  },
}))
