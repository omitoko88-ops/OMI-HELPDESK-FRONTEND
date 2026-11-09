import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useEditorState, type Editor } from '@tiptap/react'
import {
  ChevronRight,
  List as ListIcon,
  MoreHorizontal,
  Redo,
  Table as TableIcon,
  Type,
  Undo,
} from 'lucide-react'

import { BadgeInsertButton } from './Buttons/BadgeInsertButton'
import { SeparatorButton } from './Buttons/SeparatorButton'
import { TipInsertButton } from './Buttons/TipInsertButton'
import { BoldButton } from './Buttons/BoldButton'
import { ItalicButton } from './Buttons/ItalicButton'
import { StrikeButton } from './Buttons/StrikeButton'
import { HeadingButtons } from './Buttons/HeadingButtons'
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
import { ListButtons } from './Buttons/ListButtons'
import { ListStyleSelect } from '../DocEditor/CustomComponents/List/ListStyleSelect'
import {
  ColorMenu,
  FontFamilySelect,
  FontSizeSelect,
  LineHeightSelect,
  ResetTextStyleButton,
} from '../DocEditor/CustomComponents/TextStyle/FontControls'

type Props = {
  editor: Editor | null
  /** Kalau diisi, tombol "Save Draft" tampil di ujung kanan pill */
  onSaveDraft?: () => void
}

// Id grup yang bisa membuka popover di sebelah panel
type SectionId = 'font' | 'list' | 'table'

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

// ───────────── Bagian-bagian kecil untuk isi panel More ─────────────

// Judul kelompok di dalam daftar (mis. "Format", "Sisipkan komponen")
const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground first:pt-0">
    {children}
  </p>
)

// Baris aksi langsung: label di kiri, tombol bawaan komponen di kanan.
// Dipakai untuk komponen yang cukup sekali klik (Badge, Tip, Steps, dst.)
const ActionRow = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => (
  <div className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/60">
    <span className="text-sm">{label}</span>
    <div className="flex items-center gap-1">{children}</div>
  </div>
)

