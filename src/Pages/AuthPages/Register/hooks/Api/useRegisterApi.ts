import { useAppMutation } from '@/lib/ReactQueryHelper'
import { api } from '@/lib/api/client'

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
  api<RegisterResult>('/api/Auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  })

export const useRegisterApi = () =>
  useAppMutation({
    mutationFn: registerUser,
    customSuccessMessage: 'Account created successfully',
    customErrorMessage: 'Registration failed',
  })
