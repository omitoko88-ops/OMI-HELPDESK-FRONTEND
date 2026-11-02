import type { LinkRole } from '../types';

/**
 * Presentation + URL config for each link-sharing level.
 * Using a lookup table (instead of if/else chains) makes adding a new role trivial.
 */
interface LinkRoleConfig {
  /** Text shown inside the <option> of the select. */
  optionLabel: string;
  /** Status text shown in the modal footer. */
  notice: string;
  /** Tailwind color class for the status text. */
  noticeClass: string;
  /** Query string appended to the share URL. */
  query: string;
}

export const LINK_ROLE_CONFIG: Record<LinkRole, LinkRoleConfig> = {
  viewer: {
    optionLabel: 'Viewer (Read Only)',
    notice: '● Anyone with link can VIEW',
    noticeClass: 'text-geek-cyan',
    query: '?role=viewer',
  },
  editor: {
    optionLabel: 'Editor (Can Modify)',
    notice: '● Anyone with link can EDIT',
    noticeClass: 'text-emerald-600',
    query: '?role=editor',
  },
  restricted: {
    optionLabel: 'Restricted (Members Only)',
    notice: '● Only invited members can access',
    noticeClass: 'text-slate-500',
    query: '?access=private',
  },
};

/** Display order of the options in the select. */
export const LINK_ROLE_ORDER: LinkRole[] = ['viewer', 'editor', 'restricted'];

// The original mock-up always shared this one document, regardless of which
// tree item was clicked. Swap this for the real document id when wiring a backend.
const SHARE_BASE_URL = 'https://devdocs.io/s/quantum-lab/doc_oauth_flow_99';

export const buildShareUrl = (role: LinkRole): string =>
  `${SHARE_BASE_URL}${LINK_ROLE_CONFIG[role].query}`;
