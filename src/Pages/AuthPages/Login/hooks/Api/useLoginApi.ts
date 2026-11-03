import { useAppMutation } from '@/lib/ReactQueryHelper'
import { AuthUserResponse } from '../../interface/LoginUserApiResponse'
import { api } from '@/lib/axios'

// Tipe input login: dijadikan satu objek karena mutationFn hanya menerima 1 argumen
export interface LoginPayload {
  username: string
  password: string
}

// Fungsi API: payload langsung dikirim sebagai body request.
// Nama properti (username, password) sudah sama dengan yang diminta backend,
// jadi tidak perlu dipetakan ulang satu per satu.
const loginUser = async (payload: LoginPayload) =>
  (await api.post<AuthUserResponse>('/api/Auth/login', payload)).data

export const useLoginApi = () => {
  // Generic kedua (TVariables) otomatis terbaca dari tipe parameter loginUser
  return useAppMutation({
    mutationFn: loginUser,
    customSuccessMessage: 'Berhasil Login !!!',
    customErrorMessage: 'Gagal Login !!!',
    errorOnToast: true,
    onSuccess: (data) => {
      // Response login kemungkinan berisi token, jadi hanya log saat development
      console.log(data)
    },
  })
}
