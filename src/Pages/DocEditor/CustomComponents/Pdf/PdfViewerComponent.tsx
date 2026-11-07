import { lazy, Suspense, useState } from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { FileText, Replace, Trash2, Upload } from 'lucide-react'

const PdfCanvas = lazy(() => import('./PdfCanvas'))

const HEIGHTS = [400, 600, 800]

// Hanya izinkan http(s) atau path relatif. Konten bisa saja berasal dari
// database, jadi cek lagi saat render, bukan hanya saat input.
export function sanitizePdfSrc(raw: string): string | null {
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

export default function PdfViewerComponent({
  node,
  editor,
  extension,
  updateAttributes,
  deleteNode,
  selected,
}: NodeViewProps) {
  const editable = editor.isEditable
  const { src, title, height } = node.attrs
  const safeSrc = sanitizePdfSrc(src)

  const upload = extension.options.upload as
    | ((file: File) => Promise<string>)
    | undefined
  const maxMB = extension.options.maxSizeMB as number

  const [urlInput, setUrlInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const applyUrl = () => {
    const clean = sanitizePdfSrc(urlInput)
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
    if (file.type !== 'application/pdf')
      return setError('File harus berformat PDF.')
    if (file.size > maxMB * 1024 * 1024)
      return setError(`Ukuran maksimal ${maxMB} MB.`)
    setBusy(true)
    setError('')
    try {
      const url = await upload(file)
      updateAttributes({
        src: url,
        title: title || file.name.replace(/\.pdf$/i, ''),
      })
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload gagal. Coba lagi.')
    } finally {
      setBusy(false)
    }
  }

  // Belum ada PDF
  if (!safeSrc) {
    if (!editable) return <NodeViewWrapper className="hidden" />

    return (
      <NodeViewWrapper
        contentEditable={false}
        className="my-6 rounded-xl border-2 border-dashed bg-muted/20 p-6 space-y-4 text-sm"
      >
        <div className="flex items-center gap-2 font-medium">
          <FileText className="size-5" /> Sisipkan PDF
        </div>

        {upload && (
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-4 py-6 hover:bg-accent">
            <Upload className="size-4" />
            {busy ? 'Mengunggah…' : `Pilih file PDF (maks ${maxMB} MB)`}
            <input
              type="file"
              accept="application/pdf"
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
            placeholder="atau tempel URL PDF (https://...)"
            className="flex-1 rounded-md border bg-background px-3 py-2"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="rounded-md bg-primary px-3 text-primary-foreground"
          >
            Pasang
          </button>
        </div>

        {error && <p className="text-destructive">{error}</p>}
      </NodeViewWrapper>
    )
  }

  // Sudah ada PDF
  return (
    <NodeViewWrapper
      className={`my-6 overflow-hidden rounded-xl border bg-card ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
    >
      {editable && (
        <div
          contentEditable={false}
          className="flex flex-wrap items-center gap-2 border-b bg-muted/40 px-3 py-2 text-sm"
        >
          <FileText className="size-4 text-muted-foreground" />
          <input
            key={title}
            defaultValue={title}
            placeholder="Judul PDF (opsional)"
            onBlur={(e) => updateAttributes({ title: e.target.value.trim() })}
            className="min-w-32 flex-1 bg-transparent outline-none"
          />
          <select
            value={height}
            onChange={(e) =>
              updateAttributes({ height: Number(e.target.value) })
            }
            className="rounded border bg-transparent px-1 py-0.5"
          >
            {HEIGHTS.map((h) => (
              <option key={h} value={h}>
                Tinggi {h}px
              </option>
            ))}
          </select>
          <button
            type="button"
            title="Ganti PDF"
            onClick={() => updateAttributes({ src: '' })}
            className="rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <Replace className="size-4" />
          </button>
          <button
            type="button"
            title="Hapus"
            onClick={() => deleteNode()}
            className="rounded p-1 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}

      <Suspense
        fallback={
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Memuat PDF…
          </div>
        }
      >
        <PdfCanvas key={safeSrc} src={safeSrc} title={title} height={height} />
      </Suspense>
    </NodeViewWrapper>
  )
}
