import { FaDiceD20 } from 'react-icons/fa6';

interface ShowcaseFooterProps {
  onTrivia: () => void;
}

/** Status server dan tombol trivia di bagian bawah panel kiri. */
export function ShowcaseFooter({ onTrivia }: ShowcaseFooterProps) {
  return (
    <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-300 pt-4 font-mono text-xs">
      <span className="text-slate-600">
        Status: <span className="font-bold text-geek-accent">● ONLINE</span>
      </span>
      <button
        type="button"
        onClick={onTrivia}
        className="flex items-center gap-1 text-[11px] font-semibold text-geek-cyan transition-colors duration-200 hover:text-slate-900 hover:underline"
      >
        <FaDiceD20 /> Nerd Trivia
      </button>
    </div>
  );
}
