import { ACTIVE_DOCUMENT } from '../../data/activeDocument';
import { Icon } from '../ui/Icon';

interface DocumentToolbarProps {
  onShare: (title: string) => void;
}

/** Breadcrumb trail on the left, "Share" and "Edit" actions on the right. */
export function DocumentToolbar({ onShare }: DocumentToolbarProps) {
  const { workspaceName, parentTitle, fileName } = ACTIVE_DOCUMENT;

  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-4 font-mono text-xs">
      {/* Breadcrumbs: Workspace / Parent / Current file */}
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-geek-secondary font-bold">{workspaceName}</span>
        <span>/</span>
        <span>{parentTitle}</span>
        <span>/</span>
        <span className="text-slate-900 font-bold">{fileName}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onShare(fileName)}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-bold flex items-center gap-1.5 transition-all"
        >
          <Icon name="share-nodes" className="text-geek-cyan" />
          <span>Share Document</span>
        </button>

        <button
          type="button"
          className="px-3 py-1.5 bg-geek-secondary text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm hover:bg-indigo-600 transition-all"
        >
          <Icon name="pen" className="text-xs" />
          <span>Edit Page</span>
        </button>
      </div>
    </div>
  );
}
