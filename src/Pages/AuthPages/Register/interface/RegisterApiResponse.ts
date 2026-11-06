import type { User } from '@/interfaces/User'

/** Normalized registration response, independent of the HTTP envelope. */
export interface RegisterResult {
  user: User | null
}
