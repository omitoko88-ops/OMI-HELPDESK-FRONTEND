import { NavLink } from 'react-router'
import type { DocNode, Workspace, WorkspaceAccess } from '../../types'
import { Icon } from '../ui/Icon'
import { DocumentTree } from './DocumentTree'
import { SidebarFooter } from './SidebarFooter'

interface SidebarProps {
  workspace: Workspace | null
  access: WorkspaceAccess
  docs: DocNode[]
  activeDocId: string
  loading?: boolean
  onToggle: (docId: string) => void
  onShare: (documentId: string, title: string) => void
  onAddChild: (parentId: string) => void
  onAddRoot: () => void
  onInvite: () => void
  memberCount: number
  showAdminLink?: boolean
}

/** Left column: workspace navigation, document tree, and member summary. */
export function Sidebar({
  workspace,
  access,
  docs,
  activeDocId,
  loading,
  onToggle,
  onShare,
  onAddChild,
  onAddRoot,
  onInvite,
  memberCount,
  showAdminLink = false,
}: SidebarProps) {
  const canWrite = access === 'owner' || access === 'editor'
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-lg px-2 py-1.5 font-bold transition-colors ${
      isActive
        ? 'bg-white text-geek-secondary shadow-sm border border-slate-200'
        : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 border border-transparent'
    }`

  return (
    <aside className="w-64 sm:w-72 bg-geek-sidebar border-r border-geek-border flex flex-col justify-between shrink-0">
      <div className="p-3 overflow-y-auto space-y-4">
        <nav className="space-y-1 font-mono text-xs" aria-label="Workspace navigation">
          <NavLink to="/" end className={navLinkClass}>
            <Icon name="gauge-high" className="w-3.5 text-center" />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/docs" className={navLinkClass}>
            <Icon name="book-open" className="w-3.5 text-center" />
            <span>Documentation</span>
          </NavLink>
          <NavLink to="/members" className={navLinkClass}>
            <Icon name="users" className="w-3.5 text-center" />
            <span>Members</span>
          </NavLink>
          <NavLink
            to={activeDocId ? `/edit/${activeDocId}` : '/edit'}
            className={navLinkClass}
          >
            <Icon name="pen-to-square" className="w-3.5 text-center" />
            <span>Editor</span>
          </NavLink>
          {showAdminLink && (
            <NavLink to="/admin/workspaces" className={navLinkClass}>
              <Icon name="shield-halved" className="w-3.5 text-center" />
              <span>Admin</span>
            </NavLink>
          )}
        </nav>

        <div className="border-t border-slate-200" />

        <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-bold px-2">
          <span className="uppercase tracking-wider">// DOCUMENTS TREE</span>
          <button
            type="button"
            onClick={onAddRoot}
            disabled={!workspace || !canWrite}
            title={canWrite ? 'New Root Document' : 'Anda hanya punya akses baca'}
            className="text-geek-secondary hover:text-slate-900 transition-colors p-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="file-circle-plus" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-2 px-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-6 animate-pulse rounded bg-slate-200" />
            ))}
          </div>
        ) : docs.length === 0 ? (
          <p className="px-2 text-[11px] leading-relaxed text-slate-500">
            {workspace
              ? 'Belum ada dokumen. Gunakan tombol + untuk membuat halaman pertama.'
              : 'Pilih atau buat workspace terlebih dahulu.'}
          </p>
        ) : (
          <DocumentTree
            docs={docs}
            activeDocId={activeDocId}
            canWrite={canWrite}
            onToggle={onToggle}
            onShare={onShare}
            onAddChild={onAddChild}
          />
        )}
      </div>

      <SidebarFooter
        onInvite={onInvite}
        memberCount={memberCount}
        access={access}
      />
    </aside>
  )
}
