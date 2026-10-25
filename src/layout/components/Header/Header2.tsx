import { Bell, CheckCircle2, Code, Eye, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

type ActiveMode = 'edit' | 'preview'
export default function Header2() {
  const [activeMode, setActiveMode] = useState<ActiveMode>('edit')
  return (
    <header className="h-14 border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-slate-500">
        <span className="hover:text-slate-800 cursor-pointer transition-colors">
          Dokumentasi
        </span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-slate-800 font-medium">Installation Guide</span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Toggle Mode */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50 text-sm">
          <button
            onClick={() => setActiveMode('edit')}
            className={`flex items-center px-3 py-1 rounded-md font-medium transition-all ${
              activeMode === 'edit'
                ? 'bg-white shadow-sm text-slate-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Code
              className={`w-4 h-4 mr-2 ${activeMode === 'edit' ? 'text-slate-500' : ''}`}
            />
            Edit
          </button>
          <button
            onClick={() => setActiveMode('preview')}
            className={`flex items-center px-3 py-1 rounded-md font-medium transition-all ${
              activeMode === 'preview'
                ? 'bg-white shadow-sm text-slate-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Eye
              className={`w-4 h-4 mr-2 ${activeMode === 'preview' ? 'text-slate-500' : ''}`}
            />
            Preview
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center text-emerald-600 text-sm font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 hidden lg:flex">
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          Saved to cloud
        </div>

        <button
          onClick={() => {}}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={() => {}}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
        <button
          onClick={() => {}}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          Publish
        </button>
      </div>
    </header>
  )
}
