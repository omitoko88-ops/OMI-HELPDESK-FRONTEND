import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Ikon di sisi kiri input. */
  icon: ReactNode;
  /** Elemen di sisi kanan input (mis. tombol show/hide password). */
  trailing?: ReactNode;
}

/** Input bergaya terminal dengan ikon kiri dan slot opsional di kanan. */
export function InputField({ icon, trailing, className = '', ...inputProps }: InputFieldProps) {
  return (
    <div className="relative rounded-xl shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
        {icon}
      </div>
      <input
        {...inputProps}
        className={`w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 font-mono text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-geek-accent focus:bg-white focus:ring-1 focus:ring-geek-accent focus:outline-none ${
          trailing ? 'pr-10' : 'pr-4'
        } ${className}`}
      />
      {trailing}
    </div>
  );
}
