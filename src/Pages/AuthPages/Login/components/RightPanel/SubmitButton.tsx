import { FaBolt, FaCheck, FaCircleNotch } from 'react-icons/fa6';
import type { LoginStatus } from '../../types';

interface SubmitButtonProps {
  status: LoginStatus;
}

// Gaya tombol untuk tiap status (ditulis utuh agar terdeteksi Tailwind)
const STATUS_CLASS: Record<LoginStatus, string> = {
  idle: 'bg-slate-900 hover:bg-slate-800 active:scale-[0.99]',
  loading: 'bg-slate-900',
  success: 'bg-geek-accent',
};

/** Tombol submit dengan 3 tampilan: idle, loading, dan sukses. */
export function SubmitButton({ status }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={status !== 'idle'}
      className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 px-4 py-3.5 font-mono text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 ${STATUS_CLASS[status]}`}
    >
      {status === 'idle' && (
        <>
          <FaBolt className="text-geek-accent" />
          <span>EXECUTE AUTHENTICATION</span>
        </>
      )}
      {status === 'loading' && (
        <>
          <FaCircleNotch className="animate-spin text-geek-accent" />
          <span>VERIFYING CREDENTIALS...</span>
        </>
      )}
      {status === 'success' && (
        <>
          <FaCheck />
          <span>ACCESS GRANTED</span>
        </>
      )}
    </button>
  );
}
