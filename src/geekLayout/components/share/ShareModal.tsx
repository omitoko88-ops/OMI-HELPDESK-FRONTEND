import { useEffect, useState } from 'react';
import type { LinkRole } from '../../types';
import { LINK_ROLE_CONFIG } from '../../utils/shareLinks';
import { Icon } from '../ui/Icon';
import { CollaboratorList } from './CollaboratorList';
import { LinkAccessPanel } from './LinkAccessPanel';

interface ShareModalProps {
  isOpen: boolean;
  /** Title of the document being shared (shown under the modal heading). */
  docTitle: string;
  onClose: () => void;
}

/**
 * Share & role configuration dialog.
 *
 * The modal is always mounted and animated purely with CSS:
 *  - closed: `invisible opacity-0` (card is `scale-95`)
 *  - open:   `visible opacity-100` (card is `scale-100`)
 * Tailwind's `transition-all` animates between the two, which replaces the
 * original setTimeout-based class juggling.
 */
export function ShareModal({ isOpen, docTitle, onClose }: ShareModalProps) {
  // Selected link-sharing level. It's kept here because both the panel and the footer use it.
  const [linkRole, setLinkRole] = useState<LinkRole>('editor');
  const notice = LINK_ROLE_CONFIG[linkRole];

  // Accessibility nicety: close on Escape while the modal is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    // Backdrop – clicking it (but not the card) closes the modal
    <div
      onClick={onClose}
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      {/* Card – stopPropagation so clicks inside don't hit the backdrop handler */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-lg bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-geek-cyan/15 border border-geek-cyan flex items-center justify-center text-geek-cyan text-xs">
              <Icon name="share-nodes" />
            </div>
            <div>
              <span
                id="share-modal-title"
                className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wider block"
              >
                // SHARE_DOCUMENT_CONFIG
              </span>
              <span className="text-[11px] font-mono text-geek-secondary font-bold">{docTitle}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-700 text-sm w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Icon name="xmark" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 font-mono text-xs">
          <LinkAccessPanel role={linkRole} onRoleChange={setLinkRole} />
          <CollaboratorList />

          {/* Footer: live status text + Done button */}
          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
            <span className={`text-[10px] font-bold ${notice.noticeClass}`}>{notice.notice}</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 font-bold transition-all"
            >
              DONE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
