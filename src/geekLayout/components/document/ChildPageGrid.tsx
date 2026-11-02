import type { ChildPage } from '../../types';
import { Icon } from '../ui/Icon';

interface ChildPageGridProps {
  pages: ChildPage[];
}

/** Responsive 1→2 column grid of cards linking to nested pages. */
export function ChildPageGrid({ pages }: ChildPageGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
      {pages.map((page) => (
        <div
          key={page.fileName}
          className="p-3 border border-slate-200 rounded-xl bg-slate-50 hover:border-geek-secondary cursor-pointer transition-all"
        >
          <div className="font-bold text-slate-800 flex items-center justify-between">
            <span>{page.fileName}</span>
            <Icon name="arrow-right" className="text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{page.description}</p>
        </div>
      ))}
    </div>
  );
}
