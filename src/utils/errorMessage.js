export function getErrorMessage(error, fallback = 'Une erreur est survenue.') {
  if (!error) return fallback

  const data = error.response?.data
  if (typeof data?.message === 'string') return data.message

  if (data?.errors && typeof data.errors === 'object') {
    const firstKey = Object.keys(data.errors)[0]
    const firstError = data.errors[firstKey]?.[0]
    if (firstError) return firstError
  }

  if (typeof error.message === 'string') return error.message
  return fallback
}
