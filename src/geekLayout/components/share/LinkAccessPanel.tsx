import { useEffect, useRef, useState } from 'react';
import type { LinkRole } from '../../types';
import { LINK_ROLE_CONFIG, LINK_ROLE_ORDER, buildShareUrl } from '../../utils/shareLinks';
import { Icon } from '../ui/Icon';

interface LinkAccessPanelProps {
  role: LinkRole;
  onRoleChange: (role: LinkRole) => void;
}

/** Role dropdown + read-only share URL with a copy button. */
export function LinkAccessPanel({ role, onRoleChange }: LinkAccessPanelProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number>();

  // The URL is derived from the role – no manual DOM updates needed.
  const shareUrl = buildShareUrl(role);

  // Clear any pending "Copied!" timer when the component unmounts.
  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const handleCopy = async () => {
    try {
      // Modern Clipboard API (replaces the deprecated document.execCommand('copy')).
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      // Inline feedback instead of the original blocking alert().
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert('Could not copy automatically – please copy the link manually.');
    }
  };

  return (
    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="link" className="text-geek-cyan text-sm" />
          <div>
            <div className="font-bold text-slate-800">Link Access Permission</div>
            <div className="text-[10px] text-slate-500">Configured default access level for anyone with link</div>
          </div>
        </div>

        {/* Controlled select: value comes from state, changes bubble up */}
        <select
          value={role}
          onChange={(event) => onRoleChange(event.target.value as LinkRole)}
          className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none focus:border-geek-cyan"
        >
          {LINK_ROLE_ORDER.map((key) => (
            <option key={key} value={key}>
              {LINK_ROLE_CONFIG[key].optionLabel}
            </option>
          ))}
        </select>
      </div>

      {/* Shareable URL */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-[11px] text-slate-600 select-all"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all shrink-0"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
