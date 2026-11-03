import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Editor } from '@tiptap/react'
import { TocItem } from '@/Pages/DocEditor/extractToc'

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error' | 'denied'
export type EditMode = 'edit' | 'preview'

// State UI lintas komponen (header, TOC, sidebar) yang BUKAN data server.
// Data server tetap di react-query. Menyimpan DATA di sini (bukan JSX),
// jadi tidak ada lagi setTableContent(<TableOfContents/>) yang memicu re-render berantai.
interface DocUiState {
  mode: EditMode
  toc: TocItem[]
  editor: Editor | null
  saveStatus: SaveStatus
  lastSavedAt: number | null
  setMode: (m: EditMode) => void
  setToc: (t: TocItem[]) => void
  setEditor: (e: Editor | null) => void
  setSaveStatus: (s: SaveStatus) => void
}

export const useDocUiStore = create<DocUiState>((set) => ({
  mode: 'edit',
  toc: [],
  editor: null,
  saveStatus: 'idle',
  lastSavedAt: null,
  setMode: (mode) => set({ mode }),
  setToc: (toc) => set({ toc }),
  setEditor: (editor) => set({ editor }),
  setSaveStatus: (saveStatus) =>
    set((s) => ({ saveStatus, lastSavedAt: saveStatus === 'saved' ? Date.now() : s.lastSavedAt })),
}))

// Folder pohon yang terbuka diingat antar sesi
interface TreeState {
  expanded: Record<number, boolean>
  setExpanded: (id: number, open: boolean) => void
  expandMany: (ids: number[]) => void
}

export const useTreeStore = create<TreeState>()(
  persist(
    (set) => ({
      expanded: {},
      setExpanded: (id, open) => set((s) => ({ expanded: { ...s.expanded, [id]: open } })),
      expandMany: (ids) =>
        set((s) => ({ expanded: { ...s.expanded, ...Object.fromEntries(ids.map((i) => [i, true])) } })),
    }),
    { name: 'omi-tree' },
  ),
)
