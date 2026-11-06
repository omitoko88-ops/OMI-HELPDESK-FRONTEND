import { Link, useNavigate } from 'react-router'
import type { DocumentTreeNode } from '@/lib/api/types'
import type { WorkspaceAccess } from '../../types'
import { DocumentContent } from './DocumentContent'
import { DocumentHeader } from './DocumentHeader'
import { DocumentToolbar } from './DocumentToolbar'
import { StatusBar } from './StatusBar'
import { useDocument } from '../../hooks/useDocumentQueries'
import { Icon } from '../ui/Icon'
import type { Workspace } from '../../types'

interface MainContentProps {
  documentId: string | undefined
  workspace: Workspace | null
  tree: DocumentTreeNode[]
  access: WorkspaceAccess
  onShare: (documentId: string, title: string) => void
}

const timeAgo = (value: string) => {
  const time = new Date(value).getTime()
  if (!Number.isFinite(time)) return 'baru saja'
  const seconds = Math.max(1, Math.floor((Date.now() - time) / 1000))
  if (seconds < 60) return `${seconds} detik lalu`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  return `${Math.floor(hours / 24)} hari lalu`
}

const ACCESS_LABEL: Record<WorkspaceAccess, string> = {
  owner: 'Owner',
  editor: 'Editor',
  viewer: 'Viewer',
  none: 'No access',
}

export function MainContent({
  documentId,
  workspace,
  tree,
  access,
  onShare,
}: MainContentProps) {
  const navigate = useNavigate()
  const documentQuery = useDocument(documentId)
  const canWrite = access === 'owner' || access === 'editor'

  const findNode = (nodes: DocumentTreeNode[]): DocumentTreeNode | undefined => {
    for (const node of nodes) {
      if (node.id === documentId) return node
      const child = findNode(node.children)
      if (child) return child
    }
    return undefined
  }
  const node = findNode(tree)

  if (!documentId) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-3 bg-white p-8 text-center">
        <Icon name="book-open" className="text-4xl text-slate-300" />
        <h2 className="font-mono text-lg font-bold text-slate-800">Pilih dokumen</h2>
        <p className="max-w-md text-sm text-slate-500">
          Pilih halaman dari pohon dokumen di sidebar, atau buat dokumen baru dari tombol +.
        </p>
      </div>
    )
  }

  if (documentQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 p-6">
        <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
        <div className="h-9 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
      </div>
    )
  }

  if (documentQuery.isError || !documentQuery.data) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-3 bg-white p-8 text-center">
        <Icon name="triangle-exclamation" className="text-4xl text-rose-400" />
        <h2 className="font-mono text-lg font-bold text-slate-800">Dokumen tidak dapat dibuka</h2>
        <p className="max-w-md text-sm text-slate-500">
          Dokumen mungkin telah dihapus atau Anda tidak punya akses.
        </p>
        <Link to="/docs" className="text-sm font-bold text-geek-secondary hover:underline">
          Kembali ke dokumentasi
        </Link>
      </div>
    )
  }

  const document = documentQuery.data

  return (
    <div className="flex min-h-full flex-1 flex-col justify-between relative bg-white tech-grid">
      <div className="p-6 max-w-4xl w-full mx-auto space-y-6">
        <DocumentToolbar
          document={document}
          workspaceName={workspace?.name ?? 'Workspace'}
          tree={tree}
          canWrite={canWrite}
          onShare={onShare}
          onDeleted={() => navigate('/docs')}
        />
        <DocumentHeader
          document={document}
          accessLabel={ACCESS_LABEL[access]}
          updatedLabel={timeAgo(document.updatedAt)}
        />
        <DocumentContent
          content={document.content}
          children={node?.children}
          canWrite={canWrite}
        />
      </div>

      <StatusBar document={document} accessLabel={ACCESS_LABEL[access]} />
    </div>
  )
}
