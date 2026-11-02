import type { DocNode } from '../types';

/** Id of the document currently open in the main panel. */
export const ACTIVE_DOC_ID = 'child-3';

/** Initial contents of the sidebar document tree. */
export const INITIAL_DOCS: DocNode[] = [
  {
    id: 'doc-1',
    title: 'Architecture Spec',
    icon: 'book',
    iconClass: 'text-geek-secondary',
    expanded: true,
    children: [
      { id: 'child-1', title: '01-system-overview.md', icon: 'file-code', iconClass: 'text-slate-400' },
      { id: 'child-2', title: '02-database-schema.md', icon: 'database', iconClass: 'text-slate-400' },
    ],
  },
  {
    id: 'doc-2',
    title: 'API Authorization',
    icon: 'lock',
    iconClass: 'text-geek-accent',
    expanded: true,
    children: [
      { id: 'child-3', title: 'oauth2-jwt-flow.md', icon: 'key', iconClass: 'text-geek-secondary' },
      { id: 'child-4', title: 'rbac-permission-matrix.md', icon: 'shield-halved', iconClass: 'text-slate-400' },
    ],
  },
  // No `children` => rendered as a simple leaf document.
  { id: 'doc-3', title: 'cli-tooling-guide.md', icon: 'terminal', iconClass: 'text-geek-cyan' },
];
