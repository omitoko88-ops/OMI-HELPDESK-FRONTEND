import { FaBolt, FaCheck, FaCircleNotch } from 'react-icons/fa6'
import { useRegisterContext } from '../context/AuthContext'

const STATUS_CLASS: Record<'idle' | 'pending' | 'success' | 'error', string> = {
  idle: 'bg-slate-900 hover:bg-slate-800 active:scale-[0.99]',
  pending: 'bg-slate-900',
  success: 'bg-geek-accent',
  error: 'bg-red-600',
}

export function RegisterSubmitButton() {
  const { registerApi } = useRegisterContext()
  const isDisabled = registerApi.isPending || registerApi.isSuccess

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 px-4 py-3.5 font-mono text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 ${STATUS_CLASS[registerApi.status]}`}
    >
      {registerApi.isIdle && (
        <>
          <FaBolt className="text-geek-accent" />
          <span>PROVISION DEVELOPER ACCOUNT</span>
        </>
      )}
      {registerApi.isError && (
        <>
          <FaBolt className="text-geek-bg" />
          <span>RETRY REGISTRATION</span>
        </>
      )}
      {registerApi.isPending && (
        <>
          <FaCircleNotch className="animate-spin text-geek-accent" />
          <span>CREATING SECURE PROFILE...</span>
        </>
      )}
      {registerApi.isSuccess && (
        <>
          <FaCheck />
          <span>ACCOUNT PROVISIONED</span>
        </>
      )}
    </button>
  )
}
