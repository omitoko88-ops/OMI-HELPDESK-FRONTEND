import { createContext, type ReactNode, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/lib/api/endpoints'
import { useAuthStore } from '@/stores/authStore'
import {
  useDocumentShareState,
  useWorkspaceDocuments,
} from '../hooks/useDocumentQueries'
import { useDocumentTree } from '../hooks/useDocumentTree'
import { useShareModal } from '../hooks/useShareModal'
import { useWorkspaceAccess } from '../hooks/useWorkspaceAccess'
import { useMemberMutations } from '../hooks/useWorkspaceMembers'
import { useWorkspaces } from '../hooks/useWorkspaces'

export type WorkspaceContextValue = ReturnType<typeof useWorkspaceContextValue>

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

function useWorkspaceContextValue() {
  const token = useAuthStore((state) => state.token)
  const workspaceState = useWorkspaces()
  const { activeWorkspace, workspaces } = workspaceState
  const activeWorkspaceId = activeWorkspace?.id

  const tree = useDocumentTree(activeWorkspaceId)
  const access = useWorkspaceAccess(activeWorkspaceId)
  const documentList = useWorkspaceDocuments(activeWorkspaceId)
  const memberMutations = useMemberMutations(activeWorkspaceId)
  const shareModal = useShareModal()

  const session = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: ({ signal }) => authApi.me(signal),
    enabled: Boolean(token),
  })

  const canWrite = access.access === 'owner' || access.access === 'editor'
  const share = useDocumentShareState(
    shareModal.target.id || undefined,
    shareModal.isOpen && canWrite,
  )

  return {
    workspaceState,
    workspaces,
    activeWorkspace,
    workspaceDetail: workspaceState.detail,
    tree,
    docs: tree.docs,
    documents: documentList,
    access,
    accessLevel: access.access,
    members: access.members,
    memberMutations,
    owner: access.owner,
    canWrite,
    canManageMembers: access.access === 'owner',
    shareModal,
    share,
  shareQuery: share.query,
    session,
    openShare: (documentId: string, title: string) => shareModal.open(documentId, title),
    refreshDocs: () => void tree.refetch(),
    selectWorkspace: workspaceState.selectWorkspace,
    adminViewEnabled: import.meta.env.VITE_ENABLE_ADMIN_VIEW === 'true',
  }
}

export function WorkspaceContextProvider({ children }: { children: ReactNode }) {
  const value = useWorkspaceContextValue()
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspaceContext must be used within WorkspaceContextProvider')
  }
  return context
}
