import { FormEvent, useState } from 'react'
import { useAlert } from './useAlert'
import { useTerminal } from './useTerminal'
import { useLogin } from './useLogin'

export function useAuthHooks() {
  const [matrixActive, setMatrixActive] = useState(true)
  const toggleMatrix = () => setMatrixActive((prev) => !prev)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Cegah submit ganda saat proses login masih berjalan
    if (status !== 'idle') return
    login(username, password)
  }

  const { alert, showMessage } = useAlert()

  const { logs, appendLog, runCommand, showTrivia } = useTerminal({
    matrixActive,
    onToggleMatrix: toggleMatrix,
  })

  const { status, login } = useLogin({ appendLog, showMessage })

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
    status,
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
    password,
    setPassword,
    username,
    setUsername,
  }
}
