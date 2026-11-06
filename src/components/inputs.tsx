'use client'

import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import { FormattedField } from './FormattedField'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*  DESIGN 1: terminal prompt  ( > command_ )                                 */
/* -------------------------------------------------------------------------- */

interface TerminalInputProps<T extends FieldValues> {
  id: Path<T>
  control: Control<T>
  onEnter?: (value: string) => void // Called when the user presses Enter
  placeholder?: string
  className?: string // Applies to the outer row
}

export function TerminalInput<T extends FieldValues>({
  id,
  control,
  onEnter,
  placeholder = "type 'help' or commands...",
  className,
}: TerminalInputProps<T>) {
  return (
    <FormattedField id={id} control={control}>
      {({ inputProps }) => (
        // Your original markup, unchanged
        <div
          className={cn(
            'mt-3 flex items-center gap-1.5 border-t border-slate-800 pt-2 text-emerald-400',
            className,
          )}
        >
          <span>&gt;</span>
          <input
            {...inputProps} // id, name, value, onChange, onBlur, ref from the form
            type="text"
            onKeyDown={(e) => {
              // Enter -> give the current text to the parent
              if (e.key === 'Enter') onEnter?.(e.currentTarget.value)
            }}
            placeholder={placeholder}
            aria-label="Terminal command"
            autoComplete="off"
            spellCheck={false}
            className="w-full border-none bg-transparent font-mono text-xs text-emerald-400 outline-none placeholder:text-slate-500 focus:ring-0"
          />
          {/* Blinking cursor (needs an animate-blink keyframe in your Tailwind config) */}
          <span className="animate-blink font-bold text-emerald-400">_</span>
        </div>
      )}
    </FormattedField>
  )
}

/* -------------------------------------------------------------------------- */
/*  DESIGN 2: field with left icon + optional trailing element + error text   */
/* -------------------------------------------------------------------------- */

interface IconInputProps<T extends FieldValues>
  extends Omit<
    React.ComponentProps<'input'>,
    'id' | 'name' | 'value' | 'onChange' | 'ref'
  > {
  id: Path<T> // Form field name
  control: Control<T>
  isNumber?: boolean
  isNumberWithoutDot?: boolean
  isCurrency?: boolean
  icon?: React.ReactNode // Rendered on the left
  trailing?: React.ReactNode // Rendered on the right (e.g. show/hide password button)
}

export function IconInput<T extends FieldValues>({
  id,
  control,
  isNumber,
  isNumberWithoutDot,
  isCurrency,
  maxLength,
  icon,
  trailing,
  className,
  ...rest // type, placeholder, disabled, autoComplete, etc. go straight to <input>
}: IconInputProps<T>) {
  return (
    <FormattedField
      id={id}
      control={control}
      isNumber={isNumber}
      isNumberWithoutDot={isNumberWithoutDot}
      isCurrency={isCurrency}
      maxLength={maxLength}
    >
      {({ inputProps, error }) => (
        <div className="flex flex-col gap-1">
          <div className="relative rounded-xl shadow-sm">
            {/* Left icon; pointer-events-none so clicks reach the input */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              {icon}
            </div>

            <input
              type="text"
              {...rest}
              {...inputProps} // Form binding wins over anything in `rest`
              aria-invalid={!!error} // Accessibility: announce the error state
              className={cn(
                'w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 font-mono text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-geek-accent focus:bg-white focus:ring-1 focus:ring-geek-accent focus:outline-none',
                trailing ? 'pr-10' : 'pr-4', // Make room for the trailing element
                error && 'border-red-500', // Red border when invalid
                className, // Caller can still override anything above
              )}
            />

            {/* Right-side element, e.g. an eye button for passwords */}
            {trailing && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
                {trailing}
              </div>
            )}
          </div>

          {/* Error message from react-hook-form */}
          {error && (
            <span className="text-sm text-red-500">{error.message}</span>
          )}
        </div>
      )}
    </FormattedField>
  )
}
