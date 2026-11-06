import { useState } from 'react'
import { toast } from 'sonner'
import type { WorkspaceRole } from '@/lib/api/types'
import { useMemberMutations } from '../../hooks/useWorkspaceMembers'
import { useWorkspaceAccess } from '../../hooks/useWorkspaceAccess'
import { Icon } from '../ui/Icon'

interface CollaboratorListProps {
  workspaceId: string
}

export function CollaboratorList({ workspaceId }: CollaboratorListProps) {
  const { owner, members, canManageMembers } = useWorkspaceAccess(workspaceId)
  const mutations = useMemberMutations(workspaceId)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<WorkspaceRole>('Editor')

  const add = async () => {
    const value = email.trim()
    if (!value) return
    try {
      await mutations.add.mutateAsync({ email: value, role })
      setEmail('')
      toast.success('Anggota berhasil ditambahkan.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menambah anggota.')
    }
  }

  const changeRole = async (memberId: string, nextRole: WorkspaceRole) => {
    try {
      await mutations.changeRole.mutateAsync({ memberId, role: nextRole })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengubah role.')
    }
  }

  const remove = async (memberId: string, username: string) => {
    if (!window.confirm(`Keluarkan ${username} dari workspace?`)) return
    try {
      await mutations.remove.mutateAsync(memberId)
      toast.success('Anggota dikeluarkan.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengeluarkan anggota.')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-700">
        <span>Workspace Collaborators</span>
        <span className="text-geek-accent">{Math.max(0, members.length - 1)} members</span>
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

              {canManageMembers ? (
                <div className="flex items-center gap-1">
                  <select
                    value={member.role === 'editor' ? 'Editor' : 'Viewer'}
                    onChange={(event) =>
                      void changeRole(member.id, event.target.value as WorkspaceRole)
                    }
                    className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700"
                  >
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => void remove(member.id, member.username)}
                    title="Remove member"
                    className="p-1 text-slate-400 hover:text-rose-600"
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

      {canManageMembers && (
        <div className="flex items-center gap-2 border-t border-slate-200 pt-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="user@email.com"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] outline-none focus:border-geek-cyan"
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as WorkspaceRole)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11px] font-bold outline-none"
          >
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
          <button
            type="button"
            onClick={() => void add()}
            disabled={!email.trim() || mutations.isMutating}
            className="rounded-lg bg-geek-secondary px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-indigo-600 disabled:opacity-40"
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}
