import {
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldCat,
  FaTerminal,
} from 'react-icons/fa6'
import { Link, useLocation } from 'react-router'
import { FormField } from './FormField'
import { SubmitButton } from './SubmitButton'
import { useAuthContext } from '../../context/AuthContext'
import { IconInput } from '@/components/inputs'

/** Form login: alias/email, password (bisa di-toggle), remember me, dan tombol submit. */
export function LoginForm() {
  const {
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleSubmit,
    handleForgotPassword,
    LoginFormMethods,
  } = useAuthContext()
  const location = useLocation()

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Username / email */}
      <FormField
        label="Developer Alias or Email"
        htmlFor="username"
        aside={
          <span className="font-mono text-xs text-geek-accent">[Required]</span>
        }
      >
        <IconInput
          id="username"
          control={LoginFormMethods.control}
          icon={<FaTerminal className="text-xs" />}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
        />
      </FormField>

      {/* Password */}
      <FormField
        label="Passkey / Cryptographic Hash"
        htmlFor="password"
        aside={
          <button
            type="button"
            onClick={handleForgotPassword}
            className="font-mono text-xs font-semibold text-geek-cyan transition-colors hover:text-slate-900 hover:underline"
          >
            Forgot Passkey?
          </button>
        }
      >
        <IconInput
          id="password"
          control={LoginFormMethods.control}
          icon={<FaLock className="text-xs" />}
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••••••"
          autoComplete="current-password"
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide passkey' : 'Show passkey'}
              className="flex items-center text-slate-400 transition-colors hover:text-geek-accent focus:outline-none"
            >
              {showPassword ? (
                <FaEyeSlash className="text-xs" />
              ) : (
                <FaEye className="text-xs" />
              )}
            </button>
          }
        />
      </FormField>

      {/* Remember me + info 2FA */}
      <div className="flex items-center justify-between pt-1">
        <label className="group flex cursor-pointer items-center">
          {/* Checkbox asli disembunyikan; kotak di bawah ini mengikuti state-nya lewat `peer` */}
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="peer sr-only"
          />
          <div className="flex h-4 w-4 items-center justify-center rounded border border-slate-300 bg-slate-50 text-white transition-all group-hover:border-geek-accent peer-checked:border-geek-accent peer-checked:bg-geek-accent peer-focus-visible:ring-2 peer-focus-visible:ring-geek-accent/50">
            <FaCheck className="text-[10px]" />
          </div>
          <span className="ml-2 font-mono text-xs font-medium text-slate-600 transition-colors group-hover:text-slate-900">
            Persist JWT Session
          </span>
        </label>

        <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-500">
          <FaShieldCat className="text-geek-accent" /> 2FA Enabled
        </div>
      </div>

      <SubmitButton />

      <p className="pt-1 text-center font-mono text-xs text-slate-500">
        New to the network?{' '}
        <Link
          to="/register"
          state={location.state}
          className="font-bold text-geek-cyan transition-colors hover:text-slate-900 hover:underline"
        >
          Request access
        </Link>
      </p>
    </form>
  )
}
