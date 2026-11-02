import type { ChildPage, JsonEntry } from '../types';

/** Static content of the document shown in the main panel (would come from an API). */
export const ACTIVE_DOCUMENT = {
  workspaceName: 'Quantum Lab',
  parentTitle: 'API Authorization',
  fileName: 'oauth2-jwt-flow.md',
  title: 'OAuth2 & JWT Verification Flow',
  lastEditedBy: 'devin_arch',
  lastEditedAgo: '2 hours ago',
  version: 'v1.4',
  docId: 'doc_oauth_flow_99',
  role: 'Workspace Editor',
} as const;

/** Example HTTP response rendered in the dark code block. */
export const TOKEN_RESPONSE: JsonEntry[] = [
  { key: 'token_type', value: 'Bearer', kind: 'string' },
  { key: 'access_token', value: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...', kind: 'secret' },
  { key: 'expires_in', value: 3600, kind: 'number' },
  { key: 'workspace_id', value: 'ws_quantum_992', kind: 'string' },
];

/** Child documentation pages linked at the bottom of the document. */
export const CHILD_PAGES: ChildPage[] = [
  { fileName: '01-token-refresh.md', description: 'Handles sliding session validation.' },
  { fileName: '02-revocation-list.md', description: 'Blacklist & Redis cache invalidation.' },
];
