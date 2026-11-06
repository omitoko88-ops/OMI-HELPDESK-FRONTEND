import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { ShareModal } from './components/share/ShareModal'
import { Sidebar } from './components/sidebar/Sidebar'
import { Header } from './components/header/Header'
import { InputDialog } from './components/common/InputDialog'
import { ConfirmDialog } from './components/common/ConfirmDialog'
import { useMemberMutations } from './hooks/useWorkspaceMembers'
import { useDocumentTree } from './hooks/useDocumentTree'
import { useShareModal } from './hooks/useShareModal'
import { useWorkspaceAccess } from './hooks/useWorkspaceAccess'
import { useWorkspaces } from './hooks/useWorkspaces'
import type { DocNode, Workspace } from './types'

export interface LayoutOutletContext {
  activeWorkspace: Workspace | null
  workspaces: Workspace[]
  docs: DocNode[]
  access: ReturnType<typeof useWorkspaceAccess>['access']
  members: ReturnType<typeof useWorkspaceAccess>['members']
  openShare: (documentId: string, title: string) => void
  openInvite: () => void
  refreshDocs: () => void
}

type DialogState =
  | { type: 'create' }
  | { type: 'rename'; workspace: Workspace }
  | { type: 'delete'; workspace: Workspace }
  | { type: 'createDocument'; parentId: string | null; parentTitle: string }
  | null

