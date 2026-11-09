import { useEffect, useRef, useState } from 'react'
import DragHandle from '@tiptap/extension-drag-handle-react'
import type { Editor } from '@tiptap/react'
import type { Node as PMNode } from '@tiptap/pm/model'
import { GripVertical, Plus } from 'lucide-react'

type Target = { node: PMNode | null; pos: number }

export const BlockHandle = ({ editor }: { editor: Editor }) => {
  const [target, setTarget] = useState<Target>({ node: null, pos: -1 })
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Kunci handle selama menu terbuka supaya tidak hilang saat mouse bergerak
  //   useEffect(() => {
  //     if (open) editor.commands.lockDragHandle()
  //     else editor.commands.unlockDragHandle()
  //   }, [open, editor])

  // Klik di luar menu → tutup
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const { node, pos } = target

  const addBelow = () => {
    if (!node || pos < 0) return
    const at = pos + node.nodeSize // posisi tepat setelah blok/item yang ditarget

    // List hanya menerima listItem/taskItem sebagai anak langsung, jadi kalau
    // targetnya sebuah item, buat ITEM baru dengan jenis yang sama (bukan paragraf).
    const isItem =
      node.type.name === 'listItem' || node.type.name === 'taskItem'

    editor
      .chain()
      .focus()
      .insertContentAt(
        at,
        isItem
          ? { type: node.type.name, content: [{ type: 'paragraph' }] }
          : { type: 'paragraph' },
      )
      // Item: lewati pembuka <li> dan <p> (+2). Blok biasa: cukup pembuka <p> (+1).
      .setTextSelection(at + (isItem ? 2 : 1))
      .run()
  }

  const remove = () => {
    if (!node || pos < 0) return
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .run()
    setOpen(false)
  }

  const duplicate = () => {
    if (!node || pos < 0) return
    editor
      .chain()
      .focus()
      .insertContentAt(pos + node.nodeSize, node.toJSON())
      .run()
    setOpen(false)
  }

  const move = (dir: -1 | 1) => {
    if (!node || pos < 0) return
    const $pos = editor.state.doc.resolve(pos)
    const parent = $pos.parent
    const index = $pos.index()
    const sibling = parent.maybeChild(index + dir)
    if (!sibling) return

    editor
      .chain()
      .command(({ tr }) => {
        tr.delete(pos, pos + node.nodeSize)
        // naik: sisip sebelum saudara sebelumnya; turun: sisip setelah saudara berikutnya
        tr.insert(
          dir < 0 ? pos - sibling.nodeSize : pos + sibling.nodeSize,
          node,
        )
        return true
      })
      .run()
    setOpen(false)
  }

  const itemCls = 'w-full rounded px-2 py-1 text-left text-xs hover:bg-accent'

  return (
    <DragHandle
      editor={editor}
      nested={{
        // Bawaan 'left': kursor <=12px dari tepi kiri item -> yang dipilih INDUKNYA
        // (seluruh list). 'none' mematikannya, jadi handle selalu menempel pada
        // item yang sedang di-hover. Inilah yang memperbaiki masalahmu.
        edgeDetection: 'none',

        // OPSIONAL: batasi handle bersarang hanya di dalam list. Blok level atas
        // (tabel, tabs, dll.) tetap bisa di-drag. Hapus komentar kalau mau dipakai.
        // allowedContainers: ['bulletList', 'orderedList', 'taskList'],
      }}
      onNodeChange={({ node, pos }) => {
        setTarget({ node, pos })
        // Tes sementara: hover sebuah item list lalu lihat Console browser.
        // Harus tercetak "listItem" (atau "taskItem"), bukan "orderedList".
        // console.log('handle menargetkan:', node?.type.name)
      }}
    >
      <div
        ref={rootRef}
        className="relative flex items-center gap-0.5 text-muted-foreground"
      >
        <button
          type="button"
          title="Tambah blok di bawah"
          onClick={addBelow}
          className="rounded p-0.5 hover:bg-accent hover:text-foreground"
        >
          <Plus className="size-4" />
        </button>

        <button
          type="button"
          title="Seret untuk memindahkan, klik untuk menu"
          onClick={() => setOpen((o) => !o)}
          className="cursor-grab rounded p-0.5 hover:bg-accent hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>

        {open && (
          <div className="absolute left-0 top-full z-50 mt-1 w-32 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            <button type="button" className={itemCls} onClick={() => move(-1)}>
              Naikkan
            </button>
            <button type="button" className={itemCls} onClick={() => move(1)}>
              Turunkan
            </button>
            <button type="button" className={itemCls} onClick={duplicate}>
              Duplikat
            </button>
            <button
              type="button"
              className={`${itemCls} text-destructive`}
              onClick={remove}
            >
              Hapus
            </button>
          </div>
        )}
      </div>
    </DragHandle>
  )
}
