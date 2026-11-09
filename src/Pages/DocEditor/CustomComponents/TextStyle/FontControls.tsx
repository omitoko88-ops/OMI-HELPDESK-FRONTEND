// FontControls.tsx
// Kontrol toolbar untuk jenis font, ukuran, warna, stabilo, jarak baris, dan reset.

import { useEffect, useRef, useState } from 'react'
import { useEditorState } from '@tiptap/react'
import { Highlighter, RemoveFormatting } from 'lucide-react'
import { ToolbarButtonProps } from '@/Pages/Toolbar/types' // sesuaikan dengan path-mu
import {
  FONT_FAMILIES,
  FONT_SIZES,
  HIGHLIGHT_COLORS,
  LINE_HEIGHTS,
  TEXT_COLORS,
} from './fontOptions'

// Gaya <select> yang sama untuk semua dropdown
const selectCls = 'h-8 rounded-md border bg-background px-2 text-xs'

// Normalisasi nama font untuk dibandingkan: huruf kecil, tanpa tanda kutip dan spasi.
// Perlu karena browser bisa mengubah '"Times New Roman", serif' saat HTML dibaca ulang.
const norm = (s: string) => s.toLowerCase().replace(/["'\s]/g, '')

// ───────────────────────── Jenis font ─────────────────────────
export const FontFamilySelect = ({ editor }: ToolbarButtonProps) => {
  // Baca font di posisi kursor/seleksi. Komponen re-render hanya kalau nilainya berubah.
  const current = useEditorState({
    editor,
    selector: ({ editor }) =>
      (editor?.getAttributes('textStyle').fontFamily as string | undefined) ??
      '',
  })

  // Cari opsi yang cocok dengan font saat ini
  const matched = FONT_FAMILIES.find((f) => norm(f.value) === norm(current))

  return (
    <select
      title="Jenis font"
      className={`${selectCls} w-32`}
      value={matched ? matched.value : current}
      onChange={(e) => {
        const v = e.target.value
        // '' (Bawaan) = hapus gaya font; selain itu terapkan
        if (v) editor.chain().focus().setFontFamily(v).run()
        else editor.chain().focus().unsetFontFamily().run()
      }}
    >
      {FONT_FAMILIES.map((f) => (
        // style fontFamily membuat setiap opsi tampil dengan fontnya sendiri
        <option
          key={f.label}
          value={f.value}
          style={{ fontFamily: f.value || undefined }}
        >
          {f.label}
        </option>
      ))}
      {/* Font dari dokumen lama yang tidak ada di daftar tetap ditampilkan apa adanya */}
      {!matched && current && (
        <option value={current}>{current.split(',')[0]}</option>
      )}
    </select>
  )
}

// ───────────────────────── Ukuran font ─────────────────────────
export const FontSizeSelect = ({ editor }: ToolbarButtonProps) => {
  const current = useEditorState({
    editor,
    selector: ({ editor }) =>
      (editor?.getAttributes('textStyle').fontSize as string | undefined) ?? '',
  })

  return (
    <select
      title="Ukuran font"
      className={`${selectCls} w-20`}
      value={current}
      onChange={(e) => {
        const v = e.target.value
        if (v) editor.chain().focus().setFontSize(v).run()
        else editor.chain().focus().unsetFontSize().run()
      }}
    >
      {FONT_SIZES.map((s) => (
        <option key={s} value={s}>
          {s ? s.replace('px', '') : 'Ukuran'}
        </option>
      ))}
      {/* Ukuran di luar daftar (mis. 17px dari dokumen lama) tetap ditampilkan */}
      {current && !FONT_SIZES.includes(current) && (
        <option value={current}>{current.replace('px', '')}</option>
      )}
    </select>
  )
}

// ───────────────────────── Jarak baris ─────────────────────────
export const LineHeightSelect = ({ editor }: ToolbarButtonProps) => {
  // line-height disimpan di paragraf/heading, jadi dibaca dari node, bukan dari mark textStyle
  const current = useEditorState({
    editor,
    selector: ({ editor }) =>
      ((editor?.getAttributes('paragraph').lineHeight ??
        editor?.getAttributes('heading').lineHeight) as string | undefined) ??
      '',
  })

  return (
    <select
      title="Jarak baris"
      className={`${selectCls} w-32`}
      value={current}
      onChange={(e) => {
        const v = e.target.value
        if (v) editor.chain().focus().setBlockLineHeight(v).run()
        else editor.chain().focus().unsetBlockLineHeight().run()
      }}
    >
      {LINE_HEIGHTS.map((l) => (
        <option key={l.label} value={l.value}>
          {l.value ? l.label : 'Jarak baris'}
        </option>
      ))}
      {current && !LINE_HEIGHTS.some((l) => l.value === current) && (
        <option value={current}>{current}</option>
      )}
    </select>
  )
}

// ───────────────────────── Warna teks & stabilo ─────────────────────────
// Satu komponen untuk dua fungsi, dibedakan oleh prop "mode".
type ColorMenuProps = ToolbarButtonProps & {
  mode: 'color' | 'backgroundColor'
  openUp?: boolean // true = panel membuka ke atas (untuk toolbar melayang di bawah layar)
}

export const ColorMenu = ({ editor, mode, openUp = true }: ColorMenuProps) => {
  const [open, setOpen] = useState(false)
  const [hex, setHex] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  // Warna yang sedang aktif di seleksi (untuk indikator di tombol)
  const current = useEditorState({
    editor,
    selector: ({ editor }) =>
      (editor?.getAttributes('textStyle')[mode] as string | undefined) ?? '',
  })

  // Klik di luar panel -> tutup
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Terapkan warna. value '' = hapus warna.
  const apply = (value: string) => {
    const chain = editor.chain().focus()
    if (mode === 'color') {
      if (value) chain.setColor(value).run()
      else chain.unsetColor().run()
    } else {
      if (value) chain.setBackgroundColor(value).run()
      else chain.unsetBackgroundColor().run()
    }
    setOpen(false)
  }

  // Input hex manual: hanya menerima #RGB atau #RRGGBB.
  // Memakai input teks (bukan <input type="color">) supaya tidak memicu puluhan
  // transaksi saat slider digeser.
  const applyHex = () => {
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex.trim())) {
      apply(hex.trim())
      setHex('')
    }
  }

  const swatches = mode === 'color' ? TEXT_COLORS : HIGHLIGHT_COLORS

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        title={mode === 'color' ? 'Warna teks' : 'Stabilo'}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 flex-col items-center justify-center rounded-md border bg-background hover:bg-accent"
      >
        {mode === 'color' ? (
          <span className="text-sm font-bold leading-none">A</span>
        ) : (
          <Highlighter className="size-4" />
        )}
        {/* Garis kecil di bawah ikon menunjukkan warna yang sedang aktif */}
        <span
          className="mt-0.5 h-0.5 w-4 rounded"
          style={{
            background: current || 'currentColor',
            opacity: current ? 1 : 0.3,
          }}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 z-50 w-52 rounded-md border bg-popover p-2 text-popover-foreground shadow-md ${
            openUp ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          <div className="grid grid-cols-6 gap-1.5">
            {swatches.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => apply(c)}
                className="size-6 rounded-full border"
                style={{ background: c }}
              />
            ))}
          </div>

          <div className="mt-2 flex gap-1">
            <input
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  applyHex()
                }
              }}
              placeholder="#RRGGBB"
              className="h-7 min-w-0 flex-1 rounded border bg-background px-2 text-xs"
            />
            <button
              type="button"
              onClick={() => apply('')}
              className="h-7 rounded border px-2 text-xs hover:bg-accent"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ───────────────────────── Reset gaya teks ─────────────────────────
// Menghapus font, ukuran, warna, dan stabilo dari seleksi sekaligus.
// Tebal/miring/coret tidak ikut terhapus.
export const ResetTextStyleButton = ({ editor }: ToolbarButtonProps) => (
  <button
    type="button"
    title="Reset gaya teks"
    onClick={() =>
      editor
        .chain()
        .focus()
        .unsetFontFamily()
        .unsetFontSize()
        .unsetColor()
        .unsetBackgroundColor()
        .run()
    }
    className="flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent"
  >
    <RemoveFormatting className="size-4" />
  </button>
)
