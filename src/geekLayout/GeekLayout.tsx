import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShareModal } from './components/share/ShareModal'
import { Sidebar } from './components/sidebar/Sidebar'
import { Header } from './components/header/Header'
import { ConfirmDialog } from './components/common/ConfirmDialog'
import { FormDialog } from './components/common/FormDialog'
import { WorkspaceContextProvider, useWorkspaceContext } from './context/WorkspaceContext'
import { useCreateDocumentForm } from './hooks/useDocumentForm'
import { useWorkspaceForm } from './hooks/useWorkspaceForm'
import type { DocNode, Workspace } from './types'

type DialogState =
  | { type: 'create' }
  | { type: 'rename'; workspace: Workspace }
  | { type: 'delete'; workspace: Workspace }
  | { type: 'createDocument'; parentId: string | null; parentTitle: string }
  | null

export default function GeekLayout() {
  return (
    <WorkspaceContextProvider>
      <GeekLayoutContent />
    </WorkspaceContextProvider>
  )
}

function GeekLayoutContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { documentId: routeDocumentId } = useParams<{ documentId: string }>()
  const workspace = useWorkspaceContext()
  const { activeWorkspace, docs, accessLevel } = workspace
  const [dialog, setDialog] = useState<DialogState>(null)

  const activeDocId = useMemo(() => {
    if (routeDocumentId) return routeDocumentId
    const match = location.pathname.match(/^\/(?:docs|edit)\/([^/]+)/)
    if (match) return match[1]
    const first = docs[0]
    if (!first) return ''
    return first.children?.[0]?.id ?? first.id
  }, [docs, location.pathname, routeDocumentId])

  const closeDialog = () => setDialog(null)

  const workspaceForm = useWorkspaceForm({
    mode: dialog?.type === 'rename' ? 'rename' : 'create',
    workspace: dialog?.type === 'rename' ? dialog.workspace : null,
    isPending: workspace.workspaceState.isMutating,
    onOpenChange: (open) => !open && closeDialog(),
    onSubmit: async ({ name }) => {
      if (dialog?.type === 'rename') {
        await workspace.workspaceState.renameWorkspace({ id: dialog.workspace.id, name })
        toast.success('Workspace diperbarui.')
      } else {
        await workspace.workspaceState.createWorkspace(name)
        toast.success('Workspace dibuat.')
      }
      closeDialog()
      navigate('/')
    },
  })

  const documentForm = useCreateDocumentForm({
    isPending: workspace.tree.isMutating,
    onSubmit: async ({ title }) => {
      if (dialog?.type !== 'createDocument') return
      const created = dialog.parentId
        ? await workspace.tree.addChild(dialog.parentId, title)
        : await workspace.tree.addRoot(title)
      toast.success(dialog.parentId ? 'Sub-halaman dibuat.' : 'Dokumen dibuat.')
      closeDialog()
      navigate(`/edit/${created.id}`)
    },
  })

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header
        workspaces={workspace.workspaces}
        activeWorkspace={activeWorkspace}
        docs={docs}
        memberCount={workspace.members.length}
        accessLabel={accessLevel === 'none' ? 'No access' : accessLevel}
        onSelectWorkspace={(id) => {
          workspace.selectWorkspace(id)
          navigate('/')
        }}
        onCreateWorkspace={() => setDialog({ type: 'create' })}
        onRenameWorkspace={(selected) => setDialog({ type: 'rename', workspace: selected })}
        onDeleteWorkspace={(selected) => setDialog({ type: 'delete', workspace: selected })}
        onLeaveWorkspace={async (selected) => {
          if (!window.confirm(`Keluar dari workspace "${selected.name}"?`)) return
          try {
            await workspace.workspaceState.leaveWorkspace(selected.id)
            toast.success('Anda telah keluar dari workspace.')
            navigate('/')
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal keluar dari workspace.')
          }
        }}
        isMutating={workspace.workspaceState.isMutating}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          workspace={activeWorkspace}
          access={accessLevel}
          docs={docs}
          activeDocId={activeDocId}
          loading={workspace.tree.isLoading || workspace.workspaceState.isLoading}
          onToggle={workspace.tree.toggleExpanded}
          onShare={workspace.openShare}
          onAddChild={(parentId) => {
            const parent = findDoc(docs, parentId)
            setDialog({ type: 'createDocument', parentId, parentTitle: parent?.title ?? 'dokumen ini' })
          }}
          onAddRoot={() => {
            if (!activeWorkspace) {
              toast.error('Buat atau pilih workspace terlebih dahulu.')
              return
            }
            setDialog({ type: 'createDocument', parentId: null, parentTitle: activeWorkspace.name })
          }}
          onInvite={() => navigate('/members')}
          memberCount={workspace.members.length}
          showAdminLink={workspace.adminViewEnabled}
        />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet context={workspace} />
        </main>
      </div>

      <ShareModal
        isOpen={workspace.shareModal.isOpen}
        documentId={workspace.shareModal.target.id}
        docTitle={workspace.shareModal.target.title}
        onClose={workspace.shareModal.close}
      />

      <FormDialog
        open={dialog?.type === 'create' || dialog?.type === 'rename'}
        title={dialog?.type === 'rename' ? 'Rename workspace' : 'Create workspace'}
        description={
          dialog?.type === 'rename'
            ? 'Ubah nama workspace yang sedang aktif.'
            : 'Workspace baru akan otomatis menempatkan Anda sebagai owner.'
        }
        confirmText={dialog?.type === 'rename' ? 'Simpan' : 'Buat'}
        isPending={workspaceForm.isPending}
        submitDisabled={!workspaceForm.form.formState.isValid}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={() => void workspaceForm.submit()}
      >
        <div className="space-y-2">
          <Label htmlFor="workspace-name">Nama workspace</Label>
          <Input
            id="workspace-name"
            placeholder="Contoh: Engineering Docs"
            autoFocus
            {...workspaceForm.form.register('name')}
          />
          {workspaceForm.form.formState.errors.name && (
            <p className="text-xs text-rose-600">
              {workspaceForm.form.formState.errors.name.message}
            </p>
          )}
        </div>
      </FormDialog>

      <FormDialog
        open={dialog?.type === 'createDocument'}
        title={dialog?.type === 'createDocument' && dialog.parentId ? 'New sub-page' : 'New document'}
        description={
          dialog?.type === 'createDocument' && dialog.parentId
            ? `Sub-halaman baru di bawah "${dialog.parentTitle}".`
            : 'Dokumen baru akan dibuat di root workspace aktif.'
        }
        confirmText="Buat dokumen"
        isPending={documentForm.isPending}
        submitDisabled={!documentForm.form.formState.isValid}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={() => void documentForm.submit()}
      >
        <div className="space-y-2">
          <Label htmlFor="document-title">Judul dokumen</Label>
          <Input
            id="document-title"
            placeholder="Contoh: Panduan onboarding"
            autoFocus
            {...documentForm.form.register('title')}
          />
          {documentForm.form.formState.errors.title && (
            <p className="text-xs text-rose-600">
              {documentForm.form.formState.errors.title.message}
            </p>
          )}
        </div>
      </FormDialog>

      <ConfirmDialog
        open={dialog?.type === 'delete'}
        title="Hapus workspace?"
        description={
          dialog?.type === 'delete'
            ? `Workspace "${dialog.workspace.name}" beserta dokumen dan anggota di dalamnya akan dihapus permanen.`
            : ''
        }
        confirmText="Hapus workspace"
        isPending={workspace.workspaceState.isMutating}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={async () => {
          if (dialog?.type !== 'delete') return
          try {
            await workspace.workspaceState.deleteWorkspace(dialog.workspace.id)
            toast.success('Workspace dihapus.')
            closeDialog()
            navigate('/')
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus workspace.')
          }
        }}
      />
    </div>
  )
}

function findDoc(nodes: DocNode[], id: string): DocNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node
    const found = findDoc(node.children ?? [], id)
    if (found) return found
  }
  return undefined
}
