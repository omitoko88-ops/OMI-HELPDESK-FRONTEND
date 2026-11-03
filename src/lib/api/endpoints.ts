import { api } from './client'
import type {
  CreateDocumentInput,
  DocumentDto,
  DocumentListItemDto,
  DocumentShareDto,
  DocumentTreeNode,
  LoginResponse,
  MembersResponse,
  PublicDocumentDto,
  PublicShareResponse,
  UpdateDocumentInput,
  UpsertShareInput,
  WorkspaceDto,
  WorkspaceRole,
} from './types'

// Semua URL di bawah mengikuti tabel "Daftar Endpoint" di ARCHITECTURE.md bagian 8.

export const authApi = {
  // ASUMSI: sesuaikan path/body dengan AuthController Anda
  login: (body: { username: string; password: string }) =>
    api<LoginResponse>('/api/auth/login', { method: 'POST', body, auth: false }),
}

export const workspaceApi = {
  mine: (signal?: AbortSignal) => api<WorkspaceDto[]>('/api/workspace/me', { signal }),
  get: (id: number, signal?: AbortSignal) => api<WorkspaceDto>(`/api/workspace/${id}`, { signal }),
  create: (name: string) => api<WorkspaceDto>('/api/workspace', { method: 'POST', body: { name } }),
  rename: (id: number, name: string) => api<WorkspaceDto>(`/api/workspace/${id}`, { method: 'PUT', body: { name } }),
  remove: (id: number) => api<void>(`/api/workspace/${id}`, { method: 'DELETE' }),
}

export const memberApi = {
  list: (wid: number, signal?: AbortSignal) =>
    api<MembersResponse>(`/api/workspaces/${wid}/members`, { signal }),
  add: (wid: number, body: { email: string; role: WorkspaceRole }) =>
    api<void>(`/api/workspaces/${wid}/members`, { method: 'POST', body }),
  changeRole: (wid: number, memberId: number, role: WorkspaceRole) =>
    api<void>(`/api/workspaces/${wid}/members/${memberId}/role`, { method: 'PUT', body: { role } }),
  remove: (wid: number, memberId: number) =>
    api<void>(`/api/workspaces/${wid}/members/${memberId}`, { method: 'DELETE' }),
  leave: (wid: number) => api<void>(`/api/workspaces/${wid}/members/me`, { method: 'DELETE' }),
}

export const documentApi = {
  // Daftar tanpa isi; mendukung search dan parentId
  list: (wid: number, q?: { search?: string; parentId?: number }, signal?: AbortSignal) =>
    api<DocumentListItemDto[]>(`/api/workspaces/${wid}/documents`, { query: q, signal }),
  tree: (wid: number, signal?: AbortSignal) =>
    api<DocumentTreeNode[]>(`/api/workspaces/${wid}/documents/tree`, { signal }),
  get: (id: number, signal?: AbortSignal) => api<DocumentDto>(`/api/documents/${id}`, { signal }),
  create: (wid: number, body: CreateDocumentInput) =>
    api<DocumentDto>(`/api/workspaces/${wid}/documents`, { method: 'POST', body }),
  update: (id: number, body: UpdateDocumentInput) =>
    api<DocumentDto>(`/api/documents/${id}`, { method: 'PUT', body }),
  // parentId null = jadikan halaman utama. Backend menolak siklus (409/400)
  move: (id: number, parentId: number | null) =>
    api<void>(`/api/documents/${id}/move`, { method: 'PATCH', body: { parentId } }),
  remove: (id: number) => api<void>(`/api/documents/${id}`, { method: 'DELETE' }),
}

export const shareApi = {
  get: (docId: number, signal?: AbortSignal) =>
    api<DocumentShareDto>(`/api/documents/${docId}/share`, { signal }),
  upsert: (docId: number, body: UpsertShareInput) =>
    api<DocumentShareDto>(`/api/documents/${docId}/share`, { method: 'PUT', body }),
  regenerate: (docId: number) =>
    api<DocumentShareDto>(`/api/documents/${docId}/share/regenerate`, { method: 'POST' }),
  remove: (docId: number) => api<void>(`/api/documents/${docId}/share`, { method: 'DELETE' }),
}

// Endpoint publik: GET tanpa Authorization; PUT wajib JWT (link Editor)
export const publicApi = {
  root: (token: string, signal?: AbortSignal) =>
    api<PublicShareResponse>(`/api/public/documents/${token}`, { auth: false, signal }),
  page: (token: string, id: number, signal?: AbortSignal) =>
    api<PublicDocumentDto>(`/api/public/documents/${token}/pages/${id}`, { auth: false, signal }),
  updatePage: (token: string, id: number, body: UpdateDocumentInput) =>
    api<PublicDocumentDto>(`/api/public/documents/${token}/pages/${id}`, { method: 'PUT', body }),
}
