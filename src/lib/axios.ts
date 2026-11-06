import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { ApiError } from './api/ApiError'

// Compatibility client untuk kode lama. Pemakaian baru sebaiknya lewat
// src/lib/api/client.ts yang sudah memahami envelope { meta, data }.
const BASE_URL = (
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.VITE_API_URL_DEV as string | undefined) ??
  ''
).replace(/\/$/, '')

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) useAuthStore.getState().logout()
    const payload = error.response?.data
    const meta = payload?.meta
    const message = meta?.message
    const fields =
      message && typeof message === 'object' && !Array.isArray(message)
        ? (message as Record<string, string[]>)
        : undefined
    const text =
      typeof message === 'string'
        ? message
        : error.response?.statusText || error.message || 'Permintaan gagal.'
    return Promise.reject(
      new ApiError(error.response?.status ?? 0, text, fields),
    )
  },
)
