import { ACTIVE_DOCUMENT } from '../../data/activeDocument';
import { Icon } from '../ui/Icon';

/** Access badge, big page title and "last edited" meta line. */
export function DocumentHeader() {
  const { title, lastEditedBy, lastEditedAgo, version } = ACTIVE_DOCUMENT;

  return (
    <div>
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold mb-3">
        <Icon name="globe" /> Link Access: Anyone with Editor Link
      </div>
      <h1 className="text-3xl font-bold text-slate-900 font-mono tracking-tight">{title}</h1>
      <p className="text-sm text-slate-500 font-mono mt-1">
        Last edited by <span className="text-slate-800 font-semibold">{lastEditedBy}</span> {lastEditedAgo} •
        Version {version}
      </p>
    </div>
  );
}