// Baris grup: kalau diklik, membuka popover berisi kontrol-kontrol sejenis di sebelah panel
const GroupRow = ({
  icon,
  label,
  hint,
  active,
  onClick,
}: {
  icon: ReactNode
  label: string
  hint: string
  active: boolean
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-expanded={active}
    className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted/60 ${
      active ? 'bg-indigo-50 dark:bg-indigo-500/10' : ''
    }`}
  >
    <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
      {icon}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-medium">{label}</span>
      <span className="block truncate text-xs text-muted-foreground">
        {hint}
      </span>
    </span>
    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
  </button>
)

// Satu baris isian di dalam popover: label di kiri, kontrol di kanan
const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-xs text-muted-foreground">{label}</span>
    <div className="flex items-center gap-1">{children}</div>
  </div>
)

export const ToolbarFloating = ({ editor, onSaveDraft }: Props) => {
  const [moreOpen, setMoreOpen] = useState(false)
  // Grup yang popover-nya sedang terbuka (null = tidak ada)
  const [section, setSection] = useState<SectionId | null>(null)
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

  // Klik di luar -> tutup semuanya.
  // Escape -> tutup popover dulu; kalau sudah tidak ada popover, baru tutup panel.
  useEffect(() => {
    if (!moreOpen) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setMoreOpen(false)
        setSection(null)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (section) setSection(null)
      else setMoreOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen, section])

  if (!editor) return null

  // Klik grup yang sama dua kali = tutup popover-nya
  const toggleSection = (id: SectionId) =>
    setSection((s) => (s === id ? null : id))

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
          {/* Pembungkus panel More. Tetap terpasang, hanya disembunyikan.
              Popover samping adalah ANAK pembungkus ini, tapi SAUDARA dari area scroll,
              supaya tidak terpotong oleh overflow daftar. */}
          <div
            aria-hidden={!moreOpen}
            className={`absolute bottom-full left-1/2 mb-3 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 transition-all duration-200 ${
              moreOpen
                ? 'visible translate-y-0 opacity-100'
                : 'invisible translate-y-2 opacity-0'
            }`}
          >
            {/* Panel utama */}
            <div className="rounded-2xl border bg-background/95 shadow-lg backdrop-blur-md">
              {/* Judul tetap diam (tidak ikut scroll) */}
              <p className="border-b px-4 py-3 text-xs font-semibold text-muted-foreground">
                Komponen &amp; format
              </p>

              {/* Daftar yang bisa di-scroll.
                  max-h: maksimal 24rem, atau 50% tinggi layar kalau layarnya pendek.
                  overscroll-contain: scroll di sini tidak menggulung halaman di belakangnya. */}
              <div className="max-h-[min(24rem,50vh)] overflow-y-auto overscroll-contain p-2 [scrollbar-width:thin]">
                <SectionLabel>Format</SectionLabel>
                <GroupRow
                  icon={<Type className="size-4" />}
                  label="Font & warna"
                  hint="Jenis, ukuran, warna, jarak baris"
                  active={section === 'font'}
                  onClick={() => toggleSection('font')}
                />
                <GroupRow
                  icon={<ListIcon className="size-4" />}
                  label="List"
                  hint="Bullet, nomor, gaya list"
                  active={section === 'list'}
                  onClick={() => toggleSection('list')}
                />

                <SectionLabel>Sisipkan komponen</SectionLabel>
                <ActionRow label="Badge">
                  <BadgeInsertButton editor={editor} />
                </ActionRow>
                <ActionRow label="Pemisah">
                  <SeparatorButton editor={editor} />
                </ActionRow>
                <ActionRow label="Tip">
                  <TipInsertButton editor={editor} />
                </ActionRow>
                <ActionRow label="Combobox">
                  <ComboboxInsertButton editor={editor} />
                </ActionRow>
                <ActionRow label="Checkbox">
                  <CheckboxInsertButton editor={editor} />
                </ActionRow>
                <ActionRow label="Steps">
                  <StepsInsertButton editor={editor} />
                </ActionRow>
                <ActionRow label="Tabs">
                  <TabsInsertButton editor={editor} />
                </ActionRow>
                <ActionRow label="Code Tabs">
                  <CodeTabsInsertButton editor={editor} />
                </ActionRow>

                <SectionLabel>Tabel</SectionLabel>
                <GroupRow
                  icon={<TableIcon className="size-4" />}
                  label="Tabel"
                  hint="Sisipkan dan atur tabel"
                  active={section === 'table'}
                  onClick={() => toggleSection('table')}
                />
              </div>
            </div>

            {/* Popover samping.
                - Layar lebar (lg ke atas): di sebelah kanan panel, sejajar bagian atasnya.
                - Layar sempit: tepat di atas panel (di samping tidak muat).
                Tanpa overflow, supaya popover warna di dalamnya tidak terpotong. */}
            {section && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl border bg-background/95 p-3 shadow-lg backdrop-blur-md lg:bottom-auto lg:left-full lg:right-auto lg:top-0 lg:mb-0 lg:ml-2 lg:w-64">
                {section === 'font' && (
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Font &amp; warna
                    </p>
                    <Field label="Jenis font">
                      <FontFamilySelect editor={editor} />
                    </Field>
                    <Field label="Ukuran">
                      <FontSizeSelect editor={editor} />
                    </Field>
                    <Field label="Jarak baris">
                      <LineHeightSelect editor={editor} />
                    </Field>
                    {/* Dua tombol warna dirapatkan ke kiri, karena panel pilihan warnanya
                        membuka ke bawah dari sisi kiri tombol */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Warna
                      </span>
                      <ColorMenu editor={editor} mode="color" openUp={false} />
                      <ColorMenu
                        editor={editor}
                        mode="backgroundColor"
                        openUp={false}
                      />
                      <span className="ml-auto">
                        <ResetTextStyleButton editor={editor} />
                      </span>
                    </div>
                  </div>
                )}

                {section === 'list' && (
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-muted-foreground">
                      List
                    </p>
                    <Field label="Jenis">
                      <ListButtons editor={editor} />
                    </Field>
                    <Field label="Gaya">
                      <ListStyleSelect editor={editor} />
                    </Field>
                  </div>
                )}

                {section === 'table' && (
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Tabel
                    </p>
                    <div className="flex flex-wrap items-center gap-1">
                      <TableButtons editor={editor} />
                    </div>
                  </div>
                )}
              </div>
            )}
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
              onClick={() => {
                // Saat panel ditutup, popover samping ikut ditutup
                if (moreOpen) setSection(null)
                setMoreOpen((o) => !o)
              }}
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
