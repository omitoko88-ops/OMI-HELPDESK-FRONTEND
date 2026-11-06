import { useAppMutation } from '@/lib/ReactQueryHelper'
import { api } from '@/lib/axios'
import type { User } from '@/interfaces/User'
import type { RegisterResult } from '../../interface/RegisterApiResponse'

export interface RegisterPayload {
  firstName: string
  lastName: string
  countryCode: string
  phoneNumber: string
  password: string
}

interface RegisterApiEnvelope {
  data?: User
  user?: User
}

const registerUser = async (
  payload: RegisterPayload,
): Promise<RegisterResult> => {
  const response = await api.post<RegisterApiEnvelope | User>(
    '/api/Auth/register',
    payload,
  )

  const body = response.data
  const user =
    ('data' in body ? body.data : undefined) ??
    ('user' in body ? body.user : undefined) ??
    ('id' in body ? body : null)

  return { user: user ?? null }
}

export const useRegisterApi = () =>
  useAppMutation({
    mutationFn: registerUser,
    customSuccessMessage: 'Account created successfully',
    customErrorMessage: 'Registration failed',
  })
