import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { registerSchema, type RegisterFormType } from '@/schemas/RegisterSchema'
import { useAlert } from '../../Login/hooks/useAlert'
import { useRegister } from './useRegister'

export function useRegisterHooks() {
  const [matrixActive, setMatrixActive] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const registerFormMethods = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      countryCode: '62',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  const { alert, showMessage, clearMessage } = useAlert()
  const { registerApi, register } = useRegister({
    showMessage,
    clearMessage,
    onFieldErrors: (fields) => {
      Object.entries(fields).forEach(([field, messages]) => {
        registerFormMethods.setError(field as keyof RegisterFormType, {
          type: 'server',
          message: messages.join(', '),
        })
      })
    },
  })

  const onSubmit = registerFormMethods.handleSubmit(register)

  return {
    matrixActive,
    toggleMatrix: () => setMatrixActive((prev) => !prev),
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    registerFormMethods,
    alert,
    registerApi,
    onSubmit,
  }
}
