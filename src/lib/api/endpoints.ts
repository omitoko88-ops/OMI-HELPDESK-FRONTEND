import { api, apiPath, apiUpload } from './client'
import type {
  AdminWorkspacesResponse,
  CreateDocumentInput,
  CurrentUserResponse,
  DocumentDto,
  DocumentListItemDto,
  DocumentShareDto,
  DocumentTreeNode,
  LoginResponse,
  MembersResponse,
  MoveDocumentInput,
  PublicDocumentDto,
  PublicShareResponse,
  UpdateDocumentInput,
  UploadResponse,
  UpsertShareInput,
  UserWorkspacesResponse,
  WorkspaceDto,
  WorkspaceRole,
} from './types'

export const authApi = {
  login: (body: { username: string; password: string }) =>
    api<LoginResponse>('/api/Auth/login', { method: 'POST', body, auth: false }),
  register: (body: {
    username: string
    email: string
    password: string
    confirmPassword: string
  }) =>
    api<{ message: string }>('/api/Auth/register', {
      method: 'POST',
      body,
      auth: false,
    }),
  me: (signal?: AbortSignal) =>
    api<CurrentUserResponse>('/api/Auth/me', { signal }),
}

export const adminApi = {
  workspaces: (signal?: AbortSignal) =>
    api<AdminWorkspacesResponse>('/api/Admin/get-all-workspaces', { signal }),
}

export const workspaceApi = {
  mine: (signal?: AbortSignal) =>
    api<UserWorkspacesResponse>('/api/Workspace/user/workspaces', { signal }),
  get: (id: string, signal?: AbortSignal) =>
    api<WorkspaceDetailResponse>(`/api/Workspace/${id}`, { signal }),
  create: (name: string) =>
    api<WorkspaceDto>('/api/Workspace', { method: 'POST', body: { name } }),
  rename: (id: string, name: string) =>
    api<{ message: string; result: WorkspaceDto }>(`/api/Workspace/${id}`, {
      method: 'PUT',
      body: { name },
    }),
  remove: (id: string) =>
    api<{ message: string }>(`/api/Workspace/${id}`, { method: 'DELETE' }),
}

export const memberApi = {
  list: (workspaceId: string, signal?: AbortSignal) =>
    api<MembersResponse>(`/api/workspaces/${workspaceId}/members`, { signal }),
  add: (workspaceId: string, body: { email: string; role: WorkspaceRole }) =>
    api<MembersResponse['members'][number]>(`/api/workspaces/${workspaceId}/members`, {
      method: 'POST',
      body,
    }),
  changeRole: (workspaceId: string, memberId: string, role: WorkspaceRole) =>
    api<MembersResponse['members'][number]>(
      `/api/workspaces/${workspaceId}/members/${memberId}/role`,
      { method: 'PUT', body: { role } },
    ),
  remove: (workspaceId: string, memberId: string) =>
    api<{ message: string }>(`/api/workspaces/${workspaceId}/members/${memberId}`, {
      method: 'DELETE',
    }),
  leave: (workspaceId: string) =>
    api<{ message: string }>(`/api/workspaces/${workspaceId}/members/me`, {
      method: 'DELETE',
    }),
}

export const documentApi = {
  list: (
    workspaceId: string,
    query?: { search?: string; parentId?: string },
    signal?: AbortSignal,
  ) =>
    api<DocumentListItemDto[]>(
      `/api/workspaces/${workspaceId}/search-documents`,
      { query, signal },
    ),
  tree: (workspaceId: string, signal?: AbortSignal) =>
    api<DocumentTreeNode[]>(`/api/workspaces/${workspaceId}/documents/tree`, {
      signal,
    }),
  get: (documentId: string, signal?: AbortSignal) =>
    api<DocumentDto>(`/api/documents/${documentId}`, { signal }),
  create: (workspaceId: string, body: CreateDocumentInput) =>
    api<DocumentDto>(`/api/workspaces/${workspaceId}/documents`, {
      method: 'POST',
      body,
    }),
  update: (documentId: string, body: UpdateDocumentInput) =>
    api<DocumentDto>(`/api/documents/${documentId}`, { method: 'PUT', body }),
  move: (documentId: string, body: MoveDocumentInput) =>
    api<DocumentListItemDto>(`/api/documents/${documentId}/move`, {
      method: 'PATCH',
      body,
    }),
  remove: (documentId: string) =>
    api<{ message: string; deletedCount: number }>(`/api/documents/${documentId}`, {
      method: 'DELETE',
    }),
}

export const shareApi = {
  get: (documentId: string, signal?: AbortSignal) =>
    api<DocumentShareDto>(`/api/documents/${documentId}/share`, { signal }),
  upsert: (documentId: string, body: UpsertShareInput) =>
    api<DocumentShareDto>(`/api/documents/${documentId}/share`, {
      method: 'PUT',
      body,
    }),
  regenerate: (documentId: string) =>
    api<DocumentShareDto>(`/api/documents/${documentId}/share/regenerate`, {
      method: 'POST',
    }),
  remove: (documentId: string) =>
    api<{ message: string }>(`/api/documents/${documentId}/share`, {
      method: 'DELETE',
    }),
}

export const publicApi = {
  root: (token: string, signal?: AbortSignal) =>
    api<PublicShareResponse>(`/api/public/documents/${token}`, {
      auth: false,
      signal,
    }),
  page: (token: string, documentId: string, signal?: AbortSignal) =>
    api<PublicDocumentDto>(
      `/api/public/documents/${token}/pages/${documentId}`,
      { auth: false, signal },
    ),
  updatePage: (
    token: string,
    documentId: string,
    body: UpdateDocumentInput,
  ) =>
    api<PublicDocumentDto>(
      `/api/public/documents/${token}/pages/${documentId}`,
      { method: 'PUT', body },
    ),
  image: (filename: string) => apiPath(`/api/v1/images/${encodeURIComponent(filename)}`),
  pdf: (filename: string) => apiPath(`/api/v1/pdfs/${encodeURIComponent(filename)}`),
}

export const uploadApi = {
  image: (file: File) => apiUpload<UploadResponse>('/api/v1/upload/image', file),
  pdf: (file: File) => apiUpload<UploadResponse>('/api/v1/upload/pdf', file),
}

// Detail workspace dipakai untuk daftar member/dokumen terbaru di overview.
export interface WorkspaceDetailResponse extends WorkspaceDto {
  members: Array<{
    id: string
    userId: string
    role: WorkspaceRole
    joinedAt: string
  }>
  documents: Array<{
    id: string
    parentId: string | null
    title: string
    content: string | null
  }>
}
