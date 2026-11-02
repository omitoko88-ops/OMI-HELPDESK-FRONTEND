import { TocItem } from '@/lib/parseToc'
import { useActiveVersion } from '@/stores/versionStore'
import clsx from 'clsx'
import { Sparkles } from 'lucide-react'

type TableOfContentsProps = {
  toc: TocItem[]
}

const getIndentClass = (depth: number) => {
  switch (depth) {
    case 2:
      return 'ml-4'
    case 3:
      return 'ml-8'
    case 4:
      return 'ml-12'
    case 5:
      return 'ml-16'
    case 6:
      return 'ml-20'
    default:
      return 'ml-0'
  }
}

export const TableOfContents = ({ toc }: TableOfContentsProps) => {

  // if (!toc || toc.length === 0) return null;

  return (
    <aside className="w-70 shrink-0 border-slate-200 bg-white hidden lg:flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        <h4 className="text-xs font-semibold text-slate-400 tracking-wider mb-4 uppercase">
          On this page
        </h4>
        <ul className="space-y-1">
          {toc.map((item) => (
            <li key={item.id} className={getIndentClass(item.depth)}>
              <a
                href={`#${item.id}`}
                className={clsx(
                  'hover:underline block truncate',
                  // contoh tambahan styling kalau mau highlight versi tertentu
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Auto-save Status Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
          <div className="flex items-center text-sm font-medium text-slate-700 mb-1">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
            Auto-Save Aktif
          </div>
          <p className="text-xs text-slate-500 leading-tight">
            Perubahan terakhir Anda disimpan beberapa detik yang lalu.
          </p>
        </div>
      </div>
    </aside>
  )
}
