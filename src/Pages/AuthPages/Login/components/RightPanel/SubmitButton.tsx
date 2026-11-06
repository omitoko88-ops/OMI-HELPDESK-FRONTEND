import { FaBolt, FaCheck, FaCircleNotch } from 'react-icons/fa6'
import type { LoginStatus } from '../../types'
import { UseMutationResult } from '@tanstack/react-query'
import { useAuthContext } from '../../context/AuthContext'

// Gaya tombol untuk tiap status (ditulis utuh agar terdeteksi Tailwind)
const STATUS_CLASS: Record<
  UseMutationResult<unknown, unknown, unknown, unknown>['status'],
  string
> = {
  idle: 'bg-slate-900 hover:bg-slate-800 active:scale-[0.99]',
  pending: 'bg-slate-900', // Gunakan 'pending' untuk v5
  success: 'bg-geek-accent',
  error: 'bg-red-600',
}

/** Tombol submit dengan 3 tampilan: idle, loading, dan sukses. */
export function SubmitButton() {
  const { loginApi } = useAuthContext()

  const isDisabled = loginApi.isPending || loginApi.isSuccess

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 px-4 py-3.5 font-mono text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 ${STATUS_CLASS[loginApi.status]}`}
    >
      {loginApi.isIdle && (
        <>
          <FaBolt className="text-geek-accent" />
          <span>EXECUTE AUTHENTICATION</span>
        </>
      )}
      {loginApi.isError && (
        <>
          <FaBolt className="text-geek-bg" />
          <span>RETRY AUTHENTICATION</span>
        </>
      )}
      {loginApi.isPending && (
        <>
          <FaCircleNotch className="animate-spin text-geek-accent" />
          <span>VERIFYING CREDENTIALS...</span>
        </>
      )}
      {loginApi.isSuccess && (
        <>
          <FaCheck />
          <span>ACCESS GRANTED</span>
        </>
      )}
    </button>
  )
}
