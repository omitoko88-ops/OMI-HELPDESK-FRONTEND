/**
 * Model tampilan yang dipakai lintas komponen dashboard.
 * Data aslinya berasal dari DTO API (HashId string).
 */

/** A workspace the user can switch between (shown in the header dropdown). */
export interface Workspace {
  id: string
  name: string
  label: string
  icon: string
  iconClass: string
  badge: string
  badgeClass: string
  /** owner = dibuat oleh user, member = workspace yang diikuti. */
  relation: 'owner' | 'member'
}

/** A node in the sidebar document tree. */
export interface DocNode {
  id: string
  parentId: string | null
  title: string
  icon: string
  iconClass: string
  updatedAt?: string
  children?: DocNode[]
  expanded?: boolean
}

/** Dokumen yang sedang dipilih untuk modal share/editor. */
export interface ShareTarget {
  id: string
  title: string
}

export type { ShareRole } from '@/lib/api/types'
export type WorkspaceRole = 'Editor' | 'Viewer'
export type MemberRole = 'owner' | 'editor' | 'viewer'

/** Keanggotaan efektif user pada workspace aktif. */
export type WorkspaceAccess = 'owner' | 'editor' | 'viewer' | 'none'

export interface Collaborator {
  id: string
  userId: string
  username: string
  email: string
  role: MemberRole
  joinedAt?: string
}

export interface ChildPage {
  fileName: string
  description: string
}

export interface JsonEntry {
  key: string
  value: string | number
  kind: 'string' | 'secret' | 'number'
}
