import { CHILD_PAGES, TOKEN_RESPONSE } from '../../data/activeDocument';
import { ChildPageGrid } from './ChildPageGrid';
import { CodeBlock } from './CodeBlock';

/**
 * White "rendered markdown" card.
 * In a real app this would be produced by a markdown renderer from the page's source.
 */
export function DocumentContent() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 font-sans leading-relaxed text-slate-700">
      {/* Section 1 */}
      <h2 className="text-lg font-bold font-mono text-slate-900 border-b border-slate-100 pb-2">
        1. Protocol Handshake
      </h2>
      <p className="text-sm">
        All authentication tokens emitted within the{' '}
        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-geek-secondary font-mono text-xs">
          Quantum Lab
        </code>{' '}
        workspace utilize RS256 asymmetrical cryptographic keys. Public keys are rotated every 24 hours at the
        midnight epoch.
      </p>

      <CodeBlock request="POST /api/v2/auth/token" status="HTTP/1.1 200 OK" entries={TOKEN_RESPONSE} />

      {/* Section 2 */}
      <h2 className="text-lg font-bold font-mono text-slate-900 border-b border-slate-100 pb-2 pt-2">
        2. Sub-Pages / Child Documentation Pages
      </h2>
      <p className="text-sm text-slate-600">
        This parent document organizes {CHILD_PAGES.length} nested child documents:
      </p>

      <ChildPageGrid pages={CHILD_PAGES} />
    </div>
  );
}
