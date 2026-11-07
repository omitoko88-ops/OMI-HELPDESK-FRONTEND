# Checklist Integrasi OMI-HELPDESK → OMI-HELPDESK-API

Dokumen ini memetakan seluruh controller/action di `OMI-HELPDESK-API` ke implementasi frontend di `OMI-HELPDESK`.

Status:

- [x] Terintegrasi dan dipakai UI
- [~] Terintegrasi tetapi UI/optimalisasi masih perlu ditinjau
- [ ] Belum diintegrasikan / sengaja belum diekspos

## Ringkasan Arsitektur Frontend

| Layer | Lokasi | Fungsi |
|---|---|---|
| API client | `src/lib/api/client.ts` | JWT, envelope `{ meta, data }`, error validasi, helper URL aset |
| Endpoint registry | `src/lib/api/endpoints.ts` | Wrapper semua controller API |
| DTO | `src/lib/api/types.ts` | Tipe response sesuai kontrak backend |
| Workspace context | `src/geekLayout/context/WorkspaceContext.tsx` | Komposisi workspace, member, dokumen, share, session |
| Form hooks | `src/geekLayout/hooks/useWorkspaceForm.ts`, `useDocumentForm.ts`, `useMemberForm.ts`, `useShareForm.ts` | `useForm` + `zodResolver`, mengikuti pola Login/Register |
| Schema | `src/schemas/WorkspaceSchema.ts` | Validasi form yang selaras dengan DTO backend |
| UI layout | `src/geekLayout/GeekLayout.tsx` | Menyediakan context untuk seluruh route workspace |
| Route guard | `src/App.tsx` + `src/contexts/AuthProvider.tsx` | Route workspace berada di dalam guard autentikasi |

## Auth

| Action | Endpoint | Status | Lokasi Frontend | Catatan |
|---|---|---|---|---|
| `AuthController.Login` | `POST /api/Auth/login` | [x] | `src/lib/api/endpoints.ts` (`authApi.login`), `src/Pages/AuthPages/Login/hooks/Api/useLoginApi.ts` | Halaman Login |
| `AuthController.Register` | `POST /api/Auth/register` | [x] | `src/lib/api/endpoints.ts` (`authApi.register`), `src/Pages/AuthPages/Register/hooks/Api/useRegisterApi.ts` | Halaman Register; body `confirmPassword` |
| `AuthController.GetMyData` | `GET /api/Auth/me` | [x] | `src/geekLayout/context/WorkspaceContext.tsx` (`session`) | Validasi sesi saat layout workspace dibuka |

## Workspace

| Action | Endpoint | Status | Lokasi Frontend | Catatan |
|---|---|---|---|---|
| `WorkspaceController.GetUserWorkspaces` | `GET /api/Workspace/user/workspaces` | [x] | `src/geekLayout/hooks/useWorkspaces.ts` (`workspaceState`) | Dropdown workspace di `WorkspaceSwitcher` |
| `WorkspaceController.GetWorkspaceById` | `GET /api/Workspace/{id}` | [x] | `src/geekLayout/hooks/useWorkspaces.ts` (`detail`) | Exposed sebagai `workspaceDetail` di context |
| `WorkspaceController.CreateWorkspace` | `POST /api/Workspace` | [x] | `src/geekLayout/GeekLayout.tsx` + `src/geekLayout/hooks/useWorkspaceForm.ts` | Dialog create workspace dengan Zod |
| `WorkspaceController.UpdateWorkspace` | `PUT /api/Workspace/{id}` | [x] | `src/geekLayout/GeekLayout.tsx` + `useWorkspaceForm` mode `rename` | Dropdown → Rename |
| `WorkspaceController.DeleteWorkspace` | `DELETE /api/Workspace/{id}` | [x] | `src/geekLayout/GeekLayout.tsx` (`ConfirmDialog`) | Dropdown → Delete |

## WorkspaceMember

