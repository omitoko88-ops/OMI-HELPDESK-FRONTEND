import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppendLog, LoginStatus, ShowMessage } from '../types'
import { MIN_PASSWORD_LENGTH } from '@/data/constants'

interface UseLoginOptions {
  appendLog: AppendLog
  showMessage: ShowMessage
}

/**
 * Simulasi proses autentikasi.
 * GANTI isi setTimeout di bawah dengan pemanggilan API login sungguhan
 * (mis. fetch/axios ke endpoint backend), lalu set status sesuai hasilnya.
 */
export function useLogin({ appendLog, showMessage }: UseLoginOptions) {
  const [status, setStatus] = useState<LoginStatus>('idle')
  // Simpan id timer supaya bisa dibatalkan saat komponen di-unmount
  const timers = useRef<number[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((id) => window.clearTimeout(id))
  }, [])

  const login = useCallback(
    (username: string, password: string) => {
      setStatus('loading')
      appendLog(`[AUTH] Initiating handshake for: ${username}...`, 'accent')

      const verifyTimer = window.setTimeout(() => {
        if (password.length < MIN_PASSWORD_LENGTH) {
          // Gagal: tampilkan error dan kembalikan tombol ke keadaan semula
          showMessage(
            'Access Denied: Key string length below cryptographic requirements.',
            'error',
          )
          appendLog(
            `[ERROR] Authentication failed for ${username}: Invalid Passkey Length`,
            'warning',
          )
          setStatus('idle')
          return
        }

        // Berhasil
        showMessage(
          'Access Granted! Decrypting Documentation Vault...',
          'success',
        )
        appendLog(
          `[SUCCESS] 200 OK - Access token generated for ${username}`,
          'cyan',
        )
        setStatus('success')

        // Simulasi redirect. Ganti dengan navigate('/dashboard') dari router Anda.
        const redirectTimer = window.setTimeout(() => {
          appendLog('[REDIRECT] Loading /docs/dashboard...', 'accent')
        }, 1000)
        timers.current.push(redirectTimer)
      }, 1200)

      timers.current.push(verifyTimer)
    },
    [appendLog, showMessage],
  )

  return { status, login }
}
