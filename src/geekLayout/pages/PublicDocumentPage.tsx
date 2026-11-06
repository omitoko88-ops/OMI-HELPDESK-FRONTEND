import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useLocation, useParams } from 'react-router'
import { toast } from 'sonner'
import { publicApi } from '@/lib/api/endpoints'
import type { DocumentTreeNode, PublicDocumentDto, PublicShareResponse } from '@/lib/api/types'
import { TiptapViewer } from '@/Pages/DocViewer/TiptapViewerHtml'
import { TiptapEditorHtmlOutput } from '@/Pages/TiptapEditor'
import { useAuthStore } from '@/stores/authStore'
import { Icon } from '../components/ui/Icon'

function flattenTree(node: DocumentTreeNode, depth = 0): Array<DocumentTreeNode & { depth: number }> {
  return [
    { ...node, depth },
    ...node.children.flatMap((child) => flattenTree(child, depth + 1)),
  ]
}

export function PublicDocumentPage() {
  const { token = '' } = useParams<{ token: string }>()
  const location = useLocation()
  const authToken = useAuthStore((state) => state.token)
  const [activePageId, setActivePageId] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const root = useQuery({
    queryKey: ['public-document', token],
    queryFn: ({ signal }) => publicApi.root(token, signal),
    enabled: Boolean(token),
  })

  const activeId = activePageId ?? root.data?.document.id
  const page = useQuery({
    queryKey: ['public-document', token, 'page', activeId],
    queryFn: ({ signal }) => publicApi.page(token, activeId!, signal),
    enabled: Boolean(token && activeId),
  })

  const save = useMutation({
    mutationFn: (input: { id: string; title: string; content: string }) =>
      publicApi.updatePage(token, input.id, {
        title: input.title,
        content: input.content,
      }),
    onSuccess: async () => {
      setEditing(false)
      toast.success('Halaman berhasil disimpan.')
      await Promise.all([page.refetch(), root.refetch()])
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan halaman.')
    },
  })

  useEffect(() => {
    const activeDocument = page.data ?? root.data?.document
    if (!activeDocument) return
    setEditing(false)
    setTitle(activeDocument.title)
    setContent(activeDocument.content ?? '')
  }, [page.data, root.data?.document])

  if (root.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="font-mono text-sm text-slate-500">Memuat dokumen publik...</p>
      </div>
    )
  }

  if (root.isError || !root.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 p-8 text-center">
        <Icon name="link-slash" className="text-5xl text-rose-400" />
        <h1 className="font-mono text-lg font-bold text-slate-800">Link tidak valid atau sudah tidak aktif</h1>
        <p className="max-w-md text-sm text-slate-500">
          Token mungkin sudah kedaluwarsa, dinonaktifkan, atau diganti oleh pemilik dokumen.
        </p>
      </div>
    )
  }

  const share = root.data as PublicShareResponse
  const activeDocument: PublicDocumentDto | undefined = page.data ?? share.document
  const pages = flattenTree(share.tree)
  const canEdit = share.canEdit && Boolean(authToken)
  const isRoot = activeDocument.id === share.document.id

  const startEditing = () => {
    setTitle(activeDocument.title)
    setContent(activeDocument.content ?? '')
    setEditing(true)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-geek-accent bg-geek-accent/10 text-geek-accent">
              <Icon name="code-branch" />
            </span>
            <span className="font-bold text-slate-900">OMI Helpdesk</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">Shared document</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 font-bold text-emerald-700">
              {share.role} link
            </span>
            {share.canEdit && !authToken && (
              <Link
                to="/login"
                state={{ from: location }}
                className="rounded border border-amber-200 bg-amber-50 px-2 py-1 font-bold text-amber-700 hover:bg-amber-100"
              >
                Login untuk mengedit
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 p-4 md:grid-cols-[240px_1fr] md:p-6">
        <aside className="self-start rounded-xl border border-slate-200 bg-white p-3 font-mono text-xs">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Shared pages
          </div>
          <nav className="space-y-1">
            {pages.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  setActivePageId(node.id)
                  setEditing(false)
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left ${
                  node.id === activeId
                    ? 'bg-indigo-50 font-bold text-indigo-900'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                style={{ paddingLeft: `${8 + node.depth * 12}px` }}
              >
                <Icon name={node.children.length ? 'book' : 'file-lines'} className="text-[10px]" />
                <span className="truncate">{node.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-5">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10px] font-bold text-slate-500">
                <Icon name="globe" /> Public access · {share.role}
              </div>
              {editing ? (
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1 font-mono text-2xl font-bold text-slate-900 outline-none focus:border-geek-cyan"
                />
              ) : (
                <h1 className="font-mono text-2xl font-bold text-slate-900">{activeDocument.title}</h1>
              )}
              <p className="mt-2 font-mono text-[11px] text-slate-400">
                Updated {new Date(activeDocument.updatedAt).toLocaleString()} · ID {activeDocument.id}
              </p>
            </div>

            {share.canEdit && (
              <div className="flex gap-2 font-mono text-xs">
                {editing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void save.mutateAsync({ id: activeDocument.id, title, content })
                      }
                      disabled={save.isPending || !title.trim()}
                      className="rounded-lg bg-geek-secondary px-3 py-1.5 font-bold text-white disabled:opacity-50"
                    >
                      {save.isPending ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={startEditing}
                    disabled={!canEdit}
                    title={canEdit ? 'Edit this page' : 'Login diperlukan untuk mengedit'}
                    className="rounded-lg bg-geek-secondary px-3 py-1.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Icon name="pen" className="mr-1" /> Edit
                  </button>
                )}
              </div>
            )}
          </div>

          {page.isLoading ? (
            <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
          ) : editing ? (
            <TiptapEditorHtmlOutput
              initialContent={activeDocument.content ?? ''}
              onChangeHtml={setContent}
            />
          ) : activeDocument.content ? (
            <TiptapViewer html={activeDocument.content} editable={false} />
          ) : (
            <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Halaman ini belum memiliki isi.
            </p>
          )}

          {isRoot && share.tree.children.length > 0 && !editing && (
            <div className="mt-6 border-t border-slate-200 pt-5">
              <h2 className="mb-3 font-mono text-sm font-bold text-slate-900">Sub-pages</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {share.tree.children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => setActivePageId(child.id)}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left font-mono text-xs hover:border-geek-secondary"
                  >
                    <span className="truncate font-bold text-slate-700">{child.title}</span>
                    <Icon name="arrow-right" className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