| Action | Endpoint | Status | Lokasi Frontend | Catatan |
|---|---|---|---|---|
| `WorkspaceMemberController.GetMembers` | `GET /api/workspaces/{workspaceId}/members` | [x] | `src/geekLayout/hooks/useWorkspaceAccess.ts` | Sumber role, owner, member, dan access level |
| `WorkspaceMemberController.AddMember` | `POST /api/workspaces/{workspaceId}/members` | [x] | `src/geekLayout/components/share/CollaboratorList.tsx` + `useMemberForm` | Halaman Members dan Share modal |
| `WorkspaceMemberController.UpdateMemberRole` | `PUT /api/workspaces/{workspaceId}/members/{memberId}/role` | [x] | `src/geekLayout/components/share/CollaboratorList.tsx` | Hanya owner |
| `WorkspaceMemberController.RemoveMember` | `DELETE /api/workspaces/{workspaceId}/members/{memberId}` | [x] | `src/geekLayout/components/share/CollaboratorList.tsx` | Hanya owner |
| `WorkspaceMemberController.LeaveWorkspace` | `DELETE /api/workspaces/{workspaceId}/members/me` | [x] | `src/geekLayout/hooks/useWorkspaces.ts` (`leaveWorkspace`), `src/geekLayout/GeekLayout.tsx` | Dropdown Leave untuk workspace `member` |

## Document

| Action | Endpoint | Status | Lokasi Frontend | Catatan |
|---|---|---|---|---|
| `DocumentController.GetDocuments` | `GET /api/workspaces/{workspaceId}/search-documents` | [x] | `src/geekLayout/hooks/useDocumentQueries.ts` (`useWorkspaceDocuments`) | Overview, Documentation list, dan SearchBar |
| `DocumentController.GetDocumentTree` | `GET /api/workspaces/{workspaceId}/documents/tree` | [x] | `src/geekLayout/hooks/useDocumentTree.ts` | Sidebar pohon dokumen |
| `DocumentController.GetDocumentById` | `GET /api/documents/{id}` | [x] | `src/geekLayout/hooks/useDocumentQueries.ts` (`useDocument`) | Preview, editor, dan toolbar |
| `DocumentController.CreateDocument` | `POST /api/workspaces/{workspaceId}/documents` | [x] | `src/geekLayout/GeekLayout.tsx`, `src/Pages/Dashboard/pages/Home.tsx`, `useCreateDocumentForm` | Root dan sub-page |
| `DocumentController.UpdateDocument` | `PUT /api/documents/{id}` | [x] | `src/Pages/DocEditor.tsx` + `useUpdateDocumentForm` | Simpan editor dengan Zod |
| `DocumentController.MoveDocument` | `PATCH /api/documents/{id}/move` | [x] | `src/geekLayout/components/document/DocumentToolbar.tsx` | Move ke root/parent, mencegah pindah ke descendant |
| `DocumentController.DeleteDocument` | `DELETE /api/documents/{id}` | [x] | `src/geekLayout/components/document/DocumentToolbar.tsx` | Menghapus dokumen + descendant |

## DocumentShare

| Action | Endpoint | Status | Lokasi Frontend | Catatan |
|---|---|---|---|---|
| `DocumentShareController.GetShare` | `GET /api/documents/{documentId}/share` | [x] | `src/geekLayout/hooks/useDocumentQueries.ts` (`useDocumentShare`), `WorkspaceContext` | Dimuat saat Share modal dibuka |
| `DocumentShareController.UpsertShare` | `PUT /api/documents/{documentId}/share` | [x] | `src/geekLayout/components/share/LinkAccessPanel.tsx` + `useShareForm` | Toggle enabled, role, expiry |
| `DocumentShareController.RegenerateToken` | `POST /api/documents/{documentId}/share/regenerate` | [x] | `src/geekLayout/components/share/LinkAccessPanel.tsx` | Konfirmasi sebelum token diganti |
| `DocumentShareController.DeleteShare` | `DELETE /api/documents/{documentId}/share` | [x] | `src/geekLayout/components/share/LinkAccessPanel.tsx` | Konfirmasi sebelum hapus |

## PublicDocument

