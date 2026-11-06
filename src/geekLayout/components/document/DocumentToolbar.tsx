import { Link } from 'react-router'
import { toast } from 'sonner'
import type { DocumentDto, DocumentTreeNode } from '@/lib/api/types'
import { useDocumentActions } from '../../hooks/useDocumentQueries'
import { Icon } from '../ui/Icon'

interface DocumentToolbarProps {
  document: DocumentDto
  workspaceName: string
  tree: DocumentTreeNode[]
  canWrite: boolean
  onShare: (documentId: string, title: string) => void
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
  onShare,
  onDeleted,
}: DocumentToolbarProps) {
  const path = findPath(tree, document.id)
  const actions = useDocumentActions(document.id)
  const currentNode = flatten(tree).find((node) => node.id === document.id)
  const blockedIds = currentNode ? collectDescendantIds(currentNode) : new Set([document.id])
  const moveTargets = flatten(tree).filter((node) => !blockedIds.has(node.id))

  const move = async (parentId: string | null) => {
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
          <select
            value={document.parentId ?? ''}
            disabled={actions.move.isPending}
            onChange={(event) => void move(event.target.value || null)}
            title="Pindahkan dokumen"
            className="max-w-36 rounded-lg border border-slate-300 bg-slate-100 px-2 py-1.5 text-[11px] font-bold text-slate-700 outline-none"
          >
            <option value="">Move to root</option>
            {moveTargets.map((node) => (
              <option key={node.id} value={node.id}>
                {'—'.repeat(node.depth)} {node.title}
              </option>
            ))}
          </select>
        )}

        {canWrite && (
          <button
            type="button"
            onClick={() => onShare(document.id, document.title)}
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
