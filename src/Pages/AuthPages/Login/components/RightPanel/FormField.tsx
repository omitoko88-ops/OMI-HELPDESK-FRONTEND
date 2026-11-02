import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  /** Elemen di sisi kanan label (mis. badge "[Required]" atau link "Forgot"). */
  aside?: ReactNode;
  children: ReactNode;
}

/** Pembungkus field: label di atas, input di bawah. */
export function FormField({ label, htmlFor, aside, children }: FormFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="font-mono text-xs font-bold tracking-wider text-slate-600 uppercase"
        >
          {label}
        </label>
        {aside}
      </div>
      {children}
    </div>
  );
}
