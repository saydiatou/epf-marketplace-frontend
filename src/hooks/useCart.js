import { useCartStore } from '../store/cart.store'

export function useCart() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const itemCount = useCartStore((s) => s.itemCount)
  const refresh = useCartStore((s) => s.refresh)

  return { items, total, itemCount, refresh }
}
