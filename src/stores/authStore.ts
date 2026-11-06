import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware'

interface AuthState {
  token: string | null
  userId: number | null // dari claim token, bukan dari input user
  rememberMe: boolean
  setSession: (
    token: string,
    userId: number | null,
    rememberMe: boolean,
  ) => void
  logout: () => void
}

const AUTH_STORAGE_KEY = 'omi-auth'
const isBrowser = typeof window !== 'undefined'

const isTokenExpired = (token: string) => {
  try {
    const encodedPayload = token.split('.')[1]
    if (!encodedPayload) return false

    // JWT payload memakai base64url, sedangkan atob membutuhkan base64 biasa.
    const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const payload = JSON.parse(atob(padded)) as { exp?: number }
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()
  } catch {
    // Token yang tidak dapat di-decode dibiarkan; backend tetap akan menolaknya.
    return false
  }
}

// "Remember me" menentukan storage: localStorage untuk sesi persisten,
// sessionStorage untuk sesi yang berakhir saat tab ditutup.
const authStorage: StateStorage = {
  getItem: (name) =>
    isBrowser
      ? (localStorage.getItem(name) ?? sessionStorage.getItem(name))
      : null,
  setItem: (name, value) => {
    if (!isBrowser) return

    let rememberMe = false
    try {
      rememberMe = JSON.parse(value)?.state?.rememberMe === true
    } catch {
      // Abaikan payload yang tidak valid; state tetap disimpan ke sessionStorage.
    }

    const target = rememberMe ? localStorage : sessionStorage
    const other = rememberMe ? sessionStorage : localStorage

    target.setItem(name, value)
    other.removeItem(name)
  },
  removeItem: (name) => {
    if (!isBrowser) return
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      rememberMe: false,
      setSession: (token, userId, rememberMe) =>
        set({ token, userId, rememberMe }),
      logout: () => {
        set({ token: null, userId: null, rememberMe: false })
        authStorage.removeItem(AUTH_STORAGE_KEY)
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => authStorage),
      partialize: ({ token, userId, rememberMe }) => ({
        token,
        userId,
        rememberMe,
      }),
      // Buang token yang sudah kedaluwarsa saat aplikasi dibuka.
      onRehydrateStorage: () => (state) => {
        if (state?.token && isTokenExpired(state.token)) state.logout()
      },
    },
  ),
)
