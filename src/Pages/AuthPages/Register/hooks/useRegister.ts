import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import type { RegisterFormType } from '@/schemas/RegisterSchema'
import type { ShowMessage } from '../../Login/types'
import { useRegisterApi, type RegisterPayload } from './Api/useRegisterApi'

interface UseRegisterOptions {
  showMessage: ShowMessage
  clearMessage: () => void
  onFieldErrors?: (fields: Record<string, string[]>) => void
}

export function useRegister({
  showMessage,
  clearMessage,
  onFieldErrors,
}: UseRegisterOptions) {
  const registerApi = useRegisterApi()
  const navigate = useNavigate()
  const { mutate, isPending } = registerApi

  const register = useCallback(
    (values: RegisterFormType) => {
      if (isPending) return

      const payload: RegisterPayload = {
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }

      clearMessage()
      mutate(payload, {
        onError: (error) => {
          if (error.errors) onFieldErrors?.(error.errors)
          showMessage(error.message, 'error')
        },
        onSuccess: () => {
          navigate('/login', {
            replace: true,
            state: { registered: true },
          })
        },
      })
    },
    [clearMessage, isPending, mutate, navigate, onFieldErrors, showMessage],
  )

  return { registerApi, register }
}
