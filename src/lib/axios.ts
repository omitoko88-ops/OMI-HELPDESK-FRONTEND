import axios from 'axios'
import { handleApiResponse, toApiError } from './handleApiResponse'
import { useAuthStore } from '@/stores/authStore'

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    import.meta.env.VITE_API_URL_DEV ??
    'http://localhost:5136',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => {
    // Kasus HTTP 200 tapi meta.success = false: dilempar sebagai ApiError
    // Response tanpa envelope (mis. endpoint publik) dibiarkan apa adanya.
    if (res.data && typeof res.data === 'object' && 'meta' in res.data) {
      handleApiResponse(res.data)
    }
    return res
  },
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }

    return Promise.reject(toApiError(error))
  },
)
