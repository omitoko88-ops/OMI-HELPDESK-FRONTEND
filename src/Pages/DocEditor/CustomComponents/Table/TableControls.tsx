import {
  useEditorState,
  type ChainedCommands,
  type Editor,
} from '@tiptap/react'
import { Button } from '@/components/ui/button'
import type { CellTone } from './CustomTableCells'

type Action = {
  label: string
  run: (c: ChainedCommands) => ChainedCommands
  disabled?: boolean
  danger?: boolean
}

const SWATCHES: { tone: CellTone | null; title: string; cls: string }[] = [
  { tone: null, title: 'Tanpa warna', cls: 'bg-background' },
  { tone: 'yellow', title: 'Kuning', cls: 'bg-yellow-400' },
  { tone: 'red', title: 'Merah', cls: 'bg-red-400' },
  { tone: 'green', title: 'Hijau', cls: 'bg-green-400' },
  { tone: 'blue', title: 'Biru', cls: 'bg-blue-400' },
]

export const TableControls = ({ editor }: { editor: Editor }) => {
  const s = useEditorState({
    editor,
    selector: ({ editor }) => ({
      inTable: !!editor?.isActive('table'),
      canMerge: !!editor?.can().mergeCells(),
      canSplit: !!editor?.can().splitCell(),
    }),
  })

  const exec = (fn: (c: ChainedCommands) => ChainedCommands) =>
    fn(editor.chain().focus()).run()

  const groups: Action[][] = [
    [
      { label: '+ Baris atas', run: (c) => c.addRowBefore() },
      { label: '+ Baris bawah', run: (c) => c.addRowAfter() },
      { label: 'Hapus baris', run: (c) => c.deleteRow(), danger: true },
    ],
    [
      { label: '+ Kolom kiri', run: (c) => c.addColumnBefore() },
      { label: '+ Kolom kanan', run: (c) => c.addColumnAfter() },
      { label: 'Hapus kolom', run: (c) => c.deleteColumn(), danger: true },
    ],
    [
      { label: 'Header baris', run: (c) => c.toggleHeaderRow() },
      { label: 'Header kolom', run: (c) => c.toggleHeaderColumn() },
    ],
    [
      {
        label: 'Gabung sel',
        run: (c) => c.mergeCells(),
        disabled: !s.canMerge,
      },
      { label: 'Pisah sel', run: (c) => c.splitCell(), disabled: !s.canSplit },
    ],
  ]

  return (
    <div
      // cegah editor kehilangan fokus/seleksi saat tombol ditekan
      onMouseDown={(e) => e.preventDefault()}
      aria-hidden={!s.inTable}
      className={`mb-2 flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border bg-muted/40 px-2 py-1.5 transition-opacity ${
        s.inTable ? 'opacity-100' : 'pointer-events-none invisible opacity-0'
      }`}
    >
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-1">
          {group.map((a) => (
            <Button
              key={a.label}
              type="button"
              variant="outline"
              size="sm"
              disabled={a.disabled}
              onClick={() => exec(a.run)}
              className={`h-7 px-2 text-xs ${a.danger ? 'hover:text-destructive' : ''}`}
            >
              {a.label}
            </Button>
          ))}
        </div>
      ))}

      <div className="flex items-center gap-1.5" title="Warna sel">
        <span className="text-xs text-muted-foreground">Warna:</span>
        {SWATCHES.map((sw) => (
          <button
            key={sw.title}
            type="button"
            title={sw.title}
            onClick={() => exec((c) => c.setCellAttribute('tone', sw.tone))}
            className={`size-5 rounded-full border ${sw.cls}`}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="ml-auto h-7 px-2 text-xs hover:text-destructive"
        onClick={() => {
          if (window.confirm('Hapus seluruh tabel?'))
            exec((c) => c.deleteTable())
        }}
      >
        Hapus tabel
      </Button>
    </div>
  )
}
