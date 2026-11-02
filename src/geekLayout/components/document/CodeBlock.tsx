import { Fragment } from 'react';
import type { JsonEntry } from '../../types';

interface CodeBlockProps {
  /** Request line, e.g. "POST /api/v2/auth/token". */
  request: string;
  /** Response status, e.g. "HTTP/1.1 200 OK". */
  status: string;
  /** Key/value pairs rendered as a syntax-highlighted JSON object. */
  entries: JsonEntry[];
}

/** Tailwind color per kind of JSON value (mimics editor syntax highlighting). */
const VALUE_COLORS: Record<JsonEntry['kind'], string> = {
  string: 'text-emerald-300',
  secret: 'text-amber-300',
  number: 'text-purple-400',
};

/** Dark "terminal" card that shows an HTTP request line, status and a JSON body. */
export function CodeBlock({ request, status, entries }: CodeBlockProps) {
  return (
    <div className="rounded-xl bg-[#0f172a] p-4 text-xs font-mono text-slate-200 shadow-md">
      {/* Title bar */}
      <div className="flex justify-between items-center text-slate-400 pb-2 mb-2 border-b border-slate-800 text-[11px]">
        <span>{request}</span>
        <span className="text-emerald-400">{status}</span>
      </div>

      {/* <pre> preserves whitespace, so newlines/indentation are written explicitly. */}
      <pre>
        <code className="text-slate-300">
          {'{'}
          {'\n'}
          {entries.map((entry, index) => (
            <Fragment key={entry.key}>
              {'  '}
              <span className="text-cyan-400">{`"${entry.key}"`}</span>
              {': '}
              <span className={VALUE_COLORS[entry.kind]}>
                {/* Numbers are printed bare, strings are quoted */}
                {entry.kind === 'number' ? entry.value : `"${entry.value}"`}
              </span>
              {/* No trailing comma after the last property */}
              {index < entries.length - 1 ? ',' : ''}
              {'\n'}
            </Fragment>
          ))}
          {'}'}
        </code>
      </pre>
    </div>
  );
}
