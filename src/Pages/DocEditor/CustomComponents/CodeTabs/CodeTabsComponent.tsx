import { useEffect, useState } from 'react'
import {
  NodeViewContent,
  NodeViewWrapper,
  type NodeViewProps,
} from '@tiptap/react'
import { Plus, X } from 'lucide-react'

const MAX_TABS = 6

// Class harus ditulis literal supaya terdeteksi Tailwind (tidak boleh digenerate dinamis)
const SHOW_ONLY_TAB = [
  '[&_[data-type=code-tab]:not(:nth-child(1))]:hidden',
  '[&_[data-type=code-tab]:not(:nth-child(2))]:hidden',
  '[&_[data-type=code-tab]:not(:nth-child(3))]:hidden',
  '[&_[data-type=code-tab]:not(:nth-child(4))]:hidden',
  '[&_[data-type=code-tab]:not(:nth-child(5))]:hidden',
  '[&_[data-type=code-tab]:not(:nth-child(6))]:hidden',
]

export default function CodeTabsComponent({
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

  const lineCount = node.child(current).textContent.split('\n').length

  // posisi awal child ke-index di dalam dokumen
  const childPos = (index: number) => {
    const base = getPos()
    if (typeof base !== 'number') return null
    let pos = base + 1
    for (let i = 0; i < index; i++) pos += node.child(i).nodeSize
    return pos
  }

  // Kalau kursor pindah ke tab lain (panah/klik), tab aktif ikut pindah
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

    sync() // langsung cek saat komponen pertama muncul
    editor.on('selectionUpdate', sync)
    return () => {
      editor.off('selectionUpdate', sync)
    }
  }, [editor, editable, getPos, node])

  const addTab = () => {
    const pos = childPos(node.childCount) // ujung konten = setelah tab terakhir
    if (pos == null || node.childCount >= MAX_TABS) return
    editor
      .chain()
      .insertContentAt(pos, {
        type: 'codeTab',
        attrs: { label: `Tab ${node.childCount + 1}` },
      })
      .run()
    setActive(node.childCount)
  }

  const removeTab = (index: number) => {
    if (node.childCount <= 1) return deleteNode() // tab terakhir dihapus = hapus blok
    const from = childPos(index)
    if (from == null) return
    editor
      .chain()
      .deleteRange({ from, to: from + node.child(index).nodeSize })
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
    <NodeViewWrapper className="my-6 bg-[#1A1B26] rounded-xl overflow-hidden shadow-lg border border-slate-800 font-mono">
      {/* Header */}
      <div
        contentEditable={false}
        className="flex items-center justify-between px-4 h-12 border-b border-slate-700/50 bg-[#1A1B26] select-none"
      >
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>

        <div className="flex items-center h-full space-x-1">
          {labels.map((label, i) => {
            const isActive = i === current
            const cls = `h-full px-4 text-xs font-semibold flex items-center transition-colors ${
              isActive
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`

            // Di editor, tab aktif = input supaya labelnya bisa diganti langsung
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
                onClick={() => {
                  setActive(i)
                  const pos = childPos(i)
                  if (editable && pos != null)
                    editor
                      .chain()
                      .focus(pos + 1)
                      .run()
                }}
                className={cls}
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
                className="ml-2 p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30"
              >
                <Plus className="size-4" />
              </button>
              <button
                type="button"
                title="Hapus tab ini"
                onClick={() => removeTab(current)}
                className="p-1 rounded text-slate-400 hover:text-red-400"
              >
                <X className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Isi kode */}
      <div className="p-5 overflow-x-auto">
        <div className="flex text-sm leading-relaxed">
          <div
            contentEditable={false}
            className="text-slate-500 select-none pr-4 text-right border-r border-slate-700/50 mr-4"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          <NodeViewContent
            className={`text-slate-300 flex-1 min-w-0 ${SHOW_ONLY_TAB[current]}`}
          />
        </div>
      </div>
    </NodeViewWrapper>
  )
}
