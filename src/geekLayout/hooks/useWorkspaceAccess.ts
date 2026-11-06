import { useQuery } from '@tanstack/react-query'
import { memberApi } from '@/lib/api/endpoints'
import { getJwtUser } from '@/lib/jwt'
import { useAuthStore } from '@/stores/authStore'
import type { Collaborator, WorkspaceAccess } from '../types'

/**
 * Akses workspace dihitung dari daftar member API.
 *
 * Catatan penting: userId dari API adalah HashId, sedangkan claim JWT berisi
 * angka. Karena itu identitas dicocokkan lewat username/email (yang unik),
 * bukan dengan membandingkan kedua format ID tersebut.
 */
export function useWorkspaceAccess(workspaceId: string | undefined) {
  const token = useAuthStore((state) => state.token)
  const jwtUser = getJwtUser(token)

  const query = useQuery({
    queryKey: ['members', workspaceId],
    queryFn: ({ signal }) => memberApi.list(workspaceId!, signal),
    enabled: Boolean(workspaceId),
  })

  const members: Collaborator[] = query.data
    ? [
        {
          id: 'owner',
          userId: query.data.owner.id,
          username: query.data.owner.username,
          email: query.data.owner.email,
          role: 'owner',
          joinedAt: undefined,
        },
        ...query.data.members.map((member) => ({
          id: member.id,
          userId: member.userId,
          username: member.username,
          email: member.email,
          role: member.role.toLowerCase() as 'editor' | 'viewer',
          joinedAt: member.joinedAt,
        })),
      ]
    : []

  const normalizedUsername = jwtUser.username.trim().toLowerCase()
  const normalizedEmail = jwtUser.email.trim().toLowerCase()
  const current = members.find(
    (member) =>
      member.username.trim().toLowerCase() === normalizedUsername ||
      (normalizedEmail.length > 0 && member.email.trim().toLowerCase() === normalizedEmail),
  )

  const access: WorkspaceAccess =
    current?.role === 'owner'
      ? 'owner'
      : current?.role === 'editor'
        ? 'editor'
        : current?.role === 'viewer'
          ? 'viewer'
          : 'none'

  return {
    ...query,
    owner: query.data?.owner ?? null,
    members,
    currentMember: current ?? null,
    access,
    canWrite: access === 'owner' || access === 'editor',
    canManageMembers: access === 'owner',
  }
}
