import { Link } from 'react-router'
import { TiptapViewer } from '@/Pages/DocViewer/TiptapViewerHtml'
import type { DocumentTreeNode } from '@/lib/api/types'
import { Icon } from '../ui/Icon'

interface DocumentContentProps {
  content: string | null
  children?: DocumentTreeNode[]
  canWrite?: boolean
}

export function DocumentContent({ content, children = [], canWrite = false }: DocumentContentProps) {
  return (
    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 font-sans leading-relaxed text-slate-700 shadow-sm">
      {content ? (
        <TiptapViewer html={content} editable={false} />
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <Icon name="file-lines" className="mb-2 text-2xl text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">Dokumen ini belum memiliki isi.</p>
          <p className="mt-1 text-xs text-slate-400">
            {canWrite
              ? 'Buka editor untuk mulai menulis dokumentasi.'
              : 'Hubungi editor workspace jika halaman ini perlu diisi.'}
          </p>
        </div>
      )}

      {children.length > 0 && (
        <div className="border-t border-slate-100 pt-5">
          <h2 className="mb-3 font-mono text-sm font-bold text-slate-900">
            Sub-pages ({children.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 font-mono text-xs sm:grid-cols-2">
            {children.map((child) => (
              <Link
                key={child.id}
                to={`/docs/${child.id}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 transition-all hover:border-geek-secondary hover:bg-white"
              >
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="truncate">{child.title}</span>
                  <Icon name="arrow-right" className="text-slate-400" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {child.children.length} nested page{child.children.length === 1 ? '' : 's'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
