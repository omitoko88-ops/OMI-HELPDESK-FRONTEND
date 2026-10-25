import { useEffect, useState } from 'react'
import {
  NodeViewContent,
  NodeViewWrapper,
  type NodeViewProps,
} from '@tiptap/react'
import { Selection } from '@tiptap/pm/state'
import { Plus, X } from 'lucide-react'

const MAX_TABS = 6

// NodeViewContent > (pembungkus Tiptap) > tabPanel. Pakai ">*>" supaya
// tabs yang bersarang di dalam panel tidak ikut terkena aturan ini.
const SHOW_ONLY_PANEL = [
  '[&>*>[data-type=tab-panel]:not(:nth-child(1))]:hidden',
  '[&>*>[data-type=tab-panel]:not(:nth-child(2))]:hidden',
  '[&>*>[data-type=tab-panel]:not(:nth-child(3))]:hidden',
  '[&>*>[data-type=tab-panel]:not(:nth-child(4))]:hidden',
  '[&>*>[data-type=tab-panel]:not(:nth-child(5))]:hidden',
  '[&>*>[data-type=tab-panel]:not(:nth-child(6))]:hidden',
]

export default function TabsComponent({
  node,
  editor,
  getPos,
  deleteNode,
}: NodeViewProps) {
  const [active, setActive] = useState(0)
  const current = Math.min(active, node.childCount - 1)
  const editable = editor.isEditable

  const labels: string[] = []
  node.forEach((child) => labels.push(child.attrs.label))

  const childPos = (index: number) => {
    const base = getPos()
    if (typeof base !== 'number') return null
    let pos = base + 1
    for (let i = 0; i < index; i++) pos += node.child(i).nodeSize
    return pos
  }

  // Taruh kursor di posisi teks valid pertama di dalam panel
  const focusPanel = (index: number) => {
    const pos = childPos(index)
    if (pos == null) return
    editor
      .chain()
      .focus()
      .command(({ tr, dispatch }) => {
        if (dispatch)
          tr.setSelection(Selection.near(tr.doc.resolve(pos + 1), 1))
        return true
      })
      .run()
  }

  // Tab aktif mengikuti kursor (panah, klik di dalam konten, dll.)
  useEffect(() => {
    if (!editable) return
    const sync = () => {
      const base = getPos()
      if (typeof base !== 'number') return
      const { from } = editor.state.selection
      if (from <= base || from >= base + node.nodeSize) return
      let start = base + 1
      node.forEach((child, _offset, index) => {
        if (from > start && from < start + child.nodeSize) setActive(index)
        start += child.nodeSize
      })
    }
    sync()
    editor.on('selectionUpdate', sync)
    return () => {
      editor.off('selectionUpdate', sync)
    }
  }, [editor, editable, getPos, node])

  const addTab = () => {
    const pos = childPos(node.childCount)
    if (pos == null || node.childCount >= MAX_TABS) return
    editor
      .chain()
      .insertContentAt(pos, {
        type: 'tabPanel',
        attrs: { label: `Tab ${node.childCount + 1}` },
        content: [{ type: 'paragraph' }],
      })
      .command(({ tr, dispatch }) => {
        if (dispatch)
          tr.setSelection(Selection.near(tr.doc.resolve(pos + 1), 1))
        return true
      })
      .focus()
      .run()
    setActive(node.childCount)
  }

  const removeTab = (index: number) => {
    const child = node.child(index)
    if (
      child.textContent.trim() &&
      !window.confirm('Hapus tab ini beserta isinya?')
    ) {
      return
    }
    if (node.childCount <= 1) return deleteNode() // tab terakhir = hapus seluruh blok
    const from = childPos(index)
    if (from == null) return
    editor
      .chain()
      .deleteRange({ from, to: from + child.nodeSize })
      .run()
    setActive(Math.max(0, index - 1))
  }

  const renameTab = (index: number, value: string) => {
    const pos = childPos(index)
    const label = value.trim() || 'Tab'
    if (pos == null || label === labels[index]) return
    editor
      .chain()
      .command(({ tr }) => {
        tr.setNodeMarkup(pos, undefined, { ...node.child(index).attrs, label })
        return true
      })
      .run()
  }

  return (
    <NodeViewWrapper className="my-6 rounded-xl border bg-card overflow-hidden">
      {/* Header tab */}
      <div
        contentEditable={false}
        className="flex items-center gap-1 px-2 h-11 border-b bg-muted/40 select-none overflow-x-auto"
      >
        {labels.map((label, i) => {
          const isActive = i === current
          const cls = `h-full px-3 text-sm font-medium flex items-center border-b-2 transition-colors ${
            isActive
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`

          return editable && isActive ? (
            <input
              key={`${i}-${label}`}
              defaultValue={label}
              className={`${cls} bg-transparent outline-none`}
              style={{ width: `${Math.max(label.length, 3) + 5}ch` }}
              onBlur={(e) => renameTab(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  e.currentTarget.blur()
                }
              }}
            />
          ) : (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => {
                setActive(i)
                if (editable) focusPanel(i)
              }}
            >
              {label}
            </button>
          )
        })}

        {editable && (
          <>
            <button
              type="button"
              title="Tambah tab"
              disabled={node.childCount >= MAX_TABS}
              onClick={addTab}
              className="ml-1 p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <Plus className="size-4" />
            </button>
            <button
              type="button"
              title="Hapus tab ini"
              onClick={() => removeTab(current)}
              className="p-1 rounded text-muted-foreground hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          </>
        )}
      </div>

      {/* Isi panel */}
      <NodeViewContent
        className={`p-4 ${SHOW_ONLY_PANEL[current]} [&>*>[data-type=tab-panel]>:first-child]:mt-0 [&>*>[data-type=tab-panel]>:last-child]:mb-0`}
      />
    </NodeViewWrapper>
  )
}
