import { useEffect, useRef } from 'react';
import { Icon } from '../ui/Icon';

/** Global search input (desktop only). Pressing Cmd/Ctrl+K focuses it. */
export function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  // The original only *advertised* the shortcut; here it actually works.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="hidden md:flex items-center relative w-72">
      <Icon name="magnifying-glass" className="absolute left-3 text-xs text-slate-400" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search docs or press Cmd+K..."
        className="w-full pl-8 pr-12 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-geek-cyan focus:bg-white transition-all"
      />
      <span className="absolute right-2 text-[10px] font-mono text-slate-400 border border-slate-200 rounded px-1 bg-white">
        ⌘K
      </span>
    </div>
  );
}
