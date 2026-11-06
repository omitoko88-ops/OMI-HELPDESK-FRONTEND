import { Link, useLocation } from 'react-router'
import {
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaIdCard,
  FaLock,
  FaPhone,
  FaUser,
} from 'react-icons/fa6'
import { FormField } from '../../Login/components/RightPanel/FormField'
import { IconInput } from '@/components/inputs'
import { CountryCodeInput } from '../../components/CountryCodeInput'
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="First Name" htmlFor="firstName">
          <IconInput
            id="firstName"
            control={control}
            icon={<FaUser className="text-xs" />}
            placeholder="Ada"
            autoComplete="given-name"
          />
        </FormField>

        <FormField label="Last Name" htmlFor="lastName">
          <IconInput
            id="lastName"
            control={control}
            icon={<FaIdCard className="text-xs" />}
            placeholder="Lovelace"
            autoComplete="family-name"
          />
        </FormField>
      </div>

      <FormField
        label="Secure Contact Number"
        htmlFor="phoneNumber"
        aside={
          <span className="font-mono text-xs text-geek-accent">[Required]</span>
        }
      >
        <div className="grid grid-cols-[5.5rem_1fr] gap-3">
          <CountryCodeInput id="countryCode" control={control} />
          <IconInput
            id="phoneNumber"
            control={control}
            icon={<FaPhone className="text-xs" />}
            type="tel"
            inputMode="numeric"
            placeholder="81234567890"
            autoComplete="tel-national"
          />
        </div>
      </FormField>

      <FormField label="Passkey / Cryptographic Hash" htmlFor="password">
        <IconInput
          id="password"
          control={control}
          icon={<FaLock className="text-xs" />}
          type={showPassword ? 'text' : 'password'}
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
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

      <FormField label="Confirm Passkey" htmlFor="confirmPassword">
        <IconInput
          id="confirmPassword"
          control={control}
          icon={<FaLock className="text-xs" />}
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Re-enter passkey"
          autoComplete="new-password"
          trailing={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword
                  ? 'Hide password confirmation'
                  : 'Show password confirmation'
              }
              className="flex items-center text-slate-400 transition-colors hover:text-geek-accent focus:outline-none"
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="text-xs" />
              ) : (
                <FaEye className="text-xs" />
              )}
            </button>
          }
        />
      </FormField>

      <div>
        <label className="group flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            {...register('acceptTerms')}
            className="peer sr-only"
          />
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-300 bg-slate-50 text-white transition-all group-hover:border-geek-accent peer-checked:border-geek-accent peer-checked:bg-geek-accent peer-focus-visible:ring-2 peer-focus-visible:ring-geek-accent/50">
            {acceptTerms && <FaCheck className="text-[10px]" />}
          </span>
          <span className="font-mono text-[11px] leading-relaxed text-slate-600">
            I accept the security policy and authorize creation of this
            developer identity.
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1.5 text-sm text-red-500">
            {errors.acceptTerms.message}
          </p>
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
