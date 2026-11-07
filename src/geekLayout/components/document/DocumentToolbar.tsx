import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import type { DocumentDto, DocumentTreeNode } from '@/lib/api/types'
import { useWorkspaceContext } from '../../context/WorkspaceContext'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useDocumentActions } from '../../hooks/useDocumentQueries'
import { Icon } from '../ui/Icon'

interface DocumentToolbarProps {
  document: DocumentDto
  workspaceName: string
  tree: DocumentTreeNode[]
  canWrite: boolean
  onDeleted?: () => void
}

function findPath(
  nodes: DocumentTreeNode[],
  targetId: string,
  trail: DocumentTreeNode[] = [],
): DocumentTreeNode[] {
  for (const node of nodes) {
    const next = [...trail, node]
    if (node.id === targetId) return next
    const found = findPath(node.children, targetId, next)
    if (found.length > 0) return found
  }
  return []
}

function flatten(nodes: DocumentTreeNode[], depth = 0): Array<DocumentTreeNode & { depth: number }> {
  return nodes.flatMap((node) => [
    { ...node, depth },
    ...flatten(node.children, depth + 1),
  ])
}

function collectDescendantIds(node: DocumentTreeNode, ids = new Set<string>()): Set<string> {
  ids.add(node.id)
  node.children.forEach((child) => collectDescendantIds(child, ids))
  return ids
}

export function DocumentToolbar({
  document,
  workspaceName,
  tree,
  canWrite,
  onDeleted,
}: DocumentToolbarProps) {
  const { openShare } = useWorkspaceContext()
  const [moveOpen, setMoveOpen] = useState(false)
  const moveMenuRef = useClickOutside<HTMLDivElement>(() => setMoveOpen(false), moveOpen)
  const path = findPath(tree, document.id)
  const actions = useDocumentActions(document.id)
  const currentNode = flatten(tree).find((node) => node.id === document.id)
  const blockedIds = currentNode ? collectDescendantIds(currentNode) : new Set([document.id])
  const moveTargets = flatten(tree).filter((node) => !blockedIds.has(node.id))

  const move = async (parentId: string | null) => {
    setMoveOpen(false)
    try {
      await actions.move.mutateAsync(parentId)
      toast.success(parentId ? 'Dokumen dipindahkan.' : 'Dokumen dipindahkan ke root.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal memindahkan dokumen.')
    }
  }

  const remove = async () => {
    if (!window.confirm(`Hapus "${document.title}" beserta seluruh sub-halamannya?`)) return
    try {
      const result = await actions.remove.mutateAsync()
      toast.success(`Dokumen dihapus (${result.deletedCount} termasuk sub-halaman).`)
      onDeleted?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus dokumen.')
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 font-mono text-xs">
      <div className="flex min-w-0 items-center gap-2 overflow-hidden text-slate-500">
        <span className="text-geek-secondary font-bold">{workspaceName}</span>
        {path.map((node) => (
          <span key={node.id} className="flex min-w-0 items-center gap-2">
            <span>/</span>
            <Link to={`/docs/${node.id}`} className="max-w-40 truncate hover:text-geek-secondary">
              {node.title}
            </Link>
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {canWrite && (
          <div className="relative" ref={moveMenuRef}>
            <button
              type="button"
              onClick={() => setMoveOpen((open) => !open)}
              disabled={actions.move.isPending}
              aria-haspopup="menu"
              aria-expanded={moveOpen}
              title="Pindahkan dokumen"
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 font-bold text-slate-800 transition-all hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="folder-tree" className="text-geek-cyan" />
              <span>{actions.move.isPending ? 'Moving...' : 'Move'}</span>
              <Icon
                name="chevron-down"
                className={`text-[9px] text-slate-400 transition-transform ${moveOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {moveOpen && (
              <div
                role="menu"
                aria-label="Move document"
                className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xl"
              >
                <div className="border-b border-slate-200 bg-slate-100 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded border border-geek-cyan bg-geek-cyan/15 text-[9px] text-geek-cyan">
                      <Icon name="folder-tree" />
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-800">
                      // MOVE_DOCUMENT
                    </span>
                  </div>
                  <p className="mt-1 truncate font-mono text-[10px] text-slate-500">
                    {document.title}
                  </p>
                </div>

                <div className="max-h-64 space-y-1 overflow-y-auto p-2">
                  <MoveTarget
                    active={!document.parentId}
                    depth={0}
                    icon="house"
                    label="Workspace root"
                    onSelect={() => void move(null)}
                  />

                  {moveTargets.map((node) => (
                    <MoveTarget
                      key={node.id}
                      active={document.parentId === node.id}
                      depth={node.depth}
                      icon="file-lines"
                      label={node.title}
                      onSelect={() => void move(node.id)}
                    />
                  ))}

                  {moveTargets.length === 0 && (
                    <p className="px-2 py-3 text-center font-mono text-[10px] text-slate-400">
                      Tidak ada lokasi lain yang tersedia.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {canWrite && (
          <button
            type="button"
            onClick={() => openShare(document.id, document.title)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-bold flex items-center gap-1.5 transition-all"
          >
            <Icon name="share-nodes" className="text-geek-cyan" />
            <span>Share</span>
          </button>
        )}

        {canWrite && (
          <button
            type="button"
            onClick={() => void remove()}
            disabled={actions.remove.isPending}
            title="Hapus dokumen"
            className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 font-bold text-rose-600 hover:bg-rose-100 disabled:opacity-50"
          >
            <Icon name="trash" />
          </button>
        )}

        <Link
          to={`/edit/${document.id}`}
          aria-disabled={!canWrite}
          onClick={(event) => {
            if (!canWrite) event.preventDefault()
          }}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all ${
            canWrite
              ? 'bg-geek-secondary text-white hover:bg-indigo-600'
              : 'cursor-not-allowed bg-slate-200 text-slate-400'
          }`}
        >
          <Icon name="pen" className="text-xs" />
          <span>Edit Page</span>
        </Link>
      </div>
    </div>
  )
}

interface MoveTargetProps {
  active: boolean
  depth: number
  icon: string
  label: string
  onSelect: () => void
}

function MoveTarget({ active, depth, icon, label, onSelect }: MoveTargetProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      disabled={active}
      aria-current={active ? 'location' : undefined}
      className={`flex w-full items-center gap-2 rounded-lg py-2 pr-2 text-left font-mono text-[11px] transition-colors ${
        active
          ? 'cursor-default border border-slate-200 bg-slate-50 font-bold text-slate-800'
          : 'border border-transparent text-slate-700 hover:bg-slate-100'
      }`}
      style={{ paddingLeft: `${8 + depth * 14}px` }}
    >
      <Icon
        name={active ? 'location-dot' : icon}
        className={`shrink-0 ${active ? 'text-geek-secondary' : 'text-slate-400'}`}
      />
      <span className="truncate">{label}</span>
      {active && (
        <span className="ml-auto shrink-0 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">
          Current
        </span>
      )}
    </button>
  )
}
