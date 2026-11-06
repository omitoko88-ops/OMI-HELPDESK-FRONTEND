import { FaLock, FaShieldHalved } from 'react-icons/fa6'
import { AuthMessageBox } from '../../components/AuthMessageBox'
import { useRegisterContext } from '../context/AuthContext'
import { RegisterForm } from './RegisterForm'
import { RegisterHeader } from './RegisterHeader'

export function RegisterPanel() {
  const { alert } = useRegisterContext()

  return (
    <div className="relative flex flex-col justify-center bg-white p-8 lg:col-span-7 lg:p-12">
      <RegisterHeader />

      <div className="mb-7">
        <p className="font-mono text-[11px] font-bold tracking-widest text-geek-cyan uppercase">
          {'// Identity bootstrap'}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Provision your developer account
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          Create a secure identity to access the documentation vault, API
          references, and collaboration tools.
        </p>
      </div>

      <AuthMessageBox alert={alert} />
      <RegisterForm />

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4 font-mono text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <FaShieldHalved className="text-geek-accent" /> Encrypted enrollment
        </span>
        <span className="flex items-center gap-1.5">
          <FaLock className="text-geek-cyan" /> TLS 1.3
        </span>
      </div>
    </div>
  )
}
