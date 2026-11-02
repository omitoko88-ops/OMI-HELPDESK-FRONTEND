import { useState } from 'react';
import type { Workspace } from '../../types';
import { useClickOutside } from '../../hooks/useClickOutside';
import { Icon } from '../ui/Icon';

interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  onSelect: (workspaceId: string) => void;
  onCreate: () => void;
}

/** Dropdown button + menu used to switch between (or create) workspaces. */
export function WorkspaceSwitcher({ workspaces, activeWorkspace, onSelect, onCreate }: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  // Extra nicety vs. the original: clicking anywhere outside closes the menu.
  const containerRef = useClickOutside<HTMLDivElement>(close, isOpen);

  const handleSelect = (id: string) => {
    onSelect(id);
    close();
  };

  const handleCreate = () => {
    close();
    onCreate();
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-mono text-slate-800 font-bold transition-all"
      >
        <Icon name="cubes" className="text-re"/>
        <span>{activeWorkspace.label}</span>
        <Icon name="chevron-down" className="text-[10px] text-slate-400" />
      </button>

      {/* Dropdown menu (only mounted while open) */}
      {isOpen && (
        <div
          role="menu"
          className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1 font-mono text-xs"
        >
          <div className="px-2 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Switch Workspace
          </div>

          {workspaces.map((workspace) => {
            const isActive = workspace.id === activeWorkspace.id;
            return (
              <button
                key={workspace.id}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(workspace.id)}
                // The currently selected workspace gets a highlighted look.
                className={`w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between ${
                  isActive
                    ? 'text-slate-800 bg-slate-50 border border-slate-200 font-semibold'
                    : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name={workspace.icon} className={workspace.iconClass} />
                  <span>{workspace.name}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${workspace.badgeClass}`}>
                  {workspace.badge}
                </span>
              </button>
            );
          })}

          <div className="border-t border-slate-100 pt-1 mt-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleCreate}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-geek-secondary hover:bg-indigo-50 font-bold flex items-center gap-2"
            >
              <Icon name="plus" className="text-xs" /> Create Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
