import { useRef, useState } from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { ChevronDown, Settings2 } from 'lucide-react'

export default function InlineComboboxComponent({
  node,
  editor,
  updateAttributes,
}: NodeViewProps) {
  const editable = editor.isEditable
  const value: string = node.attrs.value
  const options: string[] = node.attrs.options

  const [editing, setEditing] = useState(false)
  const cancelled = useRef(false)

  const commitOptions = (raw: string) => {
    if (cancelled.current) {
      cancelled.current = false
      return
    }
    const list = [
      ...new Set(
        raw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    ]
    if (list.length) {
      updateAttributes({
        options: list,
        value: list.includes(value) ? value : list[0],
      })
    }
    setEditing(false)
  }

  // Viewer: tampil seperti dropdown, tapi hanya menampilkan nilai
  if (!editable) {
    return (
      <NodeViewWrapper
        as="span"
        className="mx-0.5 inline-flex items-center gap-1 rounded-md border bg-background px-2 py-0.5 align-middle text-xs"
      >
        <span>{value || '—'}</span>
        <ChevronDown className="size-3 opacity-60" />
      </NodeViewWrapper>
    )
  }

  // Editor: mode ubah daftar opsi
  if (editing) {
    return (
      <NodeViewWrapper
        as="span"
        className="mx-0.5 inline-flex items-center align-middle"
      >
        <input
          autoFocus
          defaultValue={options.join(', ')}
          placeholder="Opsi dipisah koma"
          className="h-7 w-56 rounded-md border bg-background px-2 text-xs"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              commitOptions(e.currentTarget.value)
            }
            if (e.key === 'Escape') {
              cancelled.current = true
              setEditing(false)
            }
          }}
          onBlur={(e) => commitOptions(e.target.value)}
        />
      </NodeViewWrapper>
    )
  }

  // Editor: pilih nilai
  return (
    <NodeViewWrapper
      as="span"
      className="mx-0.5 inline-flex items-center gap-1 align-middle"
    >
      <select
        value={value}
        onChange={(e) => updateAttributes({ value: e.target.value })}
        className="h-7 rounded-md border bg-background px-2 text-xs"
      >
        {!options.includes(value) && (
          <option value={value}>{value || 'Pilih…'}</option>
        )}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <button
        type="button"
        title="Ubah daftar opsi"
        onClick={() => setEditing(true)}
        className="rounded p-1 text-muted-foreground hover:text-foreground"
      >
        <Settings2 className="size-3.5" />
      </button>
    </NodeViewWrapper>
  )
}
