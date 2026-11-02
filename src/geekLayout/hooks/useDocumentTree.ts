import { useState } from 'react';
import type { DocNode } from '../types';

/** Small helper that generates a unique-enough id for client-side demo nodes. */
const newId = (prefix: string): string => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

/**
 * Holds the document tree state and the actions that change it.
 * React re-renders from this state, replacing the original document.createElement /
 * classList.toggle code.
 */
export function useDocumentTree(initial: DocNode[]) {
  const [docs, setDocs] = useState<DocNode[]>(initial);

  /** Expand / collapse a parent's child list. */
  const toggleExpanded = (docId: string) => {
    setDocs((prev) => prev.map((doc) => (doc.id === docId ? { ...doc, expanded: !doc.expanded } : doc)));
  };

  /** Ask for a title, then append a child page under `parentId` and expand it. */
  const addChild = (parentId: string) => {
    const title = window.prompt('Enter child page title (e.g. sub-topic.md):', 'new-sub-page.md');
    if (!title) return;

    const child: DocNode = { id: newId('child'), title, icon: 'file', iconClass: 'text-slate-400' };

    setDocs((prev) =>
      prev.map((doc) =>
        doc.id === parentId ? { ...doc, expanded: true, children: [...(doc.children ?? []), child] } : doc,
      ),
    );
  };

  /** Ask for a title, then append a new root-level document. */
  const addRoot = () => {
    const title = window.prompt('Enter new root document title:', 'new-document.md');
    if (!title) return;

    const root: DocNode = { id: newId('doc'), title, icon: 'file-lines', iconClass: 'text-geek-secondary' };
    setDocs((prev) => [...prev, root]);
  };

  return { docs, toggleExpanded, addChild, addRoot };
}