| Action | Endpoint | Status | Lokasi Frontend | Catatan |
|---|---|---|---|---|
| `PublicDocumentController.GetSharedDocument` | `GET /api/public/documents/{token}` | [x] | `src/geekLayout/hooks/useDocumentQueries.ts` (`usePublicShare`), `src/geekLayout/pages/PublicDocumentPage.tsx` | Route `/share/:token`, tanpa login |
| `PublicDocumentController.GetSharedPage` | `GET /api/public/documents/{token}/pages/{documentId}` | [x] | `usePublicPage`, `PublicDocumentPage.tsx` | Navigasi sub-halaman |
| `PublicDocumentController.UpdateSharedPage` | `PUT /api/public/documents/{token}/pages/{documentId}` | [x] | `useUpdatePublicPage` + `usePublicDocumentForm` | Wajib login; hanya link role Editor |

## Upload

| Action | Endpoint | Status | Lokasi Frontend | Catatan |
|---|---|---|---|---|
| `UploadController.UploadImage` | `POST /api/v1/upload/image` | [x] | `src/lib/api/endpoints.ts` (`uploadApi.image`), `src/lib/uploadPdf.ts`, `src/Pages/DocEditor/Extentions/extensions.ts` | Dipakai blok gambar Tiptap |
| `UploadController.UploadPdf` | `POST /api/v1/upload/pdf` | [x] | `uploadApi.pdf`, `uploadPdf.ts`, `extensions.ts` | Dipakai blok PDF Tiptap |
| `UploadController.ShowImage` | `GET /api/v1/images/{filename}` | [x] | `src/lib/api/endpoints.ts` (`publicApi.image`), `apiPath` di `src/lib/api/client.ts` | URL dari upload dinormalisasi ke base API |
| `UploadController.ShowPdf` | `GET /api/v1/pdfs/{filename}` | [x] | `publicApi.pdf`, `apiPath` | URL dari upload dinormalisasi ke base API |

## Admin

| Action | Endpoint | Status | Lokasi Frontend | Catatan |
|---|---|---|---|---|
| `AdminController.GetAllWorkspaces` | `GET /api/Admin/get-all-workspaces` | [~] | `src/geekLayout/hooks/useAdminWorkspaces.ts`, `src/geekLayout/pages/AdminWorkspacesPage.tsx` | Route `/admin/workspaces`; link disembunyikan kecuali `VITE_ENABLE_ADMIN_VIEW=true` |

> **Risiko keamanan:** `AdminController` masih mengomentari `[Authorize(Roles = "Admin")]` di backend. Endpoint mengembalikan seluruh workspace dan saat ini hanya bergantung pada autentikasi (atau bahkan bisa tanpa guard role). Jangan mengaktifkan tampilan admin di produksi sebelum guard backend diperbaiki.

## Helper Non-Endpoint

File berikut adalah helper privat dan tidak perlu dipanggil langsung dari frontend:

- `Controllers/Document/Actions/DocumentController.Helpers.cs`
- `Controllers/DocumentShare/Actions/DocumentShareController.Helpers.cs`
- `Controllers/PublicDocument/Actions/PublicDocumentController.Helpers.cs`
- `Controllers/WorkspaceMember/Actions/WorkspaceMemberController.Helpers.cs`

## Catatan Deployment

- `.env.production` masih kosong. Isi `VITE_API_URL` dengan origin API produksi.
- Endpoint upload mengembalikan URL absolut. Frontend menerima URL absolut maupun path relatif melalui `apiPath`.
- Route publik `/share/:token` sengaja berada di luar `AuthProvider`; route workspace berada di dalam guard login.
- `Admin` belum memiliki role claim di JWT, sehingga UI tidak dapat menentukan admin dari token saat ini.
- Endpoint admin tetap dapat dipanggil dengan token user biasa karena tidak ada fallback policy/role guard; hanya endpoint lain yang memakai `[Authorize]` yang terlindungi.

## Verifikasi

- `npx tsc -b --pretty false` — lolos
- `npx eslint` pada file integrasi — 0 error (1 warning fast-refresh pada provider context)
- `npm run build` — lolos
- Belum dilakukan E2E terhadap API + database MySQL yang berjalan.
