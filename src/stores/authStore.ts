import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userId: number | null // dari claim token, bukan dari input user
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null, userId: null }),
    }),
    {
      name: 'omi-auth',
      // Buang token yang sudah kedaluwarsa saat aplikasi dibuka
      onRehydrateStorage: () => (state) => {
        // if (state?.token && isTokenExpired(state.token)) state.logout()
      },
    },
  ),
)
