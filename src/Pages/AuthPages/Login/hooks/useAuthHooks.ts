import { FormEvent, useState } from 'react'
import { useAlert } from './useAlert'
import { useTerminal } from './useTerminal'
import { useLogin } from './useLogin'
import { TerminalFormValues } from '../components/LeftPanel/TerminalConsole'
import { useForm } from 'react-hook-form'

export function useAuthHooks() {
  const [matrixActive, setMatrixActive] = useState(true)
  const toggleMatrix = () => setMatrixActive((prev) => !prev)

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const TerminalFormMethods = useForm<TerminalFormValues>({
    defaultValues: {
      command: '',
    },
  })

  const LoginFormMethods = useForm<{ username: string; password: string }>({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // Handler yang dipanggil HANYA kalau validasi react-hook-form lolos.
  // `values` berisi { username, password } dari form.
  const onValidSubmit = (values: { username: string; password: string }) => {
    console.log('submit', values)
    login(values.username, values.password)
  }
  const handleSubmit = LoginFormMethods.handleSubmit(onValidSubmit)

  const { alert, showMessage } = useAlert()

  const { logs, appendLog, runCommand, showTrivia } = useTerminal({
    matrixActive,
    onToggleMatrix: toggleMatrix,
  })

  const { loginApi, login } = useLogin({ appendLog, showMessage })

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
