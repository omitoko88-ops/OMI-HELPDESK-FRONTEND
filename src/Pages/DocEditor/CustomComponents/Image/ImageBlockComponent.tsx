import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Image as ImageIcon,
  Replace,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

const ACCEPT = 'image/png,image/jpeg,image/webp,image/gif'
const WIDTHS = [25, 50, 75, 100]
const WRAP = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
} as const
const ALIGN_ICONS = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
} as const

type Align = keyof typeof WRAP

// Hanya http(s) atau path relatif. blob:/data:/javascript: ditolak
// (konten bisa datang dari database, jadi dicek saat render).
export function sanitizeImageSrc(raw: string): string | null {
  const v = (raw ?? '').trim()
  if (!v) return null
  if (v.startsWith('/') && !v.startsWith('//')) return v
  try {
    const u = new URL(v)
    return u.protocol === 'https:' || u.protocol === 'http:'
      ? u.toString()
      : null
  } catch {
    return null
  }
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))
const toolBtn =
  'inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-xs hover:bg-accent'

export default function ImageBlockComponent({
  node,
  editor,
  extension,
  updateAttributes,
  deleteNode,
  selected,
}: NodeViewProps) {
  const editable = editor.isEditable
  const { src, alt, caption } = node.attrs
  const align: Align =
    (node.attrs.align as Align) in WRAP ? node.attrs.align : 'center'
  const width: number = node.attrs.width ?? 100
  const safeSrc = sanitizeImageSrc(src)

  const upload = extension.options.upload as
    | ((f: File) => Promise<string>)
    | undefined
  const maxMB = extension.options.maxSizeMB as number

  const figureRef = useRef<HTMLElement>(null)
  const [draftWidth, setDraftWidth] = useState<number | null>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const [zoom, setZoom] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Tutup lightbox dengan Escape
  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  const applyUrl = () => {
    const clean = sanitizeImageSrc(urlInput)
    if (!clean) {
      setError(
        'URL harus diawali https:// atau http:// (atau path yang diawali /).',
      )
      return
    }
    setError('')
    updateAttributes({ src: clean })
  }

  const onFile = async (file?: File) => {
    if (!file || !upload) return
    if (!ACCEPT.split(',').includes(file.type))
      return setError('Format harus PNG, JPG, WebP, atau GIF.')
    if (file.size > maxMB * 1024 * 1024)
      return setError(`Ukuran maksimal ${maxMB} MB.`)
    setBusy(true)
    setError('')
    try {
      const url = await upload(file)
      updateAttributes({
        src: url,
        alt: alt || file.name.replace(/\.[^.]+$/, ''),
      })
    } catch {
      setError('Upload gagal. Coba lagi.')
    } finally {
      setBusy(false)
    }
  }

  // ===== Seret handle untuk mengubah ukuran (disimpan sebagai persen) =====
  const startResize = (e: React.PointerEvent<HTMLButtonElement>) => {
    const figure = figureRef.current
    const container = figure?.parentElement
    if (!figure || !container) return
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)

    const startX = e.clientX
    const startPx = figure.getBoundingClientRect().width
    const maxPx = container.getBoundingClientRect().width
    // tengah: kedua sisi ikut bergerak → lipat dua agar tepi mengikuti kursor
    const factor = align === 'center' ? 2 : align === 'right' ? -1 : 1
    const calc = (x: number) =>
      clamp(
        Math.round(((startPx + (x - startX) * factor) / maxPx) * 100),
        10,
        100,
      )

    const move = (ev: PointerEvent) => setDraftWidth(calc(ev.clientX))
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setDraftWidth(null)
      updateAttributes({ width: calc(ev.clientX) }) // satu transaksi = satu langkah undo
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // ===== Belum ada gambar (atau sumber lama tidak valid, mis. blob:) =====
  if (!safeSrc) {
    if (!editable) return <NodeViewWrapper className="hidden" />

    return (
      <NodeViewWrapper className="my-6 space-y-4 rounded-xl border-2 border-dashed bg-muted/20 p-6 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <ImageIcon className="size-5" /> Sisipkan gambar
        </div>

        {src && (
          <p className="text-amber-600 dark:text-amber-400">
            Gambar sebelumnya tidak bisa dimuat (sumbernya sementara/tidak
            valid). Unggah ulang atau pakai URL.
          </p>
        )}

        {upload && (
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-4 py-6 hover:bg-accent">
            <Upload className="size-4" />
            {busy
              ? 'Mengunggah…'
              : `Pilih gambar (maks ${maxMB} MB) — atau paste/drop ke editor`}
            <input
              type="file"
              accept={ACCEPT}
              className="hidden"
              disabled={busy}
              onChange={(e) => {
                onFile(e.target.files?.[0])
                e.target.value = ''
              }}
            />
          </label>
        )}

        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applyUrl()
              }
            }}
            placeholder="atau tempel URL gambar (https://...)"
            className="flex-1 rounded-md border bg-background px-3 py-2"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="rounded-md bg-primary px-3 text-primary-foreground"
          >
            Pasang
          </button>
          <button
            type="button"
            title="Hapus blok"
            onClick={() => deleteNode()}
            className="rounded-md border px-2 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        {error && <p className="text-destructive">{error}</p>}
      </NodeViewWrapper>
    )
  }

  const failed = failedSrc === safeSrc
  const shownWidth = draftWidth ?? width

  return (
    <NodeViewWrapper className={`my-6 flex ${WRAP[align]}`}>
      <figure
        ref={figureRef}
        className="group relative m-0 w-full sm:w-[var(--w)]"
        style={{ '--w': `${shownWidth}%` } as React.CSSProperties}
      >
        {failed ? (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border bg-muted/40 text-sm text-muted-foreground">
            <ImageIcon className="size-6" />
            Gambar tidak dapat dimuat
          </div>
        ) : (
          <img
            src={safeSrc}
            alt={alt ?? ''}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setFailedSrc(safeSrc)}
            onClick={() => !editable && setZoom(true)}
            className={`my-0 block h-auto w-full rounded-lg border ${
              editable ? '' : 'cursor-zoom-in'
            } ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
          />
        )}

        {/* Toolbar melayang di atas gambar (tidak menggeser layout) */}
        {editable && (
          <div
            contentEditable={false}
            className={`absolute left-2 top-2 z-10 flex items-center gap-0.5 rounded-lg border bg-background/95 p-1 shadow-md backdrop-blur transition-opacity ${
              selected
                ? 'opacity-100'
                : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100'
            }`}
          >
            {(Object.keys(WRAP) as Align[]).map((a) => {
              const Icon = ALIGN_ICONS[a]
              return (
                <button
                  key={a}
                  type="button"
                  title={`Rata ${a === 'left' ? 'kiri' : a === 'center' ? 'tengah' : 'kanan'}`}
                  onClick={() => updateAttributes({ align: a })}
                  className={`${toolBtn} ${align === a ? 'bg-accent' : ''}`}
                >
                  <Icon className="size-4" />
                </button>
              )
            })}
            <span className="mx-1 h-4 w-px bg-border" />
            {WIDTHS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => updateAttributes({ width: w })}
                className={`${toolBtn} ${width === w ? 'bg-accent' : ''}`}
              >
                {w}%
              </button>
            ))}
            <span className="mx-1 h-4 w-px bg-border" />
            <button
              type="button"
              title="Teks alternatif (untuk screen reader)"
              onClick={() => {
                const v = window.prompt('Teks alternatif gambar:', alt ?? '')
                if (v !== null) updateAttributes({ alt: v.trim() })
              }}
              className={toolBtn}
            >
              Alt
            </button>
            <button
              type="button"
              title="Ganti gambar"
              onClick={() => updateAttributes({ src: '' })}
              className={toolBtn}
            >
              <Replace className="size-4" />
            </button>
            <button
              type="button"
              title="Hapus"
              onClick={() => deleteNode()}
              className={`${toolBtn} hover:text-destructive`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )}

        {/* Handle resize di sudut bawah (di sisi kiri bila rata kanan) */}
        {editable && !failed && (
          <button
            type="button"
            aria-label="Ubah ukuran"
            onPointerDown={startResize}
            className={`absolute bottom-2 z-10 size-4 touch-none rounded-sm border-2 border-white bg-primary shadow transition-opacity ${
              align === 'right'
                ? 'left-2 cursor-nesw-resize'
                : 'right-2 cursor-nwse-resize'
            } ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          />
        )}

        {/* Keterangan */}
        {editable ? (
          <input
            key={caption}
            defaultValue={caption}
            placeholder="Tambahkan keterangan…"
            onBlur={(e) => updateAttributes({ caption: e.target.value.trim() })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
            className="mt-2 w-full bg-transparent text-center text-sm text-muted-foreground outline-none placeholder:opacity-50"
          />
        ) : (
          caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {caption}
            </figcaption>
          )
        )}
      </figure>

      {/* Lightbox (viewer) */}
      {zoom &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setZoom(false)}
          >
            <button
              type="button"
              aria-label="Tutup"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
            <img
              src={safeSrc}
              alt={alt ?? ''}
              className="max-h-full max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </NodeViewWrapper>
  )
}