export default function GeekLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { documentId: routeDocumentId } = useParams<{ documentId: string }>()
  const workspaceState = useWorkspaces()
  const { activeWorkspace, workspaces } = workspaceState
  const tree = useDocumentTree(activeWorkspace?.id)
  const access = useWorkspaceAccess(activeWorkspace?.id)
  const memberMutations = useMemberMutations(activeWorkspace?.id)
  const shareModal = useShareModal()
  const [dialog, setDialog] = useState<DialogState>(null)

  const activeDocId = useMemo(() => {
    if (routeDocumentId) return routeDocumentId
    const match = location.pathname.match(/^\/(?:docs|edit)\/([^/]+)/)
    if (match) return match[1]
    const first = tree.docs[0]
    if (!first) return ''
    return first.children?.[0]?.id ?? first.id
  }, [location.pathname, routeDocumentId, tree.docs])

  const askCreateWorkspace = () => setDialog({ type: 'create' })
  const askRenameWorkspace = (workspace: Workspace) => setDialog({ type: 'rename', workspace })
  const askDeleteWorkspace = (workspace: Workspace) => setDialog({ type: 'delete', workspace })

  const addChild = async (parentId: string) => {
    const parent = findDoc(tree.docs, parentId)
    setDialog({
      type: 'createDocument',
      parentId,
      parentTitle: parent?.title ?? 'dokumen ini',
    })
  }

  const addRoot = () => {
    if (!activeWorkspace) {
      toast.error('Buat atau pilih workspace terlebih dahulu.')
      return
    }
    setDialog({ type: 'createDocument', parentId: null, parentTitle: activeWorkspace.name })
  }

  const submitDocumentDialog = async (value: string) => {
    if (!dialog || dialog.type !== 'createDocument' || !activeWorkspace) return
    try {
      const created = dialog.parentId
        ? await tree.addChild(dialog.parentId, value)
        : await tree.addRoot(value)
      setDialog(null)
      toast.success(dialog.parentId ? 'Sub-halaman dibuat.' : 'Dokumen dibuat.')
      navigate(`/edit/${created.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal membuat dokumen.')
    }
  }

  const submitWorkspaceDialog = async (value: string) => {
    if (!dialog) return
    try {
      if (dialog.type === 'create') {
        await workspaceState.createWorkspace(value)
        toast.success('Workspace dibuat.')
        navigate('/')
      } else if (dialog.type === 'rename') {
        await workspaceState.renameWorkspace({ id: dialog.workspace.id, name: value })
        toast.success('Workspace diperbarui.')
      } else if (dialog.type === 'delete') {
        await workspaceState.deleteWorkspace(dialog.workspace.id)
        toast.success('Workspace dihapus.')
        navigate('/')
      }
      setDialog(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Aksi workspace gagal.')
    }
  }

  const confirmDelete = async () => {
    if (!dialog || dialog.type !== 'delete') return
    await submitWorkspaceDialog(dialog.workspace.name)
  }

  const openShare = (documentId: string, title: string) =>
    shareModal.open(documentId, title)

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        docs={tree.docs}
        memberCount={access.members.length}
        accessLabel={access.access === 'none' ? 'No access' : access.access}
        onSelectWorkspace={(id) => {
          workspaceState.selectWorkspace(id)
          navigate('/')
        }}
        onCreateWorkspace={askCreateWorkspace}
        onRenameWorkspace={askRenameWorkspace}
        onDeleteWorkspace={askDeleteWorkspace}
        onLeaveWorkspace={async (workspace) => {
          if (!window.confirm(`Keluar dari workspace "${workspace.name}"?`)) return
          try {
            await memberMutations.leave.mutateAsync()
            toast.success('Anda telah keluar dari workspace.')
            navigate('/')
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal keluar dari workspace.')
          }
        }}
        isMutating={workspaceState.isMutating || memberMutations.isMutating}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          workspace={activeWorkspace}
          access={access.access}
          docs={tree.docs}
          activeDocId={activeDocId}
          loading={tree.isLoading || workspaceState.isLoading}
          onToggle={tree.toggleExpanded}
          onShare={openShare}
          onAddChild={(parentId) => void addChild(parentId)}
          onAddRoot={() => void addRoot()}
          onInvite={() => navigate('/members')}
          memberCount={access.members.length}
        />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet
            context={
              {
                activeWorkspace,
                workspaces,
                docs: tree.docs,
                access: access.access,
                members: access.members,
                openShare,
                openInvite: () => navigate('/members'),
                refreshDocs: () => void tree.refetch(),
              } satisfies LayoutOutletContext
            }
          />
        </main>
      </div>

      <ShareModal
        isOpen={shareModal.isOpen}
        documentId={shareModal.target.id}
        docTitle={shareModal.target.title}
        workspaceId={activeWorkspace?.id}
        onClose={shareModal.close}
      />

      <InputDialog
        open={
          dialog?.type === 'create' ||
          dialog?.type === 'rename' ||
          dialog?.type === 'createDocument'
        }
        title={
          dialog?.type === 'rename'
            ? 'Rename workspace'
            : dialog?.type === 'createDocument'
              ? dialog.parentId
                ? 'New sub-page'
                : 'New document'
              : 'Create workspace'
        }
        description={
          dialog?.type === 'rename'
            ? 'Ubah nama workspace yang sedang aktif.'
            : dialog?.type === 'createDocument'
              ? dialog.parentId
                ? `Sub-halaman baru di bawah "${dialog.parentTitle}".`
                : 'Dokumen baru akan dibuat di root workspace aktif.'
              : 'Workspace baru akan otomatis menempatkan Anda sebagai owner.'
        }
        label={dialog?.type === 'createDocument' ? 'Judul dokumen' : 'Nama workspace'}
        placeholder={
          dialog?.type === 'createDocument'
            ? 'Contoh: Panduan onboarding'
            : 'Contoh: Engineering Docs'
        }
        defaultValue={dialog?.type === 'rename' ? dialog.workspace.name : ''}
        confirmText={
          dialog?.type === 'rename'
            ? 'Simpan'
            : dialog?.type === 'createDocument'
              ? 'Buat dokumen'
              : 'Buat'
        }
        isPending={workspaceState.isMutating || tree.isMutating}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        onConfirm={
          dialog?.type === 'createDocument' ? submitDocumentDialog : submitWorkspaceDialog
        }
      />

      <ConfirmDialog
        open={dialog?.type === 'delete'}
        title="Hapus workspace?"
        description={
          dialog?.type === 'delete'
            ? `Workspace "${dialog.workspace.name}" beserta dokumen dan anggota di dalamnya akan dihapus permanen.`
            : ''
        }
        confirmText="Hapus workspace"
        isPending={workspaceState.isMutating}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        onConfirm={confirmDelete}
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
