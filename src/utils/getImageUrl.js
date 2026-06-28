export function getImageUrl(path, fallback = '/placeholder-product.svg') {
  if (!path) return fallback
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  // On récupère l'URL du stockage définie dans le .env, ou par défaut l'adresse locale de Laravel
  const storageUrl = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage';

  // On nettoie le chemin pour éviter les doubles slashes (//)
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${storageUrl}/${cleanPath}`;
}
