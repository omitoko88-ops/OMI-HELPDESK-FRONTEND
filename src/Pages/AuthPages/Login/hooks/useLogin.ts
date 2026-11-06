import { useCallback, useEffect, useRef } from 'react'
import type { AppendLog, ShowMessage } from '../types'
import { useLoginApi } from './Api/useLoginApi'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router'

// Lama jeda (ms) antara "Access Granted" dan pindah halaman
const REDIRECT_DELAY_MS = 15000

interface UseLoginOptions {
  appendLog: AppendLog
  showMessage: ShowMessage
}

export function useLogin({ appendLog, showMessage }: UseLoginOptions) {
  const loginApi = useLoginApi()
  const { setToken } = useAuthStore()
  const navigate = useNavigate()

  // Simpan id timer redirect agar bisa dibatalkan saat unmount
  const redirectTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup: batalkan redirect yang belum jalan supaya tidak
      // memanggil navigate setelah komponen hilang
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current)
    }
  }, [])

  // // Status 'success' tetap aktif selama delay (isSuccess tidak reset sendiri),
  // // jadi tombol login bisa tetap di-disable sampai pindah halaman
  // const status: LoginStatus = loginApi.isPending
  //   ? 'loading'
  //   : loginApi.isSuccess
  //     ? 'success'
  //     : 'idle'

  const { mutate } = loginApi

  const login = useCallback(
    (username: string, password: string) => {
      appendLog(`[AUTH] Initiating handshake for: ${username}...`, 'accent')

      mutate(
        { username, password },
        {
          onError: (err) => {
            showMessage(`Access Denied: ${err.message}`, 'error')
            appendLog(
              `[ERROR] Authentication failed for ${username}: ${err.message} (code ${err.code})`,
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
            setToken(res.token)

            appendLog('[REDIRECT] Loading /dashboard...', 'accent')

            // Delay hanya untuk efek tampilan, lalu pindah halaman
            redirectTimer.current = window.setTimeout(() => {
              navigate('/')
            }, REDIRECT_DELAY_MS)
          },
        },
      )
    },
    [appendLog, showMessage, mutate, setToken, navigate],
  )

  return { loginApi, login }
}
