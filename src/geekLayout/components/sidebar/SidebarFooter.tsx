interface SidebarFooterProps {
  onInvite: () => void;
}

/** Bottom info panel of the sidebar: member count, usage bar, storage and invite link. */
export function SidebarFooter({ onInvite }: SidebarFooterProps) {
  return (
    <div className="p-3 border-t border-geek-border bg-slate-100/60 font-mono text-xs">
      <div className="flex items-center justify-between text-slate-600 mb-1">
        <span>Workspace Members:</span>
        <span className="font-bold text-slate-800">4 Active</span>
      </div>

      {/* Progress bar track + fill (fill width = 2/3) */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div className="bg-geek-accent h-full w-2/3" />
      </div>

      <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
        <span>Storage: 42MB / 1GB</span>
        <button type="button" onClick={onInvite} className="text-geek-secondary hover:underline">
          + Invite
        </button>
      </div>
    </div>
  );
}
