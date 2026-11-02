import { avatarUrl } from '../../utils/avatars';

/**
 * Right side of the header: stacked collaborator avatars, a divider,
 * and the signed-in user's avatar + name/role.
 */
export function UserMenu() {
  return (
    <div className="flex items-center gap-3">
      {/* Active workspace members (overlapping avatars + "+2" counter) */}
      <div className="hidden sm:flex items-center -space-x-1.5" title="Workspace Members">
        <img className="w-6 h-6 rounded-full border-2 border-white" src={avatarUrl('alex', 64)} alt="Alex" />
        <img className="w-6 h-6 rounded-full border-2 border-white" src={avatarUrl('devin', 64)} alt="Devin" />
        <span className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-mono text-slate-600 font-bold">
          +2
        </span>
      </div>

      {/* Vertical divider */}
      <span className="h-4 w-px bg-slate-200" />

      {/* Current user */}
      <div className="flex items-center gap-2">
        <img className="w-8 h-8 rounded-lg border border-slate-300" src={avatarUrl('neo', 80)} alt="User" />
        <div className="hidden lg:block text-left font-mono">
          <div className="text-xs font-bold text-slate-800 leading-tight">neo_dev</div>
          <div className="text-[10px] text-geek-accent">● Editor</div>
        </div>
      </div>
    </div>
  );
}
