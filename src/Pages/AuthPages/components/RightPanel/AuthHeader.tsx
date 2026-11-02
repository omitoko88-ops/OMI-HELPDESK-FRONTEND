import { FaKey, FaShieldHalved, FaTerminal } from 'react-icons/fa6'
import { useAuthContext } from '../../context/AuthContext'

/** Tab mode autentikasi + tombol toggle matrix rain. */
export function AuthHeader() {
  const { handleMatrixButton } = useAuthContext()

  return (
    <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
      <div className="flex items-center gap-4 font-mono text-sm">
        <button
          type="button"
          className="flex items-center gap-2 border-b-2 border-geek-accent pb-1 font-bold text-geek-accent"
        >
          <FaShieldHalved className="text-xs" /> USER_AUTH
        </button>
        {/* Tab SSO belum tersedia (maintenance) */}
        <button
          type="button"
          disabled
          title="SSO Maintenance"
          className="flex cursor-not-allowed items-center gap-2 pb-1 text-slate-400 opacity-60"
        >
          <FaKey className="text-xs" /> SSO_TOKEN
        </button>
      </div>

      <button
        type="button"
        onClick={handleMatrixButton}
        className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-600 transition-all hover:border-geek-cyan hover:text-geek-cyan"
      >
        <FaTerminal className="text-geek-accent" /> Matrix Rain
      </button>
    </div>
  )
}
