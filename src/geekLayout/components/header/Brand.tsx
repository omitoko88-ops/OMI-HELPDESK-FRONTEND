import { Icon } from '../ui/Icon';

/** Logo badge + product name. The name is hidden on very small screens. */
export function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-geek-accent/15 border border-geek-accent flex items-center justify-center text-geek-accent text-xs">
        <Icon name="code-branch" />
      </div>
      <span className="font-mono font-bold text-sm tracking-tight text-slate-900 hidden sm:inline">
        DevSphere
      </span>
    </div>
  );
}
