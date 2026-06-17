import { create } from 'zustand'
import { cartService } from '../services/cart.service'

export const useCartStore = create((set, get) => ({
  items: [],
  total: '0.00',
  itemCount: 0,
  isLoading: false,

  setCart(payload) {
    set({
      items: payload.items ?? [],
      total: payload.total ?? '0.00',
      itemCount: payload.item_count ?? payload.items?.length ?? 0,
    })
  },

  reset() {
    set({ items: [], total: '0.00', itemCount: 0 })
  },

  async refresh() {
    try {
      set({ isLoading: true })
      const res = await cartService.getCart()
      const data = res.data
      set({
        items: data.items || [],
        total: data.total || '0.00',
        itemCount: data.items?.length || 0,
        isLoading: false,
      })
    } catch {
      set({ isLoading: false })
    }
  },

  async addItem(product_id, quantity = 1) {
    await cartService.addItem(product_id, quantity)
    await get().refresh()
  },

  async updateItem(cartItemId, quantity) {
    await cartService.updateItem(cartItemId, quantity)
    await get().refresh()
  },

  async removeItem(cartItemId) {
    await cartService.removeItem(cartItemId)
    await get().refresh()
  },
}))
