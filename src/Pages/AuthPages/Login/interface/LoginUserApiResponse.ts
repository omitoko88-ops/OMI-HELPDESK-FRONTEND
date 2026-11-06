import type { User } from '@/interfaces/User'

/** Session login yang sudah dinormalisasi dari response API. */
export interface AuthSession {
  accessToken: string
  user: User | null
}
