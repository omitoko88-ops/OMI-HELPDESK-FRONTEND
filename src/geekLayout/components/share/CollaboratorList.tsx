import { toast } from 'sonner'
import type { WorkspaceRole } from '@/lib/api/types'
import { useWorkspaceContext } from '../../context/WorkspaceContext'
import { useMemberForm } from '../../hooks/useMemberForm'
import { Icon } from '../ui/Icon'

interface CollaboratorListProps {
  readOnly?: boolean
  memberCount?: number
}

export function CollaboratorList({
  readOnly = false,
  memberCount,
}: CollaboratorListProps) {
  const {
    owner,
    members,
    canManageMembers,
    memberMutations,
  } = useWorkspaceContext()
  const canManage = canManageMembers && !readOnly

  const form = useMemberForm({
    isPending: memberMutations.add.isPending,
    onSubmit: async ({ email, role }) => {
      await memberMutations.add.mutateAsync({ email, role })
      toast.success('Anggota berhasil ditambahkan.')
    },
  })
  const role = form.form.watch('role')

  const changeRole = async (memberId: string, nextRole: WorkspaceRole) => {
    try {
      await memberMutations.changeRole.mutateAsync({ memberId, role: nextRole })
      toast.success('Role anggota diperbarui.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengubah role.')
    }
  }

  const remove = async (memberId: string, username: string) => {
    if (!window.confirm(`Keluarkan ${username} dari workspace?`)) return
    try {
      await memberMutations.remove.mutateAsync(memberId)
      toast.success('Anggota dikeluarkan dari workspace.')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Gagal mengeluarkan anggota.',
      )
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-700">
        <span>Workspace Collaborators</span>
        <span className="text-geek-accent">
          {memberCount ?? Math.max(0, members.length - 1)} members
        </span>
      </div>

      <div className="max-h-40 space-y-2 overflow-y-auto">
        {owner && (
          <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-bold text-indigo-700">
                {owner.username.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-800">{owner.username}</p>
                <p className="truncate text-[10px] text-slate-400">{owner.email}</p>
              </div>
            </div>
            <span className="rounded border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-geek-secondary">
              Owner
            </span>
          </div>
        )}

        {members
          .filter((member) => member.role !== 'owner')
          .map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-600">
                  {member.username.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-800">{member.username}</p>
                  <p className="truncate text-[10px] text-slate-400">{member.email}</p>
                </div>
              </div>

              {canManage ? (
                <div className="flex items-center gap-1">
                  <select
                    value={member.role === 'editor' ? 'Editor' : 'Viewer'}
                    disabled={memberMutations.changeRole.isPending}
                    onChange={(event) =>
                      void changeRole(member.id, event.target.value as WorkspaceRole)
                    }
                    className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 disabled:opacity-50"
                  >
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => void remove(member.id, member.username)}
                    disabled={memberMutations.remove.isPending}
                    title="Remove member"
                    className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-50"
                  >
                    <Icon name="user-minus" />
                  </button>
                </div>
              ) : (
                <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600">
                  {member.role === 'editor' ? 'Editor' : 'Viewer'}
                </span>
              )}
            </div>
          ))}
      </div>

      {canManage && (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void form.submit()
          }}
          className="border-t border-slate-200 pt-3"
        >
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <input
                type="email"
                placeholder="user@email.com"
                autoComplete="email"
                {...form.form.register('email')}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] outline-none focus:border-geek-cyan"
              />
              {form.form.formState.errors.email && (
                <p className="mt-1 text-[10px] font-bold text-rose-600">
                  {form.form.formState.errors.email.message}
                </p>
              )}
            </div>
            <select
              {...form.form.register('role')}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11px] font-bold outline-none"
            >
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
            <button
              type="submit"
              disabled={form.isPending}
              className="rounded-lg bg-geek-secondary px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-indigo-600 disabled:opacity-40"
            >
              {form.isPending ? 'Adding...' : 'Add'}
            </button>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">
            Role default: {role}. Hanya owner yang dapat mengelola anggota.
          </p>
        </form>
      )}
    </div>
  )
}
