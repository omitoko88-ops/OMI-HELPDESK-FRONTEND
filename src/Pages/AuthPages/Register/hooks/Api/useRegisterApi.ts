import { useAppMutation } from '@/lib/ReactQueryHelper'
import { authApi } from '@/lib/api/endpoints'

export interface RegisterPayload {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterResult {
  message: string
}

const registerUser = async (payload: RegisterPayload): Promise<RegisterResult> =>
  authApi.register(payload)

export const useRegisterApi = () =>
  useAppMutation({
    mutationFn: registerUser,
    customSuccessMessage: 'Account created successfully',
    customErrorMessage: 'Registration failed',
  })
