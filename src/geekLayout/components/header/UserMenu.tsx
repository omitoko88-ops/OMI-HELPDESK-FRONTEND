import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores/authStore'
import { getJwtUser } from '@/lib/jwt'
import { Icon } from '../ui/Icon'

interface UserMenuProps {
  memberCount: number
  accessLabel: string
}

export function UserMenu({ memberCount, accessLabel }: UserMenuProps) {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const logout = useAuthStore((state) => state.logout)
  const user = getJwtUser(token)
  const initials = user.username.slice(0, 2).toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-1.5 font-mono text-[10px] text-slate-500 sm:flex" title="Workspace members">
        <Icon name="users" className="text-geek-cyan" />
        <span className="font-bold text-slate-700">{memberCount}</span>
        <span>members</span>
      </div>
      <span className="h-4 w-px bg-slate-200" />
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
          {initials}
        </span>
        <div className="hidden text-left font-mono lg:block">
          <div className="text-xs font-bold leading-tight text-slate-800">{user.username}</div>
          <div className="text-[10px] text-geek-accent">● {accessLabel}</div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          title="Log out"
          className="ml-1 rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <Icon name="right-from-bracket" />
        </button>
      </div>
    </div>
  )
}
