import { useMutation, useQueryClient } from '@tanstack/react-query'
import { memberApi } from '@/lib/api/endpoints'
import type { WorkspaceRole } from '@/lib/api/types'

export function useMemberMutations(workspaceId: string | undefined) {
  const queryClient = useQueryClient()
  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['members', workspaceId] })
    await queryClient.invalidateQueries({ queryKey: ['workspaces'] })
  }

  const add = useMutation({
    mutationFn: ({ email, role }: { email: string; role: WorkspaceRole }) =>
      memberApi.add(workspaceId!, { email, role }),
    onSuccess: invalidate,
  })
  const changeRole = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: WorkspaceRole }) =>
      memberApi.changeRole(workspaceId!, memberId, role),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: (memberId: string) => memberApi.remove(workspaceId!, memberId),
    onSuccess: invalidate,
  })
  const leave = useMutation({
    mutationFn: () => memberApi.leave(workspaceId!),
    onSuccess: async () => {
      await invalidate()
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      await queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  return { add, changeRole, remove, leave, isMutating: add.isPending || changeRole.isPending || remove.isPending || leave.isPending }
}
