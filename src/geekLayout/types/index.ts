/**
 * Shared TypeScript types for the whole dashboard.
 * Keeping them in one file makes it easy to see the app's data model at a glance.
 */

/** A workspace the user can switch between (shown in the header dropdown). */
export interface Workspace {
  id: string;
  /** Short name shown inside the dropdown list, e.g. "Quantum Lab". */
  name: string;
  /** Longer label shown on the dropdown button, e.g. "Quantum Lab (Team)". */
  label: string;
  /** FontAwesome icon name without the "fa-" prefix. */
  icon: string;
  /** Tailwind class that colors the icon. */
  iconClass: string;
  /** Pill text on the right, e.g. "4 members". */
  badge: string;
  /** Tailwind classes that color the pill. */
  badgeClass: string;
}

/**
 * A node in the sidebar document tree.
 * - If `children` is defined, the node is a "parent" (collapsible + can add children).
 * - If `children` is undefined, the node is a leaf document.
 */
export interface DocNode {
  id: string;
  title: string;
  icon: string;
  iconClass: string;
  children?: DocNode[];
  /** Only relevant for parents: whether the child list is visible. */
  expanded?: boolean;
}

/** Who can open a document through its share link. */
export type LinkRole = 'viewer' | 'editor' | 'restricted';

/** Role of an individual collaborator inside the workspace. */
export type MemberRole = 'owner' | 'editor' | 'viewer';

/** A person listed in the "Workspace Collaborators Access" section of the modal. */
export interface Collaborator {
  username: string;
  /** Secondary line: an email address or a job title. */
  subtitle: string;
  avatarUrl: string;
  role: MemberRole;
}

/** A link card at the bottom of the document ("Sub-Pages"). */
export interface ChildPage {
  fileName: string;
  description: string;
}

/** One line of the JSON preview in the code block. */
export interface JsonEntry {
  key: string;
  value: string | number;
  /** Controls the syntax-highlight color of the value. */
  kind: 'string' | 'secret' | 'number';
}
