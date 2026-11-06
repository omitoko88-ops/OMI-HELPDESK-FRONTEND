import type { DocumentDto } from '@/lib/api/types'

interface StatusBarProps {
  document: DocumentDto
  accessLabel: string
}

export function StatusBar({ document, accessLabel }: StatusBarProps) {
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 font-mono text-xs flex justify-between items-center text-slate-500">
      <div className="flex items-center gap-3">
        <span className="text-geek-accent font-bold">● API CONNECTED</span>
        <span>
          Role: <strong className="text-slate-800">{accessLabel}</strong>
        </span>
      </div>
      <div>
        Doc ID: <span className="text-slate-700 font-bold">{document.id}</span>
      </div>
    </div>
  )
}
