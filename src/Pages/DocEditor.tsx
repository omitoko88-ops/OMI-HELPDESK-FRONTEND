import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { TiptapEditorHtmlOutput } from './TiptapEditor'
import { useDocument, useSaveDocument } from '@/geekLayout/hooks/useDocumentQueries'
import { useTreeStore } from '@/stores/docUiStore'
import { Icon } from '@/geekLayout/components/ui/Icon'
import { useWorkspaceContext } from '@/geekLayout/context/WorkspaceContext'
import { useUpdateDocumentForm } from '@/geekLayout/hooks/useDocumentForm'
import type { DocNode } from '@/geekLayout/types'

export const DocEditor = () => {
  const { documentId } = useParams<{ documentId: string }>()
  const navigate = useNavigate()
  const { activeWorkspace, accessLevel, docs, openShare, refreshDocs, canWrite } =
    useWorkspaceContext()
  const documentQuery = useDocument(documentId)
  const setExpanded = useTreeStore((state) => state.setExpanded)
  const saveDocument = useSaveDocument(documentId)

  const documentForm = useUpdateDocumentForm({
    title: documentQuery.data?.title ?? '',
    content: documentQuery.data?.content ?? null,
    isPending: saveDocument.isPending,
    onSubmit: async ({ title, content }) => {
      if (!documentId || !canWrite) return
      const updated = await saveDocument.mutateAsync({ title, content })
      toast.success('Dokumen tersimpan.')
      if (updated.parentId) setExpanded(updated.parentId, true)
      refreshDocs()
    },
  })
  const title = documentForm.form.watch('title')
  const dirty = documentForm.form.formState.isDirty

  const parentTitle = useMemo(() => {
    if (!documentQuery.data?.parentId) return 'Workspace root'
    const find = (nodes: DocNode[]): string | undefined => {
      for (const node of nodes) {
        if (node.id === documentQuery.data?.parentId) return node.title
        const found = find(node.children ?? [])
        if (found) return found
      }
      return undefined
    }
    return find(docs) ?? 'Workspace root'
  }, [documentQuery.data?.parentId, docs])

  useEffect(() => {
    if (!dirty || !canWrite) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [canWrite, dirty])

  if (!documentId) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <Icon name="pen-to-square" className="text-4xl text-slate-300" />
        <h1 className="font-mono text-lg font-bold text-slate-800">Pilih dokumen untuk diedit</h1>
        <p className="max-w-md text-sm text-slate-500">
          Buka dokumen dari sidebar, lalu tekan Edit Page.
        </p>
        <Link to="/docs" className="text-sm font-bold text-geek-secondary hover:underline">
          Buka dokumentasi
        </Link>
      </div>
    )
  }

  if (documentQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 p-6">
        <div className="h-9 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
      </div>
    )
  }

  if (documentQuery.isError || !documentQuery.data) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <Icon name="triangle-exclamation" className="text-4xl text-rose-400" />
        <h1 className="font-mono text-lg font-bold text-slate-800">Dokumen tidak ditemukan</h1>
        <p className="max-w-md text-sm text-slate-500">
          Dokumen mungkin sudah dihapus atau Anda tidak punya akses.
        </p>
        <button
          type="button"
          onClick={() => navigate('/docs')}
          className="text-sm font-bold text-geek-secondary hover:underline"
        >
          Kembali ke dokumentasi
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-4 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 font-mono text-xs">
        <div className="flex min-w-0 items-center gap-2 text-slate-500">
          <Link to="/" className="font-bold text-geek-secondary hover:underline">
            {activeWorkspace?.name ?? 'Workspace'}
          </Link>
          <span>/</span>
          <span>{parentTitle}</span>
          <span>/</span>
          <span className="truncate font-bold text-slate-900">{title || 'Untitled'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold uppercase text-slate-500">
            {accessLevel}
          </span>
          <Link
            to={`/docs/${documentId}`}
            className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-200"
          >
            Preview
          </Link>
          {canWrite && (
            <button
              type="button"
              onClick={() => {
                const current = documentQuery.data
                if (current) openShare(current.id, title || current.title)
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-200"
            >
              <Icon name="share-nodes" className="text-geek-cyan" />
              Share
            </button>
          )}
          <button
            type="button"
            onClick={() => void documentForm.submit()}
            disabled={!canWrite || documentForm.isPending || !dirty}
            className="flex items-center gap-1.5 rounded-lg bg-geek-secondary px-3 py-1.5 font-bold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name={documentForm.isPending ? 'circle-notch' : 'floppy-disk'} className={documentForm.isPending ? 'animate-spin' : ''} />
            {documentForm.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {!canWrite && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          Anda memiliki akses Viewer. Perubahan tidak dapat disimpan.
        </div>
      )}

      <input
        {...documentForm.form.register('title')}
        readOnly={!canWrite}
        placeholder="Untitled document"
        className="w-full rounded-lg border border-transparent bg-transparent px-1 py-2 font-mono text-3xl font-bold text-slate-900 outline-none focus:border-slate-200 focus:bg-slate-50 read-only:opacity-80"
      />
      {documentForm.form.formState.errors.title && (
        <p className="text-xs text-rose-600">
          {documentForm.form.formState.errors.title.message}
        </p>
      )}

      <div className="min-h-0 flex-1">
        <TiptapEditorHtmlOutput
          initialContent={documentQuery.data.content ?? ''}
          editable={canWrite}
          showToolbar={canWrite}
          onChangeHtml={(value) => {
            documentForm.form.setValue('content', value, { shouldDirty: true })
          }}
        />
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-3 font-mono text-[10px] text-slate-400">
        <span>{dirty ? '● Unsaved changes' : '● Semua perubahan tersimpan'}</span>
        <span>Doc ID: {documentId}</span>
      </div>
    </div>
  )
}
