import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { documentApi, shareApi } from '@/lib/api/endpoints'
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
