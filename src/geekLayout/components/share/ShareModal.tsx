import { useEffect } from 'react'
import { useWorkspaceContext } from '../../context/WorkspaceContext'
import { Icon } from '../ui/Icon'
import { CollaboratorList } from './CollaboratorList'
import { LinkAccessPanel } from './LinkAccessPanel'

interface ShareModalProps {
  isOpen: boolean
  documentId: string
  docTitle: string
  onClose: () => void
}

export function ShareModal({
  isOpen,
  documentId,
  docTitle,
  onClose,
}: ShareModalProps) {
  const { accessLevel, canWrite, canManageMembers, members } = useWorkspaceContext()

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  return (
    <div
      onClick={onClose}
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md transition-all duration-300 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-xl overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl transition-all duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-geek-cyan bg-geek-cyan/15 text-xs text-geek-cyan">
              <Icon name="share-nodes" />
            </div>
            <div>
              <span
                id="share-modal-title"
                className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-800"
              >
                // SHARE_DOCUMENT
              </span>
              <span className="font-mono text-[11px] font-bold text-geek-secondary">
                {docTitle}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-sm text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
          >
            <Icon name="xmark" />
          </button>
        </div>

        <div className="space-y-5 p-6 font-mono text-xs">
          {documentId && <LinkAccessPanel documentId={documentId} />}
          <CollaboratorList
            readOnly={!canManageMembers}
            memberCount={members.length}
          />

          <div className="flex items-center justify-between border-t border-slate-200 pt-3">
            <span className="text-[10px] text-slate-500">
              {accessLevel === 'owner'
                ? 'Anda owner workspace: akses penuh.'
                : canWrite
                  ? 'Anda editor: dapat menulis dan membagikan.'
                  : 'Anda viewer: hanya dapat membaca.'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-200 px-4 py-2 font-bold text-slate-800 transition-all hover:bg-slate-300"
            >
              DONE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
