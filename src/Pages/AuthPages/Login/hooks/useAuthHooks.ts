import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router'
import { useAlert } from './useAlert'
import { useTerminal } from './useTerminal'
import { useLogin } from './useLogin'
import { loginSchema, type LoginFormType } from '@/schemas/LoginSchema'
import type { TerminalFormValues } from '../components/LeftPanel/TerminalConsole'

export function useAuthHooks() {
  const location = useLocation()
  const [matrixActive, setMatrixActive] = useState(true)
  const toggleMatrix = () => setMatrixActive((prev) => !prev)

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const TerminalFormMethods = useForm<TerminalFormValues>({
    defaultValues: {
      command: '',
    },
  })

  const LoginFormMethods = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const { alert, showMessage, clearMessage } = useAlert()

  useEffect(() => {
    if (!(location.state as { registered?: boolean } | null)?.registered) return

    showMessage(
      'Account provisioned successfully. Authenticate to continue.',
      'success',
    )
  }, [location.state, showMessage])

  const { logs, appendLog, runCommand, showTrivia } = useTerminal({
    matrixActive,
    onToggleMatrix: toggleMatrix,
  })

  const { loginApi, login } = useLogin({
    appendLog,
    showMessage,
    clearMessage,
  })

  // Handler yang dipanggil HANYA kalau validasi react-hook-form lolos.
  const onValidSubmit = (values: LoginFormType) => {
    login(values.username, values.password, rememberMe)
  }
  const handleSubmit = LoginFormMethods.handleSubmit(onValidSubmit)

  // Tombol "Matrix Rain" di panel kanan: toggle + tampilkan pesan status
  const handleMatrixButton = () => {
    toggleMatrix()
    showMessage(
      matrixActive ? 'Matrix stream paused.' : 'Matrix stream active.',
      'info',
    )
  }

  const handleForgotPassword = () => {
    showMessage(
      'Passkey recovery link dispatched to registered developer PGP mail.',
      'info',
    )
    appendLog('[RECOVERY] Dispatched PGP reset link', 'cyan')
  }

  const handleOAuth = (provider: string) => {
    showMessage(`Connecting to ${provider} OAuth Gateway...`, 'info')
    appendLog(`[OAUTH] Requesting token from provider: ${provider}`, 'cyan')
  }

  const handleClusterInfo = () => {
    showMessage('System Latency: 14ms | Node: US-East-1', 'info')
  }

  return {
    matrixActive,
    toggleMatrix,
    alert,
    showMessage,
    logs,
    appendLog,
    runCommand,
    showTrivia,
    loginApi,
    login,
    handleMatrixButton,
    handleForgotPassword,
    handleOAuth,
    handleClusterInfo,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleSubmit,
    TerminalFormMethods,
    LoginFormMethods,
  }
}
