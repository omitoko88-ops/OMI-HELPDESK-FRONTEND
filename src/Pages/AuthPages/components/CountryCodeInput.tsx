import { useId } from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import { FormattedField } from '@/components/FormattedField'
import { cn } from '@/lib/utils'

interface CountryCodeInputProps<T extends FieldValues> {
  id: Path<T>
  control: Control<T>
  className?: string
}

/** Compact +62-style country calling code input used beside phone numbers. */
export function CountryCodeInput<T extends FieldValues>({
  id,
  control,
  className,
}: CountryCodeInputProps<T>) {
  const errorId = useId()

  return (
    <FormattedField id={id} control={control}>
      {({ inputProps, error }) => (
        <div className="flex flex-col gap-1">
          <div className="relative rounded-xl shadow-sm">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-sm text-slate-400">
              +
            </span>
            <input
              {...inputProps}
              type="tel"
              inputMode="numeric"
              maxLength={4}
              placeholder="62"
              aria-label="Country calling code"
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              className={cn(
                'w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pr-3 pl-7 font-mono text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-geek-accent focus:bg-white focus:ring-1 focus:ring-geek-accent focus:outline-none',
                error && 'border-red-500',
                className,
              )}
            />
          </div>
          {error && (
            <span id={errorId} className="text-sm text-red-500">
              {error.message}
            </span>
          )}
        </div>
      )}
    </FormattedField>
  )
}
