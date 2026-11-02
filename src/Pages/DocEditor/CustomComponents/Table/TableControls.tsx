import { useEffect, useState } from 'react'
import {
  useEditorState,
  type ChainedCommands,
  type Editor,
} from '@tiptap/react'
import {
  autoUpdate,
  flip,
  FloatingPortal,
  hide,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react'

import { Button } from '@/components/ui/button'
import type { CellTone } from './CustomTableCells'

type Action = {
  label: string
  run: (c: ChainedCommands) => ChainedCommands
  disabled?: boolean
  danger?: boolean
}

const SWATCHES: {
  tone: CellTone | null
  title: string
  cls: string
}[] = [
  { tone: null, title: 'Tanpa warna', cls: 'bg-background' },
  { tone: 'yellow', title: 'Kuning', cls: 'bg-yellow-400' },
  { tone: 'red', title: 'Merah', cls: 'bg-red-400' },
  { tone: 'green', title: 'Hijau', cls: 'bg-green-400' },
  { tone: 'blue', title: 'Biru', cls: 'bg-blue-400' },
]

/**
 * Mengambil elemen <table> yang berisi selection aktif.
 * Mendukung table yang memiliki wrapper dari Tiptap.
 */
function getActiveTable(editor: Editor): HTMLElement | null {
  if (editor.isDestroyed || !editor.isActive('table')) {
    return null
  }

  const { $from } = editor.state.selection

  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).type.name !== 'table') {
      continue
    }

    const pos = $from.before(depth)
    const node = editor.view.nodeDOM(pos)

    if (!(node instanceof HTMLElement)) {
      return null
    }

    if (node.matches('table')) {
      return node
    }

    const table = node.querySelector('table')

    if (table instanceof HTMLElement) {
      return table
    }

    return node.closest('table')
  }

  return null
}

export const TableControls = ({ editor }: { editor: Editor }) => {
  const [activeTable, setActiveTable] = useState<HTMLElement | null>(null)

  const s = useEditorState({
    editor,
    selector: ({ editor }) => ({
      inTable: !!editor?.isActive('table'),
      canMerge: !!editor?.can().mergeCells(),
      canSplit: !!editor?.can().splitCell(),
    }),
  })

  // Floating toolbar menggunakan elemen tabel sebagai anchor.
  const { refs, floatingStyles, placement, middlewareData, isPositioned } =
    useFloating({
      elements: {
        reference: activeTable,
      },
      open: s.inTable && !!activeTable,
      placement: 'top',
      strategy: 'fixed',
      middleware: [
        offset(8),
        flip({
          fallbackPlacements: ['bottom'],
          padding: 8,
        }),
        shift({
          padding: 8,
        }),
        hide(),
      ],
      whileElementsMounted: autoUpdate,
    })

  // Pantau selection dan perubahan dokumen.
  useEffect(() => {
    const updateActiveTable = () => {
      const nextTable = getActiveTable(editor)

      setActiveTable((current) => (current === nextTable ? current : nextTable))
    }

    const clearActiveTable = () => {
      setActiveTable(null)
    }

    updateActiveTable()

    editor.on('selectionUpdate', updateActiveTable)
    editor.on('transaction', updateActiveTable)
    editor.on('focus', updateActiveTable)
    editor.on('blur', clearActiveTable)

    return () => {
      editor.off('selectionUpdate', updateActiveTable)
      editor.off('transaction', updateActiveTable)
      editor.off('focus', updateActiveTable)
      editor.off('blur', clearActiveTable)
    }
  }, [editor])

  const exec = (fn: (c: ChainedCommands) => ChainedCommands) => {
    fn(editor.chain().focus()).run()
  }

  const groups: Action[][] = [
    [
      {
        label: '+ Baris atas',
        run: (c) => c.addRowBefore(),
      },
      {
        label: '+ Baris bawah',
        run: (c) => c.addRowAfter(),
      },
      {
        label: 'Hapus baris',
        run: (c) => c.deleteRow(),
        danger: true,
      },
    ],
    [
      {
        label: '+ Kolom kiri',
        run: (c) => c.addColumnBefore(),
      },
      {
        label: '+ Kolom kanan',
        run: (c) => c.addColumnAfter(),
      },
      {
        label: 'Hapus kolom',
        run: (c) => c.deleteColumn(),
        danger: true,
      },
    ],
    [
      {
        label: 'Header baris',
        run: (c) => c.toggleHeaderRow(),
      },
      {
        label: 'Header kolom',
        run: (c) => c.toggleHeaderColumn(),
      },
    ],
    [
      {
        label: 'Gabung sel',
        run: (c) => c.mergeCells(),
        disabled: !s.canMerge,
      },
      {
        label: 'Pisah sel',
        run: (c) => c.splitCell(),
        disabled: !s.canSplit,
      },
    ],
  ]

  if (!s.inTable || !activeTable) {
    return null
  }

  const referenceHidden = middlewareData.hide?.referenceHidden ?? false

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          zIndex: 50,
          maxWidth: 'calc(100vw - 16px)',
          visibility: !isPositioned || referenceHidden ? 'hidden' : 'visible',
        }}
        data-placement={placement}
        onMouseDown={(e) => {
          // Pertahankan selection editor saat toolbar diklik.
          e.preventDefault()
        }}
        role="toolbar"
        aria-label="Kontrol tabel"
        className="
          flex max-h-[min(50vh,360px)]
          max-w-[calc(100vw-16px)]
          flex-wrap items-center gap-x-2 gap-y-1.5
          overflow-y-auto overflow-x-hidden
          rounded-xl border bg-background/95
          p-2 shadow-lg backdrop-blur-sm
        "
      >
        {groups.map((group, gi) => (
          <div key={gi} className="flex flex-wrap items-center gap-1">
            {group.map((a) => (
              <Button
                key={a.label}
                type="button"
                variant="outline"
                size="sm"
                disabled={a.disabled}
                onClick={() => exec(a.run)}
                className={`
                  h-7 shrink-0 px-2 text-xs
                  ${a.danger ? 'hover:text-destructive' : ''}
                `}
              >
                {a.label}
              </Button>
            ))}
          </div>
        ))}

        <div className="flex shrink-0 items-center gap-1.5" title="Warna sel">
          <span className="text-xs text-muted-foreground">Warna:</span>

          {SWATCHES.map((sw) => (
            <button
              key={sw.title}
              type="button"
              title={sw.title}
              aria-label={`Warna sel: ${sw.title}`}
              onClick={() => exec((c) => c.setCellAttribute('tone', sw.tone))}
              className={`
                size-5 shrink-0 rounded-full border
                ${sw.cls}
              `}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="
            h-7 shrink-0 px-2 text-xs
            hover:text-destructive
          "
          onClick={() => {
            if (window.confirm('Hapus seluruh tabel?')) {
              exec((c) => c.deleteTable())
            }
          }}
        >
          Hapus tabel
        </Button>
      </div>
    </FloatingPortal>
  )
}
