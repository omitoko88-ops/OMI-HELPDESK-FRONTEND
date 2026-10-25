import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import PdfViewerComponent from './PdfViewerComponent'

export interface PdfViewerOptions {
  /** Upload file ke server kamu, kembalikan URL permanennya */
  upload?: (file: File) => Promise<string>
  maxSizeMB: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pdfViewer: {
      insertPdfViewer: (attrs?: { src?: string; title?: string }) => ReturnType
    }
  }
}

export const PdfViewer = Node.create<PdfViewerOptions>({
  name: 'pdfViewer',
  group: 'block',
  atom: true,

  addOptions() {
    return { upload: undefined, maxSizeMB: 20 }
  },

  addAttributes() {
    return {
      src: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-src') ?? '',
        renderHTML: (attrs) => ({ 'data-src': attrs.src }),
      },
      title: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-title') ?? '',
        renderHTML: (attrs) => ({ 'data-title': attrs.title }),
      },
      height: {
        default: 600,
        parseHTML: (el) => Number(el.getAttribute('data-height')) || 600,
        renderHTML: (attrs) => ({ 'data-height': attrs.height }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="pdf-viewer"]' }]
  },

  // Ada link di dalamnya sebagai fallback kalau JS belum jalan / dibaca crawler
  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'pdf-viewer' }),
      [
        'a',
        { href: node.attrs.src, target: '_blank', rel: 'noopener noreferrer' },
        node.attrs.title || 'Buka PDF',
      ],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(PdfViewerComponent)
  },

  addCommands() {
    return {
      insertPdfViewer:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    }
  },
})
