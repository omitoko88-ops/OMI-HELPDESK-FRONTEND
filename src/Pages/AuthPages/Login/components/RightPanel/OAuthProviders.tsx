import type { IconType } from 'react-icons'
import { FaBitbucket, FaGithub, FaGitlab } from 'react-icons/fa6'
import { useAuthContext } from '../../context/AuthContext'

interface Provider {
  name: string
  icon: IconType
  buttonClass: string // gaya hover khusus tiap provider
  iconClass: string
}

// Daftar provider OAuth. Tambah provider baru cukup dengan menambah item di sini.
const PROVIDERS: Provider[] = [
  {
    name: 'GitHub',
    icon: FaGithub,
    buttonClass: 'hover:border-slate-800 hover:bg-slate-100',
    iconClass: '',
  },
  {
    name: 'GitLab',
    icon: FaGitlab,
    buttonClass:
      'hover:border-orange-500 hover:bg-orange-50/50 hover:text-orange-600',
    iconClass: 'text-orange-500',
  },
  {
    name: 'Bitbucket',
    icon: FaBitbucket,
    buttonClass:
      'hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-600',
    iconClass: 'text-blue-500',
  },
]

/** Tombol login lewat penyedia identitas OAuth. */
export function OAuthProviders() {
  const { handleOAuth } = useAuthContext()

  return (
    <div className="mt-8">
      {/* Pembatas dengan label di tengah */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="w-full border-t border-slate-200" />
        <span className="absolute bg-white px-3 font-mono text-[11px] font-bold tracking-widest text-slate-500 uppercase">
          OAuth 2.0 Identity Providers
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {PROVIDERS.map(({ name, icon: Icon, buttonClass, iconClass }) => (
          <button
            key={name}
            type="button"
            onClick={() => handleOAuth(name)}
            className={`flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-xs font-semibold text-slate-800 transition-all duration-200 ${buttonClass}`}
          >
            <Icon className={`text-sm ${iconClass}`} />
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
