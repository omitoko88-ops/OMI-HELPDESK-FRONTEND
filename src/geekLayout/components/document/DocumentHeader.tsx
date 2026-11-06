import { Link } from 'react-router'
import type { DocumentDto } from '@/lib/api/types'
import { Icon } from '../ui/Icon'

interface DocumentHeaderProps {
  document: DocumentDto
  accessLabel: string
  updatedLabel: string
}

export function DocumentHeader({ document, accessLabel, updatedLabel }: DocumentHeaderProps) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold mb-3">
        <Icon name="shield-halved" /> Access: {accessLabel}
      </div>
      <h1 className="text-3xl font-bold text-slate-900 font-mono tracking-tight">
        {document.title}
      </h1>
      <p className="text-sm text-slate-500 font-mono mt-1 flex flex-wrap items-center gap-x-2">
        <span>Updated {updatedLabel}</span>
        <span>•</span>
        <span>ID {document.id}</span>
        <span>•</span>
        <Link to={`/edit/${document.id}`} className="text-geek-secondary hover:underline">
          Open editor
        </Link>
      </p>
    </div>
  )
}
