'use client'

import React from 'react'
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form'
import { formatNumber, parseCurrency } from '@/lib/formatter'

/* -------------------------------------------------------------------------- */
/*  HEADLESS component: logic only, NO styling, NO markup                     */
/* -------------------------------------------------------------------------- */

// Props that are safe to spread onto ANY <input> / <textarea> / custom component
export interface FormattedInputProps {
  id: string
  name: string
  value: string | number
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onBlur: () => void
  ref: React.Ref<any> // Lets react-hook-form focus the field on validation error
  maxLength?: number
}

// What the render function (children) receives
interface RenderApi {
  inputProps: FormattedInputProps // Spread these onto your own input
  error?: FieldError // Validation error, read from react-hook-form itself
}

interface FormattedFieldProps<T extends FieldValues> {
  id: Path<T> // Field name in the form
  control: Control<T>
  isNumber?: boolean // Thousand separators
  isNumberWithoutDot?: boolean // Number without separators
  isCurrency?: boolean // Same parsing as isNumber (the "Rp" prefix is now YOUR job in the markup)
  maxLength?: number
  children: (api: RenderApi) => React.ReactNode // Render-prop: you own the design
}

export function FormattedField<T extends FieldValues>({
  id,
  control,
  isNumber = false,
  isNumberWithoutDot = false,
  isCurrency = false,
  maxLength,
  children,
}: FormattedFieldProps<T>) {
  return (
    <Controller
      name={id}
      control={control}
      render={({ field, fieldState }) => {
        const raw = field.value ?? ''

        // What the user SEES: formatted for number modes, raw otherwise
        const display = isNumberWithoutDot
          ? formatNumber(raw, true)
          : isNumber || isCurrency
            ? formatNumber(raw)
            : raw

        // What goes INTO the form: cut by maxLength, parsed for number modes
        const handleChange = (
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
          const text = maxLength
            ? e.target.value.slice(0, maxLength)
            : e.target.value
          field.onChange(isNumber || isCurrency ? parseCurrency(text) : text)
        }

        // Hand everything to the caller; the caller decides the markup
        return (
          <>
            {children({
              inputProps: {
                id,
                name: field.name,
                value: display,
                onChange: handleChange,
                onBlur: field.onBlur,
                ref: field.ref,
                maxLength,
              },
              error: fieldState.error,
            })}
          </>
        )
      }}
    />
  )
}
