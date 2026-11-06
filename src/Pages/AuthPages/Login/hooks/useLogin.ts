import { useCallback } from 'react'
import type { AppendLog, ShowMessage } from '../types'
import { useLoginApi } from './Api/useLoginApi'
import { useAuthStore } from '@/stores/authStore'

interface UseLoginOptions {
  appendLog: AppendLog
  showMessage: ShowMessage
  clearMessage: () => void
}

export function useLogin({
  appendLog,
  showMessage,
  clearMessage,
}: UseLoginOptions) {
  const loginApi = useLoginApi()
  const setSession = useAuthStore((state) => state.setSession)

  const { mutate, isPending } = loginApi

  const login = useCallback(
    (username: string, password: string, rememberMe: boolean) => {
      if (isPending) return

      clearMessage()
      appendLog(`[AUTH] Initiating handshake for: ${username}...`, 'accent')

      mutate(
        { username, password },
        {
          onError: (err) => {
            showMessage(`Access Denied: ${err.message}`, 'error')
            appendLog(
              `[ERROR] Authentication failed for ${username}: ${err.message} (code ${err.status})`,
              'warning',
            )
          },
          onSuccess: (res) => {
            showMessage(
              'Access Granted! Decrypting Documentation Vault...',
              'success',
            )
            appendLog(
              `[SUCCESS] 200 OK - Access token generated for ${username}`,
              'cyan',
            )

            // Token disimpan langsung (tidak menunggu delay) agar
            // halaman tujuan sudah punya sesi saat dibuka
            setSession(res.accessToken, res.userId, rememberMe)
            appendLog('[REDIRECT] Restoring requested page...', 'accent')
          },
        },
      )
    },
    [appendLog, clearMessage, isPending, mutate, setSession, showMessage],
  )

  return { loginApi, login }
}
