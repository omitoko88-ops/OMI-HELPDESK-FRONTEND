import { Link, useLocation } from 'react-router'
import { FaShieldHalved, FaUserPlus } from 'react-icons/fa6'

export function RegisterHeader() {
  const location = useLocation()

  return (
    <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
      <div className="flex items-center gap-4 font-mono text-sm">
        <Link
          to="/login"
          state={location.state}
          className="flex items-center gap-2 pb-1 text-slate-400 transition-colors hover:text-geek-accent"
        >
          <FaShieldHalved className="text-xs" /> USER_AUTH
        </Link>
        <span className="flex items-center gap-2 border-b-2 border-geek-accent pb-1 font-bold text-geek-accent">
          <FaUserPlus className="text-xs" /> NEW_IDENTITY
        </span>
      </div>

      <span className="hidden font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase sm:inline">
        Secure enrollment
      </span>
    </div>
  )
}
