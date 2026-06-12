export function getImageUrl(path, fallback = '/placeholder-product.svg') {
  if (!path) return fallback
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return path
}
