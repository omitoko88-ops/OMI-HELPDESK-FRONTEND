import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { memberApi, workspaceApi } from '@/lib/api/endpoints'
import type { WorkspaceDto } from '@/lib/api/types'
import type { Workspace } from '../types'

const ACTIVE_WORKSPACE_KEY = 'omi-active-workspace'

const toWorkspace = (dto: WorkspaceDto, relation: 'owner' | 'member'): Workspace => ({
  id: dto.id,
  name: dto.name,
  label: dto.name,
  icon: relation === 'owner' ? 'cubes' : 'users',
  iconClass: relation === 'owner' ? 'text-geek-secondary' : 'text-geek-cyan',
  badge: relation === 'owner' ? 'Owner' : 'Member',
  badgeClass:
    relation === 'owner'
      ? 'bg-indigo-100 text-indigo-700'
      : 'bg-sky-100 text-sky-700',
  relation,
})

/** Workspace list + active selection, seluruhnya bersumber dari API. */
export function useWorkspaces() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['workspaces'],
    queryFn: ({ signal }) => workspaceApi.mine(signal),
  })

  const workspaces = useMemo(() => {
    const owned = (query.data?.ownedWorkspaces ?? []).map((w) => toWorkspace(w, 'owner'))
    const joined = (query.data?.joinedWorkspaces ?? []).map((w) => toWorkspace(w, 'member'))
    return [...owned, ...joined]
  }, [query.data])

  const [activeId, setActiveId] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem(ACTIVE_WORKSPACE_KEY) ?? ''
  })

  const activeWorkspace =
    workspaces.find((workspace) => workspace.id === activeId) ?? workspaces[0] ?? null

  const detail = useQuery({
    queryKey: ['workspace', activeWorkspace?.id],
    queryFn: ({ signal }) => workspaceApi.get(activeWorkspace!.id, signal),
    enabled: Boolean(activeWorkspace?.id),
    placeholderData: (previousData, previousQuery) => {
      const previousId = previousQuery?.queryKey[1]
      return previousId === activeWorkspace?.id ? previousData : undefined
    },
  })

  useEffect(() => {
    if (activeWorkspace && activeWorkspace.id !== activeId) {
      setActiveId(activeWorkspace.id)
    }
    if (activeWorkspace) {
      localStorage.setItem(ACTIVE_WORKSPACE_KEY, activeWorkspace.id)
    }
  }, [activeId, activeWorkspace])

  const selectWorkspace = (id: string) => {
    setActiveId(id)
    localStorage.setItem(ACTIVE_WORKSPACE_KEY, id)
  }

  const invalidateWorkspaces = () =>
    queryClient.invalidateQueries({ queryKey: ['workspaces'] })

  const createMutation = useMutation({
    mutationFn: (name: string) => workspaceApi.create(name),
    onSuccess: async (created) => {
      selectWorkspace(created.id)
      await invalidateWorkspaces()
    },
  })

  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      workspaceApi.rename(id, name),
    onSuccess: invalidateWorkspaces,
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => workspaceApi.remove(id),
    onSuccess: async (_data, id) => {
      if (activeId === id) {
        const remaining = workspaces.filter((workspace) => workspace.id !== id)
        if (remaining[0]) selectWorkspace(remaining[0].id)
        else setActiveId('')
      }
      await invalidateWorkspaces()
    },
  })

  const leave = useMutation({
    mutationFn: (id: string) => memberApi.leave(id),
    onSuccess: async (_data, id) => {
      if (activeId === id) {
        const remaining = workspaces.filter((workspace) => workspace.id !== id)
        if (remaining[0]) selectWorkspace(remaining[0].id)
        else setActiveId('')
      }
      await invalidateWorkspaces()
      await queryClient.invalidateQueries({ queryKey: ['documents'] })
      await queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })

  return {
    ...query,
    workspaces,
    activeWorkspace,
    selectWorkspace,
    createWorkspace: createMutation.mutateAsync,
    renameWorkspace: renameMutation.mutateAsync,
    deleteWorkspace: removeMutation.mutateAsync,
    leaveWorkspace: leave.mutateAsync,
    detail,
    error: query.error,
    isMutating:
      createMutation.isPending ||
      renameMutation.isPending ||
      removeMutation.isPending ||
      leave.isPending,
  }
}
