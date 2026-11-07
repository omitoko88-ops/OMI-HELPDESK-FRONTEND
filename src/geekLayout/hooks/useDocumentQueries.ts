import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { documentApi, publicApi, shareApi } from '@/lib/api/endpoints'
import type { UpdateDocumentInput, UpsertShareInput } from '@/lib/api/types'

export function useDocument(documentId: string | undefined) {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: ({ signal }) => documentApi.get(documentId!, signal),
    enabled: Boolean(documentId),
  })
}

export function useDocumentShare(documentId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['share', documentId],
    queryFn: ({ signal }) => shareApi.get(documentId!, signal),
    enabled: Boolean(documentId) && enabled,
  })
}

export function useWorkspaceDocuments(
  workspaceId: string | undefined,
  query?: { search?: string; parentId?: string },
  enabled = true,
) {
  return useQuery({
    queryKey: ['documents', workspaceId, 'search', query?.search ?? '', query?.parentId ?? ''],
    queryFn: ({ signal }) => documentApi.list(workspaceId!, query, signal),
    enabled: Boolean(workspaceId) && enabled,
  })
}

export function usePublicShare(token: string) {
  return useQuery({
    queryKey: ['public-document', token],
    queryFn: ({ signal }) => publicApi.root(token, signal),
    enabled: Boolean(token),
  })
}

export function usePublicPage(token: string, documentId: string | undefined) {
  return useQuery({
    queryKey: ['public-document', token, 'page', documentId],
    queryFn: ({ signal }) => publicApi.page(token, documentId!, signal),
    enabled: Boolean(token && documentId),
  })
}

export function useUpdatePublicPage(token: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { id: string; title: string; content: string | null }) =>
      publicApi.updatePage(token, input.id, {
        title: input.title,
        content: input.content,
      }),
    onSuccess: async (_page, input) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['public-document', token] }),
        queryClient.invalidateQueries({
          queryKey: ['public-document', token, 'page', input.id],
        }),
      ])
    },
  })
}

export function useShareMutations(documentId: string | undefined) {
  const queryClient = useQueryClient()
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['share', documentId] })

  const save = useMutation({
    mutationFn: (body: UpsertShareInput) => shareApi.upsert(documentId!, body),
    onSuccess: invalidate,
  })
  const regenerate = useMutation({
    mutationFn: () => shareApi.regenerate(documentId!),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: () => shareApi.remove(documentId!),
    onSuccess: invalidate,
  })

  const shareUrl = (shareToken: string | null) =>
    shareToken ? `${window.location.origin}/share/${shareToken}` : ''

  return { save, regenerate, remove, shareUrl }
}

/** Satu pintu untuk data share yang dipakai modal: query + mutation + URL. */
export function useDocumentShareState(
  documentId: string | undefined,
  enabled = true,
) {
  const query = useDocumentShare(documentId, enabled)
  const mutations = useShareMutations(documentId)
  return { query, ...mutations }
}

export function useSaveDocument(documentId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateDocumentInput) =>
      documentApi.update(documentId!, body),
    onSuccess: async (document) => {
      queryClient.setQueryData(['document', documentId], document)
      await queryClient.invalidateQueries({ queryKey: ['documents'] })
      await queryClient.invalidateQueries({ queryKey: ['workspace'] })
      await queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })
}

export function useDocumentActions(documentId: string | undefined) {
  const queryClient = useQueryClient()
  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['documents'] })
    await queryClient.invalidateQueries({ queryKey: ['workspace'] })
    await queryClient.invalidateQueries({ queryKey: ['members'] })
  }

  const move = useMutation({
    mutationFn: (parentId: string | null) => documentApi.move(documentId!, { parentId }),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: () => documentApi.remove(documentId!),
    onSuccess: invalidate,
  })

  return { move, remove }
}
