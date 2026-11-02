import { ACTIVE_DOCUMENT } from '../../data/activeDocument';

/** Console-style footer: sync status + role on the left, document id on the right. */
export function StatusBar() {
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 font-mono text-xs flex justify-between items-center text-slate-500">
      <div className="flex items-center gap-3">
        <span className="text-geek-accent font-bold">● WS SYNC ACTIVE</span>
        <span>
          Role: <strong className="text-slate-800">{ACTIVE_DOCUMENT.role}</strong>
        </span>
      </div>
      <div>
        Doc ID: <span className="text-slate-700 font-bold">{ACTIVE_DOCUMENT.docId}</span>
      </div>
    </div>
  );
}
