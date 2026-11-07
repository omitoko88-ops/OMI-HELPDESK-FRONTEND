import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { toast } from 'sonner'
import type { DocumentTreeNode } from '@/lib/api/types'
import { TiptapViewer } from '@/Pages/DocViewer/TiptapViewerHtml'
import { TiptapEditorHtmlOutput } from '@/Pages/TiptapEditor'
import { useAuthStore } from '@/stores/authStore'
import { Icon } from '../components/ui/Icon'
import { usePublicDocumentForm } from '../hooks/useDocumentForm'
import {
  usePublicPage,
  usePublicShare,
  useUpdatePublicPage,
} from '../hooks/useDocumentQueries'

function flattenTree(
  node: DocumentTreeNode,
  depth = 0,
): Array<DocumentTreeNode & { depth: number }> {
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

  const root = usePublicShare(token)
  const rootDocumentId = root.data?.document.id
  const activeId = activePageId ?? rootDocumentId
  const isRoot = Boolean(activeId && activeId === rootDocumentId)
  const page = usePublicPage(token, activeId && !isRoot ? activeId : undefined)
  const updatePage = useUpdatePublicPage(token)

  const activeDocument = page.data ?? root.data?.document

  const documentForm = usePublicDocumentForm({
    title: activeDocument?.title ?? '',
    content: activeDocument?.content ?? null,
    isPending: updatePage.isPending,
    onSubmit: async (values) => {
      if (!activeDocument) return
      await updatePage.mutateAsync({ id: activeDocument.id, ...values })
      setEditing(false)
      toast.success('Halaman berhasil disimpan.')
    },
  })

  useEffect(() => {
    setEditing(false)
  }, [activePageId, rootDocumentId])

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
        <h1 className="font-mono text-lg font-bold text-slate-800">
          Link tidak valid atau sudah tidak aktif
        </h1>
        <p className="max-w-md text-sm text-slate-500">
          Token mungkin sudah kedaluwarsa, dinonaktifkan, atau diganti oleh pemilik dokumen.
        </p>
      </div>
    )
  }

  if (!activeDocument) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="font-mono text-sm text-rose-600">Halaman tidak ditemukan.</p>
      </div>
    )
  }

  const share = root.data
  const pages = flattenTree(share.tree)
  const canEdit = share.canEdit && Boolean(authToken)
  const title = documentForm.form.watch('title')

  const startEditing = () => {
    documentForm.form.reset({
      title: activeDocument.title,
      content: activeDocument.content ?? '',
    })
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

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 p-4 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
            // SHARED_TREE
          </div>
          <nav className="space-y-1 font-mono text-xs">
            {pages.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => setActivePageId(node.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left ${
                  node.id === activeDocument.id
                    ? 'bg-indigo-50 font-bold text-indigo-900'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                style={{ paddingLeft: `${8 + node.depth * 12}px` }}
              >
                <Icon
                  name={node.children.length ? 'book' : 'file-lines'}
                  className="text-[10px]"
                />
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
                  {...documentForm.form.register('title')}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1 font-mono text-2xl font-bold text-slate-900 outline-none focus:border-geek-cyan"
                />
              ) : (
                <h1 className="font-mono text-2xl font-bold text-slate-900">
                  {activeDocument.title}
                </h1>
              )}
              {documentForm.form.formState.errors.title && (
                <p className="mt-1 text-xs text-rose-600">
                  {documentForm.form.formState.errors.title.message}
                </p>
              )}
              <p className="mt-2 font-mono text-[11px] text-slate-400">
                Updated {new Date(activeDocument.updatedAt).toLocaleString()} · ID{' '}
                {activeDocument.id}
              </p>
            </div>

            {share.canEdit && (
              <div className="flex gap-2 font-mono text-xs">
                {editing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        documentForm.form.reset({
                          title: activeDocument.title,
                          content: activeDocument.content ?? '',
                        })
                        setEditing(false)
                      }}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => void documentForm.submit()}
                      disabled={documentForm.isPending || !title.trim()}
                      className="rounded-lg bg-geek-secondary px-3 py-1.5 font-bold text-white disabled:opacity-50"
                    >
                      {documentForm.isPending ? 'Saving...' : 'Save'}
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

          {page.isLoading && !isRoot ? (
            <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
          ) : editing ? (
            <TiptapEditorHtmlOutput
              initialContent={documentForm.form.getValues('content') ?? ''}
              onChangeHtml={(value) => {
                documentForm.form.setValue('content', value, { shouldDirty: true })
              }}
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
