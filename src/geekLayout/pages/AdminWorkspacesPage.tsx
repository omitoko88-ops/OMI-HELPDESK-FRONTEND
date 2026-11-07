import { Link } from 'react-router'
import { Icon } from '../components/ui/Icon'
import { useAdminWorkspaces } from '../hooks/useAdminWorkspaces'

export function AdminWorkspacesPage() {
  const workspaces = useAdminWorkspaces()

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-geek-secondary">
            // ADMIN_WORKSPACES
          </p>
          <h1 className="mt-1 font-mono text-2xl font-bold text-slate-900">All workspaces</h1>
          <p className="mt-1 text-xs text-slate-500">
            Daftar workspace dari endpoint admin OMI Helpdesk API.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void workspaces.refetch()}
          disabled={workspaces.isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-[11px] font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <Icon name="rotate" className={workspaces.isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 font-mono text-[11px] leading-relaxed text-amber-800">
        <strong>Peringatan keamanan:</strong> endpoint <code>GET /api/Admin/get-all-workspaces</code>{' '}
        belum dilindungi role Admin di backend. Jangan aktifkan halaman ini di produksi sebelum
        atribut <code>[Authorize(Roles = "Admin")]</code> diaktifkan.
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_180px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <span>Workspace</span>
          <span>Created</span>
        </div>

        {workspaces.isLoading && (
          <div className="space-y-2 p-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-9 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        )}

        {workspaces.isError && (
          <div className="p-5 text-sm text-rose-700">
            {workspaces.error instanceof Error
              ? workspaces.error.message
              : 'Gagal memuat seluruh workspace.'}
          </div>
        )}

        {workspaces.data?.map((workspace) => (
          <div
            key={workspace.id}
            className="grid grid-cols-[1fr_180px] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                <Icon name="cubes" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-mono text-xs font-bold text-slate-800">
                  {workspace.name}
                </p>
                <p className="truncate font-mono text-[10px] text-slate-400">{workspace.id}</p>
              </div>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              {new Date(workspace.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}

        {!workspaces.isLoading && workspaces.data?.length === 0 && (
          <div className="p-8 text-center">
            <Icon name="cubes" className="mb-2 text-3xl text-slate-300" />
            <p className="text-sm text-slate-500">Belum ada workspace di database.</p>
          </div>
        )}
      </section>

      <Link to="/" className="inline-flex font-mono text-xs font-bold text-geek-secondary hover:underline">
        Kembali ke overview
      </Link>
    </div>
  )
}
