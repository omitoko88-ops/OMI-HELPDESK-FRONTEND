import { Link } from 'react-router'
import type { DocNode } from '../../types'
import { Icon } from '../ui/Icon'

interface DocumentNodeProps {
  doc: DocNode
  activeDocId: string
  depth?: number
  canWrite?: boolean
  onToggle: (docId: string) => void
  onShare: (documentId: string, title: string) => void
  onAddChild: (parentId: string) => void
}

const SHARE_BTN = 'p-1 text-slate-400 hover:text-geek-cyan'
const ADD_BTN = 'p-1 text-slate-400 hover:text-geek-accent'

function containsDocument(doc: DocNode, documentId: string): boolean {
  if (doc.id === documentId) return true
  return (doc.children ?? []).some((child) => containsDocument(child, documentId))
}

/** Satu node pohon. Mendukung kedalaman berapa pun dari API. */
export function DocumentNode({
  doc,
  activeDocId,
  depth = 0,
  canWrite = false,
  onToggle,
  onShare,
  onAddChild,
}: DocumentNodeProps) {
  const hasChildren = Boolean(doc.children?.length)
  const isExpanded = doc.expanded ?? false
  const isActive = doc.id === activeDocId
  const containsActive = containsDocument(doc, activeDocId)

  return (
    <div className="doc-node group">
      <div
        className={`flex items-center justify-between rounded-lg p-1.5 transition-colors ${
          isActive
            ? 'border border-indigo-100 bg-indigo-50/70 font-bold text-indigo-900'
            : containsActive
              ? 'border border-slate-200 bg-white text-slate-800 shadow-sm'
              : 'text-slate-700 hover:bg-slate-200/70'
        }`}
        style={{ paddingLeft: `${6 + depth * 12}px` }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => onToggle(doc.id)}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-200"
            >
              <Icon
                name="chevron-down"
                className={`text-[10px] transition-transform ${isExpanded ? '' : '-rotate-90'}`}
              />
            </button>
          ) : (
            <span className="w-4" />
          )}

          <Link
            to={`/docs/${doc.id}`}
            className="flex min-w-0 flex-1 items-center gap-2"
            title={doc.title}
          >
            <Icon name={doc.icon} className={doc.iconClass} />
            <span className="truncate">{doc.title}</span>
          </Link>
        </div>

        <div
          className={`flex items-center gap-1 ${
            isActive || containsActive ? '' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {canWrite && (
            <>
              <button
                type="button"
                onClick={() => onShare(doc.id, doc.title)}
                title="Share Document"
                className={SHARE_BTN}
              >
                <Icon name="share-nodes" />
              </button>
              <button
                type="button"
                onClick={() => onAddChild(doc.id)}
                title="Add Child Document"
                className={ADD_BTN}
              >
                <Icon name="plus" />
              </button>
            </>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {doc.children!.map((child) => (
            <DocumentNode
              key={child.id}
              doc={child}
              activeDocId={activeDocId}
              depth={depth + 1}
              canWrite={canWrite}
              onToggle={onToggle}
              onShare={onShare}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  )
}
