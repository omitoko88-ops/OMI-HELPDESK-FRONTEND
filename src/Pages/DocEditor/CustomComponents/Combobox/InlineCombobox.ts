import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import InlineComboboxComponent from './InlineComboboxComponent'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineCombobox: {
      insertInlineCombobox: (attrs?: {
        value?: string
        options?: string[]
      }) => ReturnType
    }
  }
}

export const InlineCombobox = Node.create({
  name: 'inlineCombobox',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      value: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-value') ?? '',
        renderHTML: (attrs) => ({ 'data-value': attrs.value }),
      },
      options: {
        default: ['Opsi 1', 'Opsi 2', 'Opsi 3'],
        parseHTML: (el) => {
          try {
            const v = JSON.parse(el.getAttribute('data-options') ?? '[]')
            return Array.isArray(v)
              ? v.filter((x) => typeof x === 'string')
              : []
          } catch {
            return []
          }
        },
        renderHTML: (attrs) => ({
          'data-options': JSON.stringify(attrs.options),
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="inline-combobox"]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-type': 'inline-combobox' }),
      node.attrs.value,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(InlineComboboxComponent)
  },

  addCommands() {
    return {
      insertInlineCombobox:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { value: 'Opsi 1', ...attrs },
          }),
    }
  },
})
