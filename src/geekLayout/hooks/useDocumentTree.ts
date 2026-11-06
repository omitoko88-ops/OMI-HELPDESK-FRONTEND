import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { documentApi } from '@/lib/api/endpoints'
import type { DocumentTreeNode } from '@/lib/api/types'
import { useTreeStore } from '@/stores/docUiStore'
import type { DocNode } from '../types'

const toDocNode = (node: DocumentTreeNode, expanded: Record<string, boolean>): DocNode => ({
  id: node.id,
  parentId: node.parentId,
  title: node.title,
  icon: node.children.length > 0 ? 'book' : 'file-code',
  iconClass: node.children.length > 0 ? 'text-geek-secondary' : 'text-slate-400',
  expanded: node.children.length > 0 ? (expanded[node.id] ?? true) : undefined,
  children:
    node.children.length > 0
      ? node.children.map((child) => toDocNode(child, expanded))
      : undefined,
})

/** Pohon dokumen server + aksi CRUD yang langsung menyegarkan cache. */
export function useDocumentTree(workspaceId: string | undefined) {
  const queryClient = useQueryClient()
  const expanded = useTreeStore((state) => state.expanded)
  const setExpanded = useTreeStore((state) => state.setExpanded)

  const query = useQuery({
    queryKey: ['documents', workspaceId, 'tree'],
    queryFn: ({ signal }) => documentApi.tree(workspaceId!, signal),
    enabled: Boolean(workspaceId),
  })

  const docs = useMemo(
    () => (query.data ?? []).map((node) => toDocNode(node, expanded)),
    [expanded, query.data],
  )

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['documents', workspaceId] })
    await queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] })
  }

  const createMutation = useMutation({
    mutationFn: (input: { title: string; parentId?: string | null }) =>
      documentApi.create(workspaceId!, input),
    onSuccess: async (document) => {
      if (document.parentId) setExpanded(document.parentId, true)
      await invalidate()
    },
  })

  const moveMutation = useMutation({
    mutationFn: (input: { documentId: string; parentId: string | null }) =>
      documentApi.move(input.documentId, { parentId: input.parentId }),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => documentApi.remove(documentId),
    onSuccess: invalidate,
  })

  return {
    ...query,
    docs,
    toggleExpanded: (docId: string) => setExpanded(docId, !(expanded[docId] ?? true)),
    addChild: async (parentId: string, title: string) => {
      setExpanded(parentId, true)
      return createMutation.mutateAsync({ title, parentId })
    },
    addRoot: (title: string) => createMutation.mutateAsync({ title, parentId: null }),
    moveDocument: (documentId: string, parentId: string | null) =>
      moveMutation.mutateAsync({ documentId, parentId }),
    deleteDocument: (documentId: string) => deleteMutation.mutateAsync(documentId),
    isMutating:
      createMutation.isPending || moveMutation.isPending || deleteMutation.isPending,
  }
}
