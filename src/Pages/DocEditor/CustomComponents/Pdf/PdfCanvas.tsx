import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const iconBtn =
  'inline-flex size-8 items-center justify-center rounded-md hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent'

export default function PdfCanvas({
  src,
  title,
  height,
}: {
  src: string
  title?: string
  height: number
}) {
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [width, setWidth] = useState(0)
  const [failed, setFailed] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  // Lebar halaman mengikuti lebar kontainer
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Pindah halaman → scroll ke atas
  useEffect(() => {
    boxRef.current?.scrollTo({ top: 0 })
  }, [page])

  return (
    <div>
      <div className="flex h-10 items-center justify-between gap-2 border-b bg-muted/40 px-2 text-sm">
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            className={iconBtn}
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            title="Halaman sebelumnya"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="tabular-nums text-muted-foreground">
            {numPages ? `${page} / ${numPages}` : '–'}
          </span>
          <button
            type="button"
            className={iconBtn}
            disabled={page >= numPages}
            onClick={() => setPage((p) => p + 1)}
            title="Halaman berikutnya"
          >
            <ChevronRight className="size-4" />
          </button>
          {title && <span className="ml-2 truncate font-medium">{title}</span>}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className={iconBtn}
            disabled={zoom <= 0.5}
            onClick={() =>
              setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))
            }
            title="Perkecil"
          >
            <ZoomOut className="size-4" />
          </button>
          <span className="w-10 text-center tabular-nums text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            className={iconBtn}
            disabled={zoom >= 3}
            onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
            title="Perbesar"
          >
            <ZoomIn className="size-4" />
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className={iconBtn}
            title="Buka di tab baru"
          >
            <ExternalLink className="size-4" />
          </a>
          <a href={src} download className={iconBtn} title="Unduh">
            <Download className="size-4" />
          </a>
        </div>
      </div>

      <div
        ref={boxRef}
        style={{ height }}
        className="overflow-auto bg-muted/20 p-4 [scrollbar-gutter:stable]"
      >
        {failed ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <p>PDF tidak bisa ditampilkan di sini.</p>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Buka PDF di tab baru
            </a>
          </div>
        ) : (
          <Document
            file={src}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={() => setFailed(true)}
            loading={<p className="text-sm text-muted-foreground">Memuat…</p>}
            error={null}
          >
            {width > 0 && (
              <div className="mx-auto w-max shadow-md">
                <Page pageNumber={page} width={Math.round(width * zoom)} />
              </div>
            )}
          </Document>
        )}
      </div>
    </div>
  )
}
