import type { DocNode } from '../../types';
import { Icon } from '../ui/Icon';
import { DocumentTree } from './DocumentTree';
import { SidebarFooter } from './SidebarFooter';

interface SidebarProps {
  docs: DocNode[];
  activeDocId: string;
  onToggle: (docId: string) => void;
  onShare: (title: string) => void;
  onAddChild: (parentId: string) => void;
  onAddRoot: () => void;
  onInvite: () => void;
}

/** Left column: document tree navigation + workspace stats at the bottom. */
export function Sidebar({ docs, activeDocId, onToggle, onShare, onAddChild, onAddRoot, onInvite }: SidebarProps) {
  return (
    <aside className="w-64 sm:w-72 bg-geek-sidebar border-r border-geek-border flex flex-col justify-between shrink-0">
      <div className="p-3 overflow-y-auto space-y-4">
        {/* Section title + "new root document" button */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-bold px-2">
          <span className="uppercase tracking-wider">// DOCUMENTS TREE</span>
          <button
            type="button"
            onClick={onAddRoot}
            title="New Root Document"
            className="text-geek-secondary hover:text-slate-900 transition-colors p-1"
          >
            <Icon name="file-circle-plus" />
          </button>
        </div>

        <DocumentTree
          docs={docs}
          activeDocId={activeDocId}
          onToggle={onToggle}
          onShare={onShare}
          onAddChild={onAddChild}
        />
      </div>

      <SidebarFooter onInvite={onInvite} />
    </aside>
  );
}
