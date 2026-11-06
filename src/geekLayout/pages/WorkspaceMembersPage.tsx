import { Link, useOutletContext } from 'react-router'
import type { LayoutOutletContext } from '../GeekLayout'
import { Icon } from '../components/ui/Icon'
import { CollaboratorList } from '../components/share/CollaboratorList'

export function WorkspaceMembersPage() {
  const { activeWorkspace, access, members } = useOutletContext<LayoutOutletContext>()

  if (!activeWorkspace) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <Icon name="users" className="text-4xl text-slate-300" />
        <h1 className="font-mono text-lg font-bold text-slate-800">Belum ada workspace</h1>
        <p className="max-w-md text-sm text-slate-500">
          Buat workspace terlebih dahulu untuk mengundang anggota.
        </p>
        <Link to="/" className="text-sm font-bold text-geek-secondary hover:underline">
          Kembali ke overview
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-geek-secondary">
          // WORKSPACE_MEMBERS
        </p>
        <h1 className="mt-1 font-mono text-2xl font-bold text-slate-900">{activeWorkspace.name}</h1>
        <p className="mt-1 text-xs text-slate-500">
          {members.length} orang memiliki akses · akses Anda {access}
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <CollaboratorList workspaceId={activeWorkspace.id} />
      </section>

      {access !== 'owner' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 font-mono text-[11px] leading-relaxed text-amber-800">
          Hanya owner workspace yang dapat menambah anggota, mengubah role, atau mengeluarkan
          anggota. Anda tetap dapat melihat daftar anggota yang memiliki akses.
        </div>
      )}
    </div>
  )
}
