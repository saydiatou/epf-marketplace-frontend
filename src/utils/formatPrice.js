export function formatPrice(value, currency = 'EUR') {
  const amount = Number(value ?? 0)
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}
