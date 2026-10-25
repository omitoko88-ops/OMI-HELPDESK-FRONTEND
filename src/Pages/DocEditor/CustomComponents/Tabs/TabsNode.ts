import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import TabsComponent from './TabsComponent'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    regularTabs: {
      insertTabs: () => ReturnType
    }
  }
}

// Satu tab = satu panel yang isinya boleh blok apa saja
export const TabPanel = Node.create({
  name: 'tabPanel',
  content: 'block+',
  defining: true,
  isolating: true, // Backspace di awal panel tidak menggabung ke tab lain

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
    return [{ tag: 'div[data-type="tab-panel"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'tab-panel' }),
      0,
    ]
  },
})

export const TabsNode = Node.create({
  name: 'tabs',
  group: 'block',
  content: 'tabPanel+',
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="tabs"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'tabs' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TabsComponent)
  },

  addCommands() {
    return {
      insertTabs:
        () =>
        ({ commands, tr }) => {
          const inserted = commands.insertContent({
            type: this.name,
            content: [
              {
                type: 'tabPanel',
                attrs: { label: 'Tab 1' },
                content: [{ type: 'paragraph' }],
              },
              {
                type: 'tabPanel',
                attrs: { label: 'Tab 2' },
                content: [{ type: 'paragraph' }],
              },
            ],
          })
          if (!inserted) return false

          // Pindahkan kursor ke paragraf pertama di tab pertama
          const { $from } = tr.selection
          for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.name === this.name) {
              tr.setSelection(TextSelection.create(tr.doc, $from.start(d) + 2))
              break
            }
          }
          return true
        },
    }
  },
})
