import type { Workspace } from '../../types';
import { Brand } from './Brand';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  onSelectWorkspace: (workspaceId: string) => void;
  onCreateWorkspace: () => void;
}

/** Sticky top navigation bar: brand + workspace switcher | search | user area. */
export function Header({ workspaces, activeWorkspace, onSelectWorkspace, onCreateWorkspace }: HeaderProps) {
  return (
    <header className="h-14 border-b border-geek-border bg-white px-4 flex items-center justify-between z-30 sticky top-0 shadow-sm">
      {/* Left: brand + workspace switcher */}
      <div className="flex items-center gap-4">
        <Brand />
        <span className="text-slate-300 font-mono">/</span>
        <WorkspaceSwitcher
          workspaces={workspaces}
          activeWorkspace={activeWorkspace}
          onSelect={onSelectWorkspace}
          onCreate={onCreateWorkspace}
        />
      </div>

      {/* Center: global search */}
      <SearchBar />

      {/* Right: members + current user */}
      <UserMenu />
    </header>
  );
}
