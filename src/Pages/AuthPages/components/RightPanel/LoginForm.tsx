import { useState, type FormEvent } from 'react'
import {
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldCat,
  FaTerminal,
} from 'react-icons/fa6'
import type { LoginStatus } from '../../types'
import { FormField } from './FormField'
import { InputField } from './InputField'
import { SubmitButton } from './SubmitButton'
import { useAuthContext } from '../../context/AuthContext'

interface LoginFormProps {
  status: LoginStatus
  onLogin: (username: string, password: string) => void
  onForgotPassword: () => void
}

/** Form login: alias/email, password (bisa di-toggle), remember me, dan tombol submit. */
export function LoginForm() {
  const {
    status,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleSubmit,
    handleForgotPassword,
    password,
    setPassword,
    username,
    setUsername,
  } = useAuthContext()

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
        <InputField
          id="username"
          type="text"
          required
          autoComplete="username"
          placeholder="e.g. neo@zion.net or linus_torvalds"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={<FaTerminal className="text-xs" />}
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
        <InputField
          id="password"
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete="current-password"
          placeholder="••••••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<FaLock className="text-xs" />}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide passkey' : 'Show passkey'}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-geek-accent focus:outline-none"
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

      <SubmitButton status={status} />
    </form>
  )
}
