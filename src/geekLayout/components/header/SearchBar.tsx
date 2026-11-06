import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { documentApi } from '@/lib/api/endpoints'
import type { DocNode } from '../../types'
import { Icon } from '../ui/Icon'

interface SearchBarProps {
  docs: DocNode[]
  workspaceId?: string
}

function flatten(nodes: DocNode[], parent = ''): Array<DocNode & { parent: string }> {
  return nodes.flatMap((node) => [
    { ...node, parent },
    ...flatten(node.children ?? [], node.title),
  ])
}

/** Global search input backed by GET /search-documents. */
export function SearchBar({ docs, workspaceId }: SearchBarProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const flatDocs = useMemo(() => flatten(docs), [docs])
  const parentById = useMemo(
    () => new Map(flatDocs.map((doc) => [doc.id, doc.title])),
    [flatDocs],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250)
    return () => window.clearTimeout(timer)
  }, [query])

  const searchQuery = useQuery({
    queryKey: ['documents', workspaceId, 'search', debouncedQuery],
    queryFn: ({ signal }) =>
      documentApi.list(workspaceId!, { search: debouncedQuery }, signal),
    enabled: Boolean(workspaceId && debouncedQuery),
  })

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []

    // Tampilkan hasil server; fallback ke pohon saat request masih berjalan.
    if (searchQuery.data) {
      return searchQuery.data.slice(0, 8).map((doc) => ({
        id: doc.id,
        title: doc.title,
        parent: parentById.get(doc.parentId ?? '') ?? (doc.parentId ? 'Sub-page' : 'Workspace root'),
      }))
    }

    return flatDocs
      .filter((doc) => doc.title.toLowerCase().includes(term))
      .slice(0, 8)
      .map((doc) => ({ id: doc.id, title: doc.title, parent: doc.parent }))
  }, [flatDocs, parentById, query, searchQuery.data])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const select = (documentId: string) => {
    navigate(`/docs/${documentId}`)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className="relative hidden md:block w-72" ref={containerRef}>
      <Icon name="magnifying-glass" className="absolute left-3 top-2 text-xs text-slate-400" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search docs or press Cmd+K..."
        className="w-full pl-8 pr-12 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-geek-cyan focus:bg-white transition-all"
      />
      <span className="absolute right-2 top-1 text-[10px] font-mono text-slate-400 border border-slate-200 rounded px-1 bg-white">
        ⌘K
      </span>

      {isOpen && query.trim() && (
        <div className="absolute left-0 top-full z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
          {searchQuery.isError ? (
            <p className="px-3 py-3 text-[11px] text-rose-600">
              {searchQuery.error instanceof Error
                ? searchQuery.error.message
                : 'Gagal mencari dokumen.'}
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-3 text-[11px] text-slate-500">
              {searchQuery.isFetching ? 'Mencari dokumen...' : 'Dokumen tidak ditemukan.'}
            </p>
          ) : (
            results.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => select(doc.id)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] text-slate-700 hover:bg-slate-100"
              >
                <Icon name="file-lines" className="text-slate-400" />
                <span className="min-w-0 flex-1 truncate">{doc.title}</span>
                <span className="truncate text-[10px] text-slate-400">{doc.parent || 'Root'}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
