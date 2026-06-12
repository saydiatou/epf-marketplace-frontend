export function formatDate(value, options = {}) {
  if (!value) return '—'
  const date = new Date(value)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date)
}

export function formatDateTime(value) {
  return formatDate(value, { hour: '2-digit', minute: '2-digit' })
}
