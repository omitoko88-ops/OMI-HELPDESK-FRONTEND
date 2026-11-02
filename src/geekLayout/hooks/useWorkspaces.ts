import { useState } from 'react';
import type { Workspace } from '../types';

/**
 * Owns the workspace list + which one is selected.
 * Replaces the original `switchWorkspace()` DOM manipulation.
 */
export function useWorkspaces(initial: Workspace[]) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initial);
  const [activeId, setActiveId] = useState<string>(initial[0].id);

  // Falls back to the first workspace if the id is ever missing.
  const activeWorkspace = workspaces.find((w) => w.id === activeId) ?? workspaces[0];

  const createWorkspace = () => {
    // The original HTML called an undefined `openWorkspaceModal()`.
    // A prompt keeps the demo functional; replace it with a real modal later.
    const name = window.prompt('Enter new workspace name:', 'New Workspace')?.trim();
    if (!name) return;

    const created: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      label: `${name} (Team)`,
      icon: 'cubes',
      iconClass: 'text-geek-secondary',
      badge: '1 member',
      badgeClass: 'bg-slate-100 text-slate-600',
    };
    setWorkspaces((prev) => [...prev, created]);
    setActiveId(created.id);
  };

  return { workspaces, activeWorkspace, selectWorkspace: setActiveId, createWorkspace };
}
