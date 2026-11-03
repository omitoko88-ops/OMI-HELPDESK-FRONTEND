import { ApiError } from './ApiError'
import { useAuthStore } from '@/stores/authStore'

// Isi VITE_API_URL di .env, contoh: VITE_API_URL=https://localhost:7001
const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

type Query = Record<string, string | number | boolean | null | undefined>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Query
  signal?: AbortSignal
  // false untuk endpoint publik / login (tanpa header Authorization)
  auth?: boolean
}

function buildUrl(path: string, query?: Query) {
  const qs = new URLSearchParams()
  Object.entries(query ?? {}).forEach(([k, v]) => {
    // Lewati nilai kosong agar tidak mengirim "?search=undefined"
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v))
  })
  const s = qs.toString()
  return `${BASE_URL}${path}${s ? `?${s}` : ''}`
}

// Satu pintu untuk semua request: pasang JWT, parse ApiError, tangani 401.
export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, signal, auth = true } = opts
  const token = useAuthStore.getState().token

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (e) {
    // Request dibatalkan react-query (ganti halaman) -> biarkan lewat apa adanya
    if (e instanceof DOMException && e.name === 'AbortError') throw e
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Periksa koneksi Anda.')
  }

  if (!res.ok) {
    // Backend selalu mengirim JSON ApiError, tapi jaga-jaga bila body kosong
    const data = await res.json().catch(() => null)
    // Token salah/kedaluwarsa pada request ber-auth -> paksa login ulang
    if (res.status === 401 && auth && token) useAuthStore.getState().logout()
    throw new ApiError(
      res.status,
      data?.message ?? `Permintaan gagal (${res.status}).`,
      data?.errors,
    )
  }

  // 204 / body kosong
  if (res.status === 204) return undefined as T
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}
