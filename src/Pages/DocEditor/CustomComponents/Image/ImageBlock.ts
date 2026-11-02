import Image, { type ImageOptions } from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/core'
import ImageBlockComponent from './ImageBlockComponent'

export interface ImageBlockOptions {
  /** Unggah file ke server-mu, kembalikan URL permanennya */
  upload?: (file: File) => Promise<string>
  maxSizeMB: number
  /** Dipanggil saat paste/drop gagal (mis. tampilkan toast) */
  onError?: (message: string) => void
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageBlock: {
      /** Sisipkan blok gambar kosong (menampilkan pemilih file/URL) */
      insertImagePlaceholder: () => ReturnType
    }
  }
}

export const IMAGE_ACCEPT = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]
const ALIGNS = ['left', 'center', 'right']

const pickImages = (list?: FileList | null) =>
  Array.from(list ?? []).filter((f) => IMAGE_ACCEPT.includes(f.type))

async function uploadAndInsert(
  ext: { name: string; options: ImageBlockOptions; editor: Editor },
  files: File[],
  firstPos: number | null,
) {
  let at = firstPos
  for (const file of files) {
    if (file.size > ext.options.maxSizeMB * 1024 * 1024) {
      ext.options.onError?.(
        `"${file.name}" melebihi ${ext.options.maxSizeMB} MB`,
      )
      continue
    }
    try {
      const src = await ext.options.upload!(file)
      const node = {
        type: ext.name,
        attrs: { src, alt: file.name.replace(/\.[^.]+$/, '') },
      }
      const chain = ext.editor.chain().focus()
      if (at != null) {
        chain
          .insertContentAt(
            Math.min(at, ext.editor.state.doc.content.size),
            node,
          )
          .run()
      } else {
        chain.insertContent(node).run() // di posisi kursor (setelah gambar sebelumnya)
      }
      at = null
    } catch {
      ext.options.onError?.(`Gagal mengunggah "${file.name}"`)
    }
  }
}

export const ImageBlock = Image.extend<ImageOptions & ImageBlockOptions>({
  // Dipindah lewat drag handle blok, bukan drag bawaan (bentrok dengan handle resize)
  draggable: false,

  addOptions() {
    return {
      ...(this.parent?.() as ImageOptions),
      upload: undefined,
      maxSizeMB: 5,
      onError: undefined,
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 100,
        parseHTML: (el) => {
          const w = Number(el.getAttribute('data-width'))
          return w >= 10 && w <= 100 ? w : 100
        },
        renderHTML: (attrs) => ({ 'data-width': attrs.width }),
      },
      align: {
        default: 'center',
        parseHTML: (el) => {
          const a = el.getAttribute('data-align') ?? ''
          return ALIGNS.includes(a) ? a : 'center'
        },
        renderHTML: (attrs) => ({ 'data-align': attrs.align }),
      },
      caption: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-caption') ?? '',
        renderHTML: (attrs) =>
          attrs.caption ? { 'data-caption': attrs.caption } : {},
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockComponent)
  },

  addCommands() {
    return {
      ...this.parent?.(),
      insertImagePlaceholder:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src: '' } }),
    }
  },

  // Paste screenshot & drag-drop file gambar → unggah lalu sisipkan
  addProseMirrorPlugins() {
    const ext = this
    return [
      new Plugin({
        key: new PluginKey('imageBlockUpload'),
        props: {
          handlePaste(_view, event) {
            const files = pickImages(event.clipboardData?.files)
            if (!files.length || !ext.options.upload || !ext.editor.isEditable)
              return false
            event.preventDefault()
            uploadAndInsert(ext, files, null)
            return true
          },
          handleDrop(view, event) {
            const files = pickImages(event.dataTransfer?.files)
            if (!files.length || !ext.options.upload || !ext.editor.isEditable)
              return false
            event.preventDefault()
            const coords = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })
            uploadAndInsert(ext, files, coords?.pos ?? null)
            return true
          },
        },
      }),
    ]
  },
})
