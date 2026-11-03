import type { Editor } from '@tiptap/react'

export interface TocItem {
  id: string
  pos: number // posisi node di dokumen ProseMirror, dipakai untuk scroll
  text: string
  depth: number // 1-6
}

// Baca heading langsung dari dokumen editor (bukan dari string HTML),
// sehingga TOC selalu sinkron dengan yang sedang diketik.
export function extractToc(editor: Editor): TocItem[] {
  const items: TocItem[] = []
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading' && node.textContent.trim()) {
      items.push({ id: `h-${pos}`, pos, text: node.textContent, depth: node.attrs.level ?? 1 })
    }
  })
  return items
}

export function scrollToHeading(editor: Editor, pos: number) {
  const dom = editor.view.nodeDOM(pos)
  if (dom instanceof HTMLElement) dom.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
