// =====================================================================
// Tipe DTO yang dipakai frontend.
// CATATAN: bentuk persis DTO diambil dari ARCHITECTURE.md. Bila ada field
// yang berbeda di backend Anda, cukup sesuaikan di SINI (satu tempat).
// =====================================================================

export type WorkspaceRole = 'Editor' | 'Viewer'

// Level akses = cerminan enum WorkspaceAccess di backend (None/Read/Write/Owner)
export type WorkspaceAccess = 'none' | 'read' | 'write' | 'owner'

export interface WorkspaceDto {
  id: number
  name: string
  ownerId: number
  createdAt: string
}

export interface MemberUser {
  id: number
  username: string
  email: string
}

export interface WorkspaceMemberDto {
  id: number // memberId (dipakai di PUT/DELETE), BUKAN userId
  userId: number
  username: string
  email: string
  role: WorkspaceRole
  joinedAt: string
}

// GET /api/workspaces/{id}/members -> "Owner + daftar anggota"
export interface MembersResponse {
  owner: MemberUser
  members: WorkspaceMemberDto[]
}

// Item daftar dokumen (tanpa isi)
export interface DocumentListItemDto {
  id: number
  parentId: number | null
  title: string
  updatedAt: string
}

// Node pohon untuk sidebar
export interface DocumentTreeNode {
  id: number
  parentId: number | null
  title: string
  children: DocumentTreeNode[]
}

export interface DocumentDto {
  id: number
  workspaceId: number
  parentId: number | null
  title: string
  content: string
  createdById: number
  createdAt: string
  updatedAt: string
}

export interface CreateDocumentInput {
  title: string
  content?: string
  parentId?: number | null
}

export interface UpdateDocumentInput {
  title: string
  content: string
}

// ---- Share via link ----
export type ShareRole = 'Viewer' | 'Editor'

export interface DocumentShareDto {
  token: string | null // null bila link belum pernah dibuat
  role: ShareRole
  isEnabled: boolean
  expiresAt: string | null
}

export interface UpsertShareInput {
  isEnabled: boolean
  role: ShareRole
  expiresAt: string | null
}

// ---- Publik (via token) ----
// Sengaja tanpa WorkspaceId / CreatedById (lihat ARCHITECTURE.md bagian 9)
export interface PublicDocumentDto {
  id: number
  parentId: number | null
  title: string
  content: string
  updatedAt: string
}

export interface PublicShareResponse {
  document: PublicDocumentDto
  tree: DocumentTreeNode[] // sub-halaman di bawah dokumen yang dibagikan
  role: ShareRole
  canEdit: boolean
}

export interface LoginResponse {
  token: string
}
