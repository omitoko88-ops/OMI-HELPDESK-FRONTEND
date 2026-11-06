import type { DocNode } from '../../types'
import { DocumentNode } from './DocumentNode'

interface DocumentTreeProps {
  docs: DocNode[]
  activeDocId: string
  canWrite?: boolean
  onToggle: (docId: string) => void
  onShare: (documentId: string, title: string) => void
  onAddChild: (parentId: string) => void
}

/** The <nav> that renders every root-level document node. */
export function DocumentTree({ docs, activeDocId, canWrite, onToggle, onShare, onAddChild }: DocumentTreeProps) {
  return (
    <nav className="space-y-1 font-mono text-xs" aria-label="Documents tree">
      {docs.map((doc) => (
        <DocumentNode
          key={doc.id}
          doc={doc}
          activeDocId={activeDocId}
          canWrite={canWrite}
          onToggle={onToggle}
          onShare={onShare}
          onAddChild={onAddChild}
        />
      ))}
    </nav>
  )
}
