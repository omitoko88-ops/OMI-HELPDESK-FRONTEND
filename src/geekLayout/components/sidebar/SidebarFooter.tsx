import type { WorkspaceAccess } from '../../types'

interface SidebarFooterProps {
  onInvite: () => void
  memberCount: number
  access: WorkspaceAccess
}

/** Bottom info panel of the sidebar: effective access and member shortcut. */
export function SidebarFooter({ onInvite, memberCount, access }: SidebarFooterProps) {
  const canManageMembers = access === 'owner'
  const accessLabel =
    access === 'owner'
      ? 'Owner access'
      : access === 'editor'
        ? 'Editor access'
        : access === 'viewer'
          ? 'Viewer access'
          : 'No access'

  return (
    <div className="p-3 border-t border-geek-border bg-slate-100/60 font-mono text-xs">
      <div className="flex items-center justify-between text-slate-600 mb-2">
        <span>Workspace Members:</span>
        <span className="font-bold text-slate-800">{memberCount} Active</span>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span className="font-bold text-geek-secondary">● {accessLabel}</span>
        {canManageMembers && (
          <button type="button" onClick={onInvite} className="text-geek-secondary hover:underline">
            + Invite
          </button>
        )}
      </div>
    </div>
  )
}
