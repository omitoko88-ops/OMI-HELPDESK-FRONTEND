import { useCallback, useState } from 'react'
import type { AlertState, ShowMessage } from '../types'

/** Mengelola pesan alert (error / success / info) di atas form login. */
export function useAlert() {
  const [alert, setAlert] = useState<AlertState | null>(null)

  const showMessage = useCallback<ShowMessage>((text, type = 'error') => {
    setAlert({ text, type })
  }, [])

  const clearMessage = useCallback(() => setAlert(null), [])

  return { alert, showMessage, clearMessage }
}
