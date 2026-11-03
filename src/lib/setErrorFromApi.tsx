import { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from './ApiError'
import { toast } from 'sonner'
import { CheckCircle, X } from 'lucide-react'

interface SetErrorOptions<T extends FieldValues> {
  setError?: UseFormSetError<T>
  forceToast?: boolean
  // Dipindah ke options supaya bisa dikirim dari useAppMutation
  customErrorMessage?: string
}

export function setErrorFromApi<T extends FieldValues>(
  error: unknown,
  { setError, forceToast, customErrorMessage }: SetErrorOptions<T>,
): void {
  const showToast = (msg: string) => {
    toast.error(msg || customErrorMessage || 'Unexpected error occurred', {
      icon: <X className="text-red-500" />,
    })
  }

  // Pesan fallback
  const fallback = customErrorMessage || 'Unexpected error occurred'

  // Bukan ApiError (misal error JS biasa): tampilkan pesan fallback saja
  if (!(error instanceof ApiError)) {
    showToast(fallback)
    return
  }

  // Gabungkan semua pesan field jadi satu string (dipakai untuk toast)
  const fieldMessages = error.fields
    ? Object.values(error.fields).flat().join(', ')
    : ''

  // Kasus 1: dipaksa toast, atau tidak ada handler form
  if (forceToast || !setError) {
    showToast((forceToast && fieldMessages) || error.message || fallback)
    return
  }

  // Kasus 2: tidak ada field errors, tampilkan pesan umum
  if (!error.fields) {
    showToast(error.message || fallback)
    return
  }

  // Kasus 3: ada field errors + form handler
  const unmatched: string[] = []

  Object.entries(error.fields).forEach(([field, messages]) => {
    // Hanya field yang ada di form yang akan menampilkan error;
    // sisanya dikumpulkan agar tidak hilang diam-diam
    if (field in (setError as any).__fields) {
      setError(field as Path<T>, {
        type: 'server',
        message: messages.join(', '),
      })
    } else {
      unmatched.push(...messages)
    }
  })

  if (unmatched.length) showToast(unmatched.join(', '))
}
