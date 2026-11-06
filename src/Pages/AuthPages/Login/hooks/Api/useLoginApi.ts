import { useAppMutation } from '@/lib/ReactQueryHelper'
import { api } from '@/lib/axios'
import { ApiError } from '@/lib/ApiError'
import type { LoginResponse } from '@/interfaces/LoginResponse'
import type { User } from '@/interfaces/User'
import type { AuthSession } from '../../interface/LoginUserApiResponse'

// Tipe input login: dijadikan satu objek karena mutationFn hanya menerima 1 argumen
export interface LoginPayload {
  username: string
  password: string
}

// Backend lama mengembalikan { token, user }, sedangkan kontrak ApiResponse
// mengembalikan { meta, data: { access_token, user } }. Normalisasi di sini
// supaya komponen tidak perlu mengetahui bentuk response HTTP.
type LoginApiResponse =
  | LoginResponse
  | {
      token?: string
      user?: User
    }

const loginUser = async (payload: LoginPayload): Promise<AuthSession> => {
  const response = await api.post<LoginApiResponse>('/api/Auth/login', payload)
  const body = response.data
  const data = 'data' in body ? body.data : undefined
  const accessToken =
    data?.access_token ?? ('token' in body ? body.token : undefined)
  const user = data?.user ?? ('user' in body ? body.user : undefined)

  if (!accessToken) {
    throw new ApiError('Login response did not include an access token', 500)
  }

  return {
    accessToken,
    user: user ?? null,
  }
}

export const useLoginApi = () => {
  // Generic kedua (TVariables) otomatis terbaca dari tipe parameter loginUser
  return useAppMutation({
    mutationFn: loginUser,
    customSuccessMessage: 'Login successful',
    customErrorMessage: 'Gagal Login !!!',
  })
}
