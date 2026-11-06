// =====================================================================
// Tipe DTO frontend, diselaraskan dengan OMI-HELPDESK-API.
// Semua ID adalah HashId (string), bukan angka, dan response API dibuka
// dari envelope { meta, data } oleh lib/api/client.ts.
// =====================================================================

export type WorkspaceRole = 'Editor' | 'Viewer'
export type ShareRole = 'Viewer' | 'Editor'

export interface WorkspaceDto {
  id: string
  name: string
  createdAt: string
}

export interface UserWorkspacesResponse {
  ownedWorkspaces: WorkspaceDto[]
  joinedWorkspaces: WorkspaceDto[]
}

export interface MemberUser {
  id: string
  username: string
  email: string
}

export interface WorkspaceMemberDto {
  id: string
  workspaceId: string
  userId: string
  username: string
  email: string
  role: WorkspaceRole
  joinedAt: string
}

export interface MembersResponse {
  owner: MemberUser
  members: WorkspaceMemberDto[]
}

export interface DocumentListItemDto {
  id: string
  workspaceId: string
  parentId: string | null
  title: string
  createdById: string
  createdAt: string
  updatedAt: string
}

export interface DocumentTreeNode {
  id: string
  parentId: string | null
  title: string
  children: DocumentTreeNode[]
}

export interface DocumentDto extends DocumentListItemDto {
  content: string | null
}

export interface CreateDocumentInput {
  title: string
  content?: string
  parentId?: string | null
}

export interface UpdateDocumentInput {
  title: string
  content: string
}

export interface MoveDocumentInput {
  parentId: string | null
}

export interface DocumentShareDto {
  isEnabled: boolean
  token: string | null
  role: ShareRole
  expiresAt: string | null
}

export interface UpsertShareInput {
  isEnabled: boolean
  role: ShareRole
  expiresAt: string | null
}

export interface PublicDocumentDto {
  id: string
  parentId: string | null
  title: string
  content: string | null
  updatedAt: string
}

export interface PublicShareResponse {
  document: PublicDocumentDto
  tree: DocumentTreeNode
  role: ShareRole
  canEdit: boolean
}

export interface UploadResponse {
  url: string
}

export interface LoginResponse {
  message?: string
  token: string
}

export interface CurrentUserResponse {
  message: string
}
