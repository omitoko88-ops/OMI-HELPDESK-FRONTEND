import { useMemo, useState } from 'react'
import { Link, useOutletContext, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import PageMeta from '@/components/common/PageMeta'
import type { LayoutOutletContext } from '@/geekLayout/GeekLayout'
import type { DocNode } from '@/geekLayout/types'
import { Icon } from '@/geekLayout/components/ui/Icon'
import { InputDialog } from '@/geekLayout/components/common/InputDialog'
import { documentApi } from '@/lib/api/endpoints'
import type { DocumentListItemDto } from '@/lib/api/types'

interface FlatDocument extends DocumentListItemDto {
  depth: number
  parentTitle: string
}

function flatten(nodes: DocNode[], depth = 0, parent = 'Workspace root'): FlatDocument[] {
  return nodes.flatMap((node) => [
    {
      id: node.id,
      workspaceId: '',
      parentId: node.parentId,
      title: node.title,
      createdById: '',
      createdAt: node.updatedAt ?? new Date().toISOString(),
      updatedAt: node.updatedAt ?? new Date().toISOString(),
      depth,
      parentTitle: parent,
    },
    ...flatten(node.children ?? [], depth + 1, node.title),
  ])
}

function timeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime()
  if (!Number.isFinite(diff)) return 'baru saja'
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  return `${Math.floor(hours / 24)} hari lalu`
}

