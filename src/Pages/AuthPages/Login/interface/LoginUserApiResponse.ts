/** Session login yang sudah dinormalisasi dari response API. */
export interface AuthSession {
  accessToken: string
  userId: number | null
  username: string
  email: string
}
