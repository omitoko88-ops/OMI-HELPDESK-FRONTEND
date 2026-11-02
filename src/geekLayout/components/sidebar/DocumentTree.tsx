import type { DocNode } from '../../types';
import { DocumentNode } from './DocumentNode';

interface DocumentTreeProps {
  docs: DocNode[];
  activeDocId: string;
  onToggle: (docId: string) => void;
  onShare: (title: string) => void;
  onAddChild: (parentId: string) => void;
}

/** The <nav> that renders every root-level document node. */
export function DocumentTree({ docs, activeDocId, onToggle, onShare, onAddChild }: DocumentTreeProps) {
  return (
    <nav className="space-y-1 font-mono text-xs" aria-label="Documents tree">
      {docs.map((doc) => (
        <DocumentNode
          key={doc.id}
          doc={doc}
          activeDocId={activeDocId}
          onToggle={onToggle}
          onShare={onShare}
          onAddChild={onAddChild}
        />
      ))}
    </nav>
  );
}
