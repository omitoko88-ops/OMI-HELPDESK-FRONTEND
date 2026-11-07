import { ApiError } from './ApiError'
import { useAuthStore } from '@/stores/authStore'

const configuredBaseUrl = import.meta.env.VITE_API_URL as string | undefined
const developmentBaseUrl = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL_DEV as string | undefined)
  : undefined

// Production harus memakai VITE_API_URL (atau origin yang sama). Fallback
// localhost hanya aktif saat development agar build produksi tidak salah arah.
const BASE_URL = (configuredBaseUrl ?? developmentBaseUrl ?? '').replace(/\/$/, '')

/** URL absolut untuk aset API (gambar/PDF). URL absolut dari backend dibiarkan apa adanya. */
export function apiPath(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

type Query = Record<string, string | number | boolean | null | undefined>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Query
  signal?: AbortSignal
  auth?: boolean
  formData?: boolean
}

interface ApiEnvelope<T> {
  meta?: {
    success: boolean
    code: number
    message: string | string[] | Record<string, string[]>
  }
  data?: T
}

function buildUrl(path: string, query?: Query) {
  const qs = new URLSearchParams()
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      qs.set(key, String(value))
    }
  })
  const suffix = qs.toString()
  return `${BASE_URL}${path}${suffix ? `?${suffix}` : ''}`
}

function errorFromResponse(
  status: number,
  payload: unknown,
  fallback: string,
): ApiError {
  const envelope =
    payload && typeof payload === 'object' && 'meta' in payload
      ? (payload as ApiEnvelope<unknown>)
      : null
  const message = envelope?.meta?.message
  if (Array.isArray(message)) {
    return new ApiError(status, fallback, { _: message })
  }
  if (message && typeof message === 'object') {
    return new ApiError(status, fallback, message as Record<string, string[]>)
  }
  if (typeof message === 'string' && message.length > 0) {
    return new ApiError(status, message)
  }

  // Some middleware (401/403 JWT) writes ApiError directly without an envelope.
  const direct = (payload as { message?: unknown } | null)?.message
  if (typeof direct === 'string' && direct.length > 0) {
    return new ApiError(status, direct)
  }
  return new ApiError(status, fallback)
}

// Satu pintu request: JWT, envelope { meta, data }, dan error validasi.
export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    query,
    signal,
    auth = true,
    formData = false,
  } = opts
  const token = useAuthStore.getState().token

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined && !formData) headers['Content-Type'] = 'application/json'
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : formData
            ? (body as FormData)
            : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Periksa koneksi Anda.')
  }

  const text = await res.text()
  let payload: unknown = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = text
    }
  }

  const envelope = payload && typeof payload === 'object' ? (payload as ApiEnvelope<T>) : null

  if (!res.ok) {
    const error = errorFromResponse(
      res.status,
      payload,
      `Permintaan gagal (${res.status}).`,
    )
    if (res.status === 401 && auth && token) useAuthStore.getState().logout()
    throw error
  }

  if (envelope && 'meta' in envelope) {
    if (!envelope.meta?.success) {
      throw errorFromResponse(res.status, payload, 'Permintaan gagal.')
    }
    return (envelope.data ?? null) as T
  }

  return payload as T
}

export async function apiUpload<T>(
  path: string,
  file: File,
  fieldName = 'file',
): Promise<T> {
  const body = new FormData()
  body.append(fieldName, file)
  return api<T>(path, { method: 'POST', body, formData: true })
}
