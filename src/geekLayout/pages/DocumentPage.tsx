import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useWorkspaceContext } from '../context/WorkspaceContext'
import { useWorkspaceDocuments } from '../hooks/useDocumentQueries'
import type { DocumentTreeNode } from '@/lib/api/types'
import { MainContent } from '../components/document/MainContent'
import { Icon } from '../components/ui/Icon'

export function DocumentPage() {
  const { documentId } = useParams<{ documentId: string }>()
  const { activeWorkspace, docs, accessLevel } = useWorkspaceContext()
  const firstDocId = docs[0]?.children?.[0]?.id ?? docs[0]?.id
  const selectedId = documentId ?? firstDocId

  return (
    <MainContent
      documentId={selectedId}
      workspace={activeWorkspace}
      tree={toTree(docs)}
      access={accessLevel}
    />
  )
}

// DocNode -> DocumentTreeNode for components that need the API tree shape.
function toTree(nodes: ReturnType<typeof useWorkspaceContext>['docs']): DocumentTreeNode[] {
  return nodes.map((node) => ({
    id: node.id,
    parentId: node.parentId,
    title: node.title,
    children: toTree(node.children ?? []),
  }))
}

export function DocumentsIndexPage() {
  const { activeWorkspace, docs, accessLevel, members, openShare, canWrite } =
    useWorkspaceContext()
  const [search, setSearch] = useState('')
  const list = useWorkspaceDocuments(
    activeWorkspace?.id,
    search ? { search } : undefined,
    Boolean(activeWorkspace),
  )
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-geek-secondary">
            // DOCUMENTATION
          </p>
          <h1 className="mt-1 font-mono text-2xl font-bold text-slate-900">
            {activeWorkspace?.name ?? 'Workspace'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {docs.length} root pages · {members.length} collaborators · akses {accessLevel}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Icon name="magnifying-glass" className="absolute left-3 top-2.5 text-xs text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari dokumen..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 font-mono text-xs outline-none focus:border-geek-cyan"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {list.isLoading &&
          [1, 2, 3, 4].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-xl bg-slate-100" />
          ))}

        {list.isError && (
          <div className="col-span-full rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {list.error instanceof Error
              ? list.error.message
              : 'Gagal memuat daftar dokumen.'}
            <button
              type="button"
              onClick={() => void list.refetch()}
              className="ml-2 font-bold underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!list.isLoading &&
          (list.data ?? []).map((document) => (
            <div
              key={document.id}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-geek-secondary hover:shadow-md"
            >
              <Link to={`/docs/${document.id}`} className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                    <Icon name={document.parentId ? 'file-lines' : 'book'} />
                  </span>
                  <Icon name="arrow-right" className="text-[10px] text-slate-300 group-hover:text-geek-secondary" />
                </div>
                <h2 className="mt-3 truncate font-mono text-sm font-bold text-slate-800">
                  {document.title}
                </h2>
                <p className="mt-1 font-mono text-[10px] text-slate-400">
                  {document.parentId ? 'Sub-page' : 'Root document'} · updated{' '}
                  {new Date(document.updatedAt).toLocaleDateString()}
                </p>
              </Link>
              {canWrite && (
                <button
                  type="button"
                  onClick={() => openShare(document.id, document.title)}
                  className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 font-mono text-[10px] font-bold text-slate-500 hover:text-geek-secondary"
                >
                  <Icon name="share-nodes" className="text-geek-cyan" /> Share / public link
                </button>
              )}
            </div>
          ))}

        {!list.isLoading && (list.data?.length ?? 0) === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Icon name="file-circle-plus" className="mb-2 text-3xl text-slate-300" />
            <p className="text-sm font-bold text-slate-600">Tidak ada dokumen ditemukan.</p>
            <p className="mt-1 text-xs text-slate-400">
              Buat dokumen baru dari tombol + di sidebar.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
