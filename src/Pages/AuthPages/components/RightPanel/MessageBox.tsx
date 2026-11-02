import type { IconType } from 'react-icons'
import {
  FaCircleCheck,
  FaCircleInfo,
  FaTriangleExclamation,
} from 'react-icons/fa6'
import type { AlertType } from '../../types'
import { useAuthContext } from '../../context/AuthContext'

const ALERT_STYLES: Record<
  AlertType,
  { box: string; icon: IconType; iconClass: string }
> = {
  error: {
    box: 'border-red-200 bg-red-50 text-red-700',
    icon: FaTriangleExclamation,
    iconClass: 'text-red-600',
  },
  success: {
    box: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: FaCircleCheck,
    iconClass: 'text-emerald-600',
  },
  info: {
    box: 'border-sky-200 bg-sky-50 text-sky-700',
    icon: FaCircleInfo,
    iconClass: 'text-sky-600',
  },
}

/** Kotak pesan di atas form. Tidak dirender jika belum ada pesan. */
export function MessageBox() {
  const { alert } = useAuthContext()

  if (!alert) return null

  const { box, icon: Icon, iconClass } = ALERT_STYLES[alert.type]

  return (
    <div
      role={alert.type === 'error' ? 'alert' : 'status'}
      className={`mb-6 flex animate-fade-in items-center gap-3 rounded-xl border p-3.5 font-mono text-xs ${box}`}
    >
      <Icon className={`text-sm ${iconClass}`} />
      <span>{alert.text}</span>
    </div>
  )
}
