/**
 * api.ts — central API base URL.
 * In development:  /local-api  (proxied by Vite to localhost:8000/api)
 * In production:   VITE_API_BASE_URL  (e.g. https://api.yourdomain.com/api)
 */
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || '/local-api'
