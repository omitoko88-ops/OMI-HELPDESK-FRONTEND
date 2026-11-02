import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useEditorState, type Editor } from '@tiptap/react'
import { MoreHorizontal, Redo, Undo } from 'lucide-react'

import { BadgeInsertButton } from './Buttons/BadgeInsertButton'
import { SeparatorButton } from './Buttons/SeparatorButton'
import { TipInsertButton } from './Buttons/TipInsertButton'
import { BoldButton } from './Buttons/BoldButton'
import { ItalicButton } from './Buttons/ItalicButton'
import { StrikeButton } from './Buttons/StrikeButton'
import { CodeButton } from './Buttons/CodeButton'
import { HeadingButtons } from './Buttons/HeadingButtons'
import { ListButtons } from './Buttons/ListButtons'
import { AlignButtons } from './Buttons/AlignButtons'
import { TableButtons } from './Buttons/TableButtons'
import { ImageUploadButton } from './Buttons/ImageUploadButton'
import { CodeTabsInsertButton } from './Buttons/CodeTabsButton'
import { TabsInsertButton } from './Buttons/TabsButton'
import { PdfInsertButton } from './Buttons/PdfInsertButton'
import { ComboboxInsertButton } from './Buttons/Combobox'
import { CheckboxInsertButton } from './Buttons/CheckboxButton'
import { StepsInsertButton } from './Buttons/StepsInsertButton'
import { TableControls } from '../DocEditor/CustomComponents/Table/TableControls'
import { BlockHandle } from '../DocEditor/CustomComponents/BlockWrap/BlockHandle'

type Props = {
  editor: Editor | null
  /** Kalau diisi, tombol "Save Draft" tampil di ujung kanan pill */
  onSaveDraft?: () => void
}

// Menyulap tombol outline shadcn bawaan komponen-komponenmu jadi tombol bulat
// ala pill. Tombol yang sedang aktif (bg-primary) sengaja tidak disentuh,
// supaya penanda "aktif" dari tiap komponen tetap terlihat.
const pillGroup = [
  '[&_button]:h-9 [&_button]:min-w-9 [&_button]:rounded-full [&_button]:border-transparent [&_button]:px-2 [&_button]:shadow-none',
  'dark:[&_button]:border-transparent',
  '[&_button:not(.bg-primary)]:bg-transparent dark:[&_button:not(.bg-primary)]:bg-transparent',
  '[&_button:not(.bg-primary)]:text-slate-500 dark:[&_button:not(.bg-primary)]:text-slate-400',
  '[&_button:not(.bg-primary):hover]:bg-indigo-50 [&_button:not(.bg-primary):hover]:text-indigo-600',
  'dark:[&_button:not(.bg-primary):hover]:bg-indigo-500/10 dark:[&_button:not(.bg-primary):hover]:text-indigo-400',
  '[&_svg]:size-4',
].join(' ')

const iconBtn =
  'rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'

const Divider = () => <span aria-hidden className="mx-1 h-5 w-px bg-border" />

const ToolItem = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex items-center gap-1">{children}</div>
    <span className="text-[10px] leading-none text-muted-foreground">
      {label}
    </span>
  </div>
)

export const ToolbarFloating = ({ editor, onSaveDraft }: Props) => {
  const [moreOpen, setMoreOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const undoRedo = useEditorState({
    editor,
    selector: ({ editor }) => ({
      canUndo: !!editor?.can().undo(),
      canRedo: !!editor?.can().redo(),
    }),
  })

  const canUndo = undoRedo?.canUndo ?? false
  const canRedo = undoRedo?.canRedo ?? false

  // Tutup panel More: klik di luar / tekan Escape
  useEffect(() => {
    if (!moreOpen) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setMoreOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen])

  if (!editor) return null

  return (
    <>
      {/* Bukan bagian pill: kontrol tabel tetap di atas editor, handle blok di-posisikan oleh pluginnya */}
      <TableControls editor={editor} />
      <BlockHandle editor={editor} />

      {/* Pill melayang */}
      <div className="pointer-events-none fixed inset-x-0 bottom-8 z-40 flex justify-center px-4">
        <div
          ref={rootRef}
          className="pointer-events-auto relative max-w-full animate-in fade-in slide-in-from-bottom-10 duration-300"
        >
          {/* Panel "More": komponen custom (tetap terpasang, hanya disembunyikan) */}
          <div
            aria-hidden={!moreOpen}
            className={`absolute bottom-full left-1/2 mb-3 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border bg-background/95 p-3 shadow-lg backdrop-blur-md transition-all duration-200 ${
              moreOpen
                ? 'visible translate-y-0 opacity-100'
                : 'invisible translate-y-2 opacity-0'
            }`}
          >
            <p className="mb-3 text-xs font-semibold text-muted-foreground">
              Sisipkan komponen
            </p>
            <div className="grid grid-cols-4 gap-x-2 gap-y-3">
              <ToolItem label="Badge">
                <BadgeInsertButton editor={editor} />
              </ToolItem>
              <ToolItem label="Pemisah">
                <SeparatorButton editor={editor} />
              </ToolItem>
              <ToolItem label="Tip">
                <TipInsertButton editor={editor} />
              </ToolItem>
              <ToolItem label="Combobox">
                <ComboboxInsertButton editor={editor} />
              </ToolItem>
              <ToolItem label="Checkbox">
                <CheckboxInsertButton editor={editor} />
              </ToolItem>
              <ToolItem label="Steps">
                <StepsInsertButton editor={editor} />
              </ToolItem>
              <ToolItem label="Tabs">
                <TabsInsertButton editor={editor} />
              </ToolItem>
              <ToolItem label="Code Tabs">
                <CodeTabsInsertButton editor={editor} />
              </ToolItem>

              <div className="col-span-4 border-t pt-3">
                <ToolItem label="Tabel">
                  <div className="flex flex-wrap items-center justify-center gap-1">
                    <TableButtons editor={editor} />
                  </div>
                </ToolItem>
              </div>
            </div>
          </div>

          {/* Pill */}
          <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-slate-200/80 bg-background/90 px-4 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md dark:border-slate-700/70 [&>*]:shrink-0">
            <div className={`flex items-center gap-1 ${pillGroup}`}>
              <BoldButton editor={editor} />
              <ItalicButton editor={editor} />
              <StrikeButton editor={editor} />
              {/* <CodeButton editor={editor} /> */}
              <Divider />
              <HeadingButtons editor={editor} />
              {/* <ListButtons editor={editor} /> */}
              <AlignButtons editor={editor} />
              <Divider />
              <ImageUploadButton editor={editor} />
              <PdfInsertButton editor={editor} />
            </div>

            <button
              type="button"
              title="Komponen lainnya"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((o) => !o)}
              className={`${iconBtn} ${
                moreOpen
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                  : ''
              }`}
            >
              <MoreHorizontal className="size-4" />
            </button>

            <Divider />

            <button
              type="button"
              title="Undo"
              disabled={!canUndo}
              onClick={() => editor.chain().focus().undo().run()}
              className={iconBtn}
            >
              <Undo className="size-4" />
            </button>
            <button
              type="button"
              title="Redo"
              disabled={!canRedo}
              onClick={() => editor.chain().focus().redo().run()}
              className={iconBtn}
            >
              <Redo className="size-4" />
            </button>

            {onSaveDraft && (
              <>
                <Divider />
                <button
                  type="button"
                  onClick={onSaveDraft}
                  className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                >
                  Save Draft
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
