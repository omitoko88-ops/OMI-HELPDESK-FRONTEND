import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import CodeTabsComponent from './CodeTabsComponent'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    codeTabs: {
      insertCodeTabs: () => ReturnType
    }
  }
}

// Satu tab = satu blok kode (teks polos, newline dipertahankan)
export const CodeTab = Node.create({
  name: 'codeTab',
  content: 'text*',
  marks: '', // tidak boleh bold/italic di dalam kode
  code: true, // Enter = newline, whitespace dipertahankan
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      label: {
        default: 'Tab',
        parseHTML: (el) => el.getAttribute('data-label') ?? 'Tab',
        renderHTML: (attrs) => ({ 'data-label': attrs.label }),
      },
    }
  },

  parseHTML() {
    // preserveWhitespace penting supaya newline tidak hilang saat HTML di-parse ulang
    return [{ tag: 'div[data-type="code-tab"]', preserveWhitespace: 'full' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'code-tab',
        class: 'whitespace-pre',
      }),
      0,
    ]
  },
})

// Wadah semua tab
export const CodeTabs = Node.create({
  name: 'codeTabs',
  group: 'block',
  content: 'codeTab+',
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="code-tabs"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'code-tabs' }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeTabsComponent)
  },

  addCommands() {
    return {
      insertCodeTabs:
        () =>
        ({ commands, tr }) => {
          const inserted = commands.insertContent({
            type: this.name,
            content: [
              { type: 'codeTab', attrs: { label: 'Tab 1' } },
              { type: 'codeTab', attrs: { label: 'Tab 2' } },
            ],
          })
          if (!inserted) return false

          // Default Tiptap menaruh kursor di akhir konten (= tab terakhir).
          // Pindahkan ke dalam tab pertama.
          const { $from } = tr.selection
          for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.name === 'codeTabs') {
              tr.setSelection(TextSelection.create(tr.doc, $from.start(d) + 1))
              break
            }
          }
          return true
        },
    }
  },

  // Warna kata pertama tiap baris (seperti "npm" merah di UI statismu).
  // Jalan di editor maupun viewer karena ini bagian dari extension.
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('codeTabsHighlight'),
        props: {
          decorations(state) {
            const decorations: Decoration[] = []
            state.doc.descendants((node, pos) => {
              if (node.type.name !== 'codeTab') return
              let offset = 0
              node.textContent.split('\n').forEach((line) => {
                const m = line.match(/^(\s*)(\S+)/)
                if (m) {
                  const from = pos + 1 + offset + m[1].length
                  decorations.push(
                    Decoration.inline(from, from + m[2].length, {
                      class: 'text-[#F7768E]',
                    }),
                  )
                }
                offset += line.length + 1
              })
              return false
            })
            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },
})
