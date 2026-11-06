import { useState } from 'react'
import type { Workspace } from '../../types'
import { useClickOutside } from '../../hooks/useClickOutside'
import { Icon } from '../ui/Icon'

interface WorkspaceSwitcherProps {
  workspaces: Workspace[]
  activeWorkspace: Workspace | null
  onSelect: (workspaceId: string) => void
  onCreate: () => void
  onRename: (workspace: Workspace) => void
  onDelete: (workspace: Workspace) => void
  onLeave: (workspace: Workspace) => void
  isMutating?: boolean
}

/** Dropdown button + menu used to switch between (or create) workspaces. */
export function WorkspaceSwitcher({
  workspaces,
  activeWorkspace,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  onLeave,
  isMutating,
}: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)
  const containerRef = useClickOutside<HTMLDivElement>(close, isOpen)

  const handleSelect = (id: string) => {
    onSelect(id)
    close()
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-60 text-xs font-mono text-slate-800 font-bold transition-all"
      >
        <Icon name="cubes" className="text-geek-secondary" />
        <span className="max-w-40 truncate">
          {activeWorkspace?.label ?? 'No workspace'}
        </span>
        <Icon name="chevron-down" className="text-[10px] text-slate-400" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1 font-mono text-xs"
        >
          <div className="px-2 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Switch Workspace
          </div>

          {workspaces.length === 0 && (
            <p className="px-2 py-3 text-[11px] text-slate-500">
              Belum ada workspace. Buat workspace pertama Anda.
            </p>
          )}

          {workspaces.map((workspace) => {
            const isActive = workspace.id === activeWorkspace?.id
            return (
              <button
                key={workspace.id}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(workspace.id)}
                className={`w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between ${
                  isActive
                    ? 'text-slate-800 bg-slate-50 border border-slate-200 font-semibold'
                    : 'text-slate-700'
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Icon name={workspace.icon} className={workspace.iconClass} />
                  <span className="truncate">{workspace.name}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${workspace.badgeClass}`}>
                  {workspace.badge}
                </span>
              </button>
            )
          })}

          {activeWorkspace && activeWorkspace.relation === 'member' && (
            <div className="border-t border-slate-100 px-1 pt-2">
              <button
                type="button"
                onClick={() => {
                  close()
                  onLeave(activeWorkspace)
                }}
                disabled={isMutating}
                className="w-full rounded-md px-2 py-1.5 text-left text-[11px] font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-40"
              >
                <Icon name="right-from-bracket" className="mr-1.5" /> Leave workspace
              </button>
            </div>
          )}

          {activeWorkspace && activeWorkspace.relation === 'owner' && (
            <div className="flex gap-1 border-t border-slate-100 px-1 pt-2">
              <button
                type="button"
                onClick={() => {
                  close()
                  onRename(activeWorkspace)
                }}
                disabled={isMutating}
                className="flex-1 rounded-md px-2 py-1.5 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                <Icon name="pen" className="mr-1.5" /> Rename
              </button>
              <button
                type="button"
                onClick={() => {
                  close()
                  onDelete(activeWorkspace)
                }}
                disabled={isMutating}
                title="Delete workspace"
                className="flex-1 rounded-md px-2 py-1.5 text-left text-[11px] font-bold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="trash" className="mr-1.5" /> Delete
              </button>
            </div>
          )}

          <div className="border-t border-slate-100 pt-1 mt-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                close()
                onCreate()
              }}
              disabled={isMutating}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-geek-secondary hover:bg-indigo-50 font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Icon name="plus" className="text-xs" /> Create Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