export const Home = () => {
  const navigate = useNavigate()
  const {
    activeWorkspace,
    workspaces,
    docs,
    access,
    members,
    openShare,
    refreshDocs,
  } = useOutletContext<LayoutOutletContext>()
  const [createOpen, setCreateOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const listQuery = useQuery({
    queryKey: ['documents', activeWorkspace?.id, 'list'],
    queryFn: ({ signal }) => documentApi.list(activeWorkspace!.id, undefined, signal),
    enabled: Boolean(activeWorkspace),
  })

  const flatDocs = useMemo(() => flatten(docs), [docs])
  const recentDocuments = useMemo(() => {
    const apiDocuments = listQuery.data
    if (apiDocuments?.length) {
      const parentTitles = new Map(flatDocs.map((doc) => [doc.id, doc.parentTitle]))
      return [...apiDocuments]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)
        .map((doc) => ({
          ...doc,
          depth: 0,
          parentTitle: parentTitles.get(doc.id) ?? (doc.parentId ? 'Sub-page' : 'Workspace root'),
        }))
    }
    return [...flatDocs]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
  }, [flatDocs, listQuery.data])

  const canWrite = access === 'owner' || access === 'editor'
  const documentCount = listQuery.data?.length ?? flatDocs.length
  const memberCount = members.length
  const rootCount = docs.length
  const childCount = Math.max(0, documentCount - rootCount)

  const metrics = [
    {
      label: 'Documents',
      value: String(documentCount).padStart(2, '0'),
      detail: `${rootCount} root · ${childCount} sub-pages`,
      icon: 'file-lines',
      iconClass: 'bg-indigo-50 text-geek-secondary border-indigo-100',
    },
    {
      label: 'Workspaces',
      value: String(workspaces.length).padStart(2, '0'),
      detail: activeWorkspace ? `${activeWorkspace.name} aktif` : 'Belum ada workspace',
      icon: 'cubes',
      iconClass: 'bg-sky-50 text-geek-cyan border-sky-100',
    },
    {
      label: 'Collaborators',
      value: String(memberCount).padStart(2, '0'),
      detail: `Akses Anda: ${access}`,
      icon: 'users',
      iconClass: 'bg-emerald-50 text-geek-accent border-emerald-100',
    },
    {
      label: 'Root pages',
      value: String(rootCount).padStart(2, '0'),
      detail: 'Halaman utama di workspace aktif',
      icon: 'book',
      iconClass: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ]

  const createDocument = async (title: string) => {
    const value = title.trim()
    if (!value || !activeWorkspace || !canWrite) return
    setBusy(true)
    try {
      const created = await documentApi.create(activeWorkspace.id, {
        title: value,
        parentId: null,
      })
      toast.success('Dokumen berhasil dibuat.')
      setCreateOpen(false)
      refreshDocs()
      await listQuery.refetch()
      navigate(`/docs/${created.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal membuat dokumen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-full w-full bg-geek-bg">
      <PageMeta
        title="Dashboard | OMI Helpdesk"
        description="Overview workspace dokumentasi, dokumen terbaru, anggota, dan akses publik."
      />

      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="tech-grid pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider">
                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700">
                  <span className="mr-1 text-geek-accent">●</span> API connected
                </span>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-slate-500">
                  {activeWorkspace?.name ?? 'Belum ada workspace'}
                </span>
                <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-indigo-700">
                  {access}
                </span>
              </div>

              <p className="font-mono text-xs font-semibold text-geek-secondary">
                // WORKSPACE OVERVIEW
              </p>
              <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {activeWorkspace?.name ?? 'Your documentation hub'}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
                Dokumen, anggota, dan link publik workspace ini terhubung langsung ke
                OMI Helpdesk API.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-mono text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <Icon name="book-open" className="text-geek-cyan" />
                Browse documents
              </Link>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                disabled={!canWrite || !activeWorkspace}
                title={canWrite ? 'Create a new document' : 'Akses baca saja'}
                className="inline-flex items-center gap-2 rounded-lg bg-geek-secondary px-4 py-2.5 font-mono text-xs font-bold text-white shadow-sm transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="plus" />
                New document
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {metric.label}
                  </p>
                  <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-slate-900">
                    {metric.value}
                  </p>
                </div>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg border ${metric.iconClass}`}>
                  <Icon name={metric.icon} />
                </span>
              </div>
              <p className="mt-4 truncate font-mono text-[11px] text-slate-500">{metric.detail}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-mono text-sm font-bold text-slate-900">Recent documents</h2>
                <p className="mt-1 text-xs text-slate-500">Dokumen terbaru di workspace aktif.</p>
              </div>
              <Link to="/docs" className="font-mono text-[11px] font-bold text-geek-secondary hover:underline">
                View all <Icon name="arrow-right" className="ml-1 text-[9px]" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {listQuery.isLoading ? (
                [1, 2, 3].map((item) => (
                  <div key={item} className="px-5 py-4 sm:px-6">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  </div>
                ))
              ) : recentDocuments.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-slate-500 sm:px-6">
                  Belum ada dokumen di workspace ini.
                </div>
              ) : (
                recentDocuments.map((document) => (
                  <Link
                    key={document.id}
                    to={`/docs/${document.id}`}
                    className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                      <Icon name={document.parentId ? 'file-lines' : 'book'} className="text-slate-500" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-xs font-bold text-slate-800 group-hover:text-geek-secondary">
                        {document.title}
                      </span>
                      <span className="mt-1 block truncate text-[11px] text-slate-400">
                        {document.parentTitle}
                      </span>
                    </span>
                    <span className="hidden shrink-0 font-mono text-[10px] text-slate-400 sm:block">
                      {timeAgo(document.updatedAt)}
                    </span>
                    <Icon name="chevron-right" className="text-[9px] text-slate-300 group-hover:text-geek-secondary" />
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-mono text-sm font-bold text-slate-900">Team & access</h2>
                <p className="mt-1 text-xs text-slate-500">Anggota workspace aktif.</p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 font-mono text-[9px] font-bold text-emerald-700">
                {memberCount} ACTIVE
              </span>
            </div>

            <ul className="mt-5 space-y-3">
              {members.slice(0, 5).map((member) => (
                <li key={member.id} className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 font-mono text-[9px] font-bold text-slate-600">
                      {member.username.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[11px] font-bold text-slate-800">{member.username}</p>
                      <p className="truncate text-[10px] text-slate-400">{member.email}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-slate-500">
                    {member.role}
                  </span>
                </li>
              ))}
              {members.length === 0 && (
                <li className="text-xs text-slate-400">Belum ada anggota.</li>
              )}
            </ul>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  if (!canWrite) {
                    toast.error('Hanya owner atau editor yang dapat mengatur link publik.')
                    return
                  }
                  if (!recentDocuments[0]) {
                    toast.error('Belum ada dokumen untuk dibagikan.')
                    return
                  }
                  openShare(recentDocuments[0].id, recentDocuments[0].title)
                }}
                disabled={!recentDocuments[0] || !canWrite}
                title={canWrite ? 'Manage public link' : 'Akses baca saja'}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-[11px] font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <Icon name="link" className="text-geek-cyan" /> Manage public link
                </span>
                <Icon name="arrow-right" className="text-slate-400" />
              </button>
            </div>
          </section>
        </div>
      </div>

      <InputDialog
        open={createOpen}
        title="New document"
        description="Dokumen akan dibuat di root workspace aktif."
        label="Judul dokumen"
        placeholder="Contoh: Panduan onboarding"
        confirmText="Buat dokumen"
        isPending={busy}
        onOpenChange={setCreateOpen}
        onConfirm={(value) => void createDocument(value)}
      />
    </div>
  )
}
