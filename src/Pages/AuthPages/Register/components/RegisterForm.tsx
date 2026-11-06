import { Link, useLocation } from 'react-router'
import { FaCheck, FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa6'
import { FormField } from '../../Login/components/RightPanel/FormField'
import { IconInput } from '@/components/inputs'
import { useRegisterContext } from '../context/AuthContext'
import { RegisterSubmitButton } from './RegisterSubmitButton'

export function RegisterForm() {
  const {
    registerFormMethods,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    onSubmit,
  } = useRegisterContext()
  const location = useLocation()
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = registerFormMethods
  const acceptTerms = watch('acceptTerms')

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormField label="Username" htmlFor="username">
        <IconInput
          id="username"
          control={control}
          icon={<FaUser className="text-xs" />}
          placeholder="your_username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
        />
      </FormField>

      <FormField label="Email" htmlFor="email">
        <IconInput
          id="email"
          control={control}
          icon={<FaEnvelope className="text-xs" />}
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          autoCapitalize="none"
        />
      </FormField>

      <FormField label="Passkey / Cryptographic Hash" htmlFor="password">
        <IconInput
          id="password"
          control={control}
          icon={<FaLock className="text-xs" />}
          type={showPassword ? 'text' : 'password'}
          placeholder="Minimal 8 karakter, huruf dan angka"
          autoComplete="new-password"
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="flex items-center text-slate-400 transition-colors hover:text-geek-accent focus:outline-none"
            >
              {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
            </button>
          }
        />
      </FormField>

      <FormField label="Confirm Passkey" htmlFor="confirmPassword">
        <IconInput
          id="confirmPassword"
          control={control}
          icon={<FaLock className="text-xs" />}
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Ulangi password"
          autoComplete="new-password"
          trailing={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
              className="flex items-center text-slate-400 transition-colors hover:text-geek-accent focus:outline-none"
            >
              {showConfirmPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
            </button>
          }
        />
      </FormField>

      <div>
        <label className="group flex cursor-pointer items-start gap-2.5">
          <input type="checkbox" {...register('acceptTerms')} className="peer sr-only" />
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-300 bg-slate-50 text-white transition-all group-hover:border-geek-accent peer-checked:border-geek-accent peer-checked:bg-geek-accent peer-focus-visible:ring-2 peer-focus-visible:ring-geek-accent/50">
            {acceptTerms && <FaCheck className="text-[10px]" />}
          </span>
          <span className="font-mono text-[11px] leading-relaxed text-slate-600">
            I accept the security policy and authorize creation of this developer identity.
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1.5 text-sm text-red-500">{errors.acceptTerms.message}</p>
        )}
      </div>

      <RegisterSubmitButton />

      <p className="pt-1 text-center font-mono text-xs text-slate-500">
        Already have clearance?{' '}
        <Link
          to="/login"
          state={location.state}
          className="font-bold text-geek-cyan transition-colors hover:text-slate-900 hover:underline"
        >
          Authenticate here
        </Link>
      </p>
    </form>
  )
}
