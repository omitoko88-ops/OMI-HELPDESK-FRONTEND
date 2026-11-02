import { Header } from './components/header/Header'
import { MainContent } from './components/document/MainContent'
import { ShareModal } from './components/share/ShareModal'
import { Sidebar } from './components/sidebar/Sidebar'
import { ACTIVE_DOCUMENT } from './data/activeDocument'
import { ACTIVE_DOC_ID, INITIAL_DOCS } from './data/documents'
import { INITIAL_WORKSPACES } from './data/workspaces'
import { useDocumentTree } from './hooks/useDocumentTree'
import { useShareModal } from './hooks/useShareModal'
import { useWorkspaces } from './hooks/useWorkspaces'

/**
 * Root component. It owns the app-wide state (via hooks) and wires it into the
 * presentational components below. Each hook replaces a group of functions
 * from the original <script> block:
 *
 *   useWorkspaces    -> toggleWorkspaceMenu / switchWorkspace / openWorkspaceModal
 *   useDocumentTree  -> toggleDocChildren / addChildDoc / createRootDoc
 *   useShareModal    -> openShareModal / closeShareModal
 *   <ShareModal />   -> updateLinkRole / copyShareLink
 */
export default function GeekLayout() {
  const { workspaces, activeWorkspace, selectWorkspace, createWorkspace } =
    useWorkspaces(INITIAL_WORKSPACES)
  const { docs, toggleExpanded, addChild, addRoot } =
    useDocumentTree(INITIAL_DOCS)
  const shareModal = useShareModal(ACTIVE_DOCUMENT.fileName)

  // Placeholder: the original "+ Invite" button called an undefined function.
  const handleInvite = () => window.alert('Invite flow is not implemented yet.')

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={selectWorkspace}
        onCreateWorkspace={createWorkspace}
      />

      {/* Two-column workspace layout: sidebar + document view */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          docs={docs}
          activeDocId={ACTIVE_DOC_ID}
          onToggle={toggleExpanded}
          onShare={shareModal.open}
          onAddChild={addChild}
          onAddRoot={addRoot}
          onInvite={handleInvite}
        />
        <MainContent onShare={shareModal.open} />
      </div>

      {/* Rendered last so it sits above everything else (fixed + z-50) */}
      <ShareModal
        isOpen={shareModal.isOpen}
        docTitle={shareModal.docTitle}
        onClose={shareModal.close}
      />
    </div>
  )
}
