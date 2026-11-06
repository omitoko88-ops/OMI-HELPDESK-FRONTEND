import { useAppMutation } from '@/lib/ReactQueryHelper'
import { authApi } from '@/lib/api/endpoints'
import { ApiError } from '@/lib/api/ApiError'
import { getJwtUser } from '@/lib/jwt'
import type { AuthSession } from '../../interface/LoginUserApiResponse'

export interface LoginPayload {
  username: string
  password: string
}

const loginUser = async (payload: LoginPayload): Promise<AuthSession> => {
  const data = await authApi.login(payload)
  if (!data?.token) {
    throw new ApiError(500, 'Respons login tidak menyertakan access token.')
  }

  const user = getJwtUser(data.token)
  return {
    accessToken: data.token,
    userId: user.id,
    username: user.username,
    email: user.email,
  }
}

export const useLoginApi = () =>
  useAppMutation({
    mutationFn: loginUser,
    customSuccessMessage: 'Login successful',
    customErrorMessage: 'Gagal Login !!!',
  })
