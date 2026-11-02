import type { DocNode } from '../../types';
import { Icon } from '../ui/Icon';

interface DocumentNodeProps {
  doc: DocNode;
  /** Id of the document open in the main panel (gets the "ACTIVE" styling). */
  activeDocId: string;
  onToggle: (docId: string) => void;
  onShare: (title: string) => void;
  onAddChild: (parentId: string) => void;
}

/** Shared styling for the small icon buttons that appear on a row. */
const SHARE_BTN = 'p-1 text-slate-400 hover:text-geek-cyan';
const ADD_BTN = 'p-1 text-slate-400 hover:text-geek-accent';

/**
 * One top-level entry of the tree. Renders either:
 *  - a parent (chevron, hover actions, collapsible list of children), or
 *  - a leaf document (just an icon, title and share button).
 * The tree is only one level deep, matching the original design.
 */
export function DocumentNode({ doc, activeDocId, onToggle, onShare, onAddChild }: DocumentNodeProps) {
  const isParent = doc.children !== undefined;
  const isExpanded = doc.expanded ?? false;

  // A parent is "highlighted" when the open document lives inside it.
  const containsActive = doc.children?.some((child) => child.id === activeDocId) ?? false;

  // ----- Leaf document -----
  if (!isParent) {
    return (
      <div className="doc-node group">
        <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-800 cursor-pointer transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <Icon name={doc.icon} className={doc.iconClass} />
            <span className="truncate">{doc.title}</span>
          </div>
          <button
            type="button"
            onClick={() => onShare(doc.title)}
            title="Share Config"
            className={`opacity-0 group-hover:opacity-100 ${SHARE_BTN}`}
          >
            <Icon name="share-nodes" />
          </button>
        </div>
      </div>
    );
  }

  // ----- Parent document -----
  return (
    <div className="doc-node group">
      {/* Parent row */}
      <div
        className={`flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-800 cursor-pointer transition-colors ${
          containsActive ? 'bg-white shadow-sm border border-slate-200' : ''
        }`}
      >
        {/* Clicking the left side expands / collapses the children */}
        <div className="flex items-center gap-2 min-w-0" onClick={() => onToggle(doc.id)}>
          <Icon
            name="chevron-down"
            // Rotated while collapsed, same as the original `rotate-90` toggle.
            className={`text-[10px] text-slate-400 transition-transform ${isExpanded ? '' : 'rotate-90'}`}
          />
          <Icon name={doc.icon} className={doc.iconClass} />
          <span className={`truncate ${containsActive ? 'font-bold text-geek-secondary' : 'font-semibold'}`}>
            {doc.title}
          </span>
        </div>

        {/* Action buttons: always visible on the active branch, otherwise on hover */}
        <div
          className={`flex items-center gap-1 ${
            containsActive ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity'
          }`}
        >
          <button type="button" onClick={() => onShare(doc.title)} title="Share Config" className={SHARE_BTN}>
            <Icon name="share-nodes" />
          </button>
          <button type="button" onClick={() => onAddChild(doc.id)} title="Add Child Doc" className={ADD_BTN}>
            <Icon name="plus" />
          </button>
        </div>
      </div>

      {/* Children list with the vertical guide line */}
      {isExpanded && (
        <div className="pl-4 ml-2 border-l border-slate-300 space-y-1 mt-1">
          {doc.children!.map((child) =>
            child.id === activeDocId ? (
              // Active child: highlighted, "ACTIVE" badge, no share button
              <div
                key={child.id}
                className="flex items-center justify-between p-1 rounded-lg bg-indigo-50/70 text-indigo-900 font-bold cursor-pointer border border-indigo-100"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon name={child.icon} className={child.iconClass} />
                  <span className="truncate">{child.title}</span>
                </div>
                <span className="text-[9px] bg-indigo-200 text-indigo-800 px-1 rounded font-mono">ACTIVE</span>
              </div>
            ) : (
              // Regular child: share button revealed on hover (named group `group/child`)
              <div
                key={child.id}
                className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-200/70 text-slate-700 cursor-pointer group/child"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon name={child.icon} className={child.iconClass} />
                  <span className="truncate">{child.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onShare(child.title)}
                  title="Share"
                  className={`opacity-0 group-hover/child:opacity-100 ${SHARE_BTN}`}
                >
                  <Icon name="share-nodes" />
                </button>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
