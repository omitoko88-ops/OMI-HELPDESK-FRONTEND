import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import InlineCheckboxComponent from './InlineCheckboxComponent'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineCheckbox: {
      insertInlineCheckbox: (checked?: boolean) => ReturnType
    }
  }
}

export const InlineCheckbox = Node.create({
  name: 'inlineCheckbox',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      checked: {
        default: false,
        parseHTML: (el) => el.getAttribute('data-checked') === 'true',
        renderHTML: (attrs) => ({ 'data-checked': String(!!attrs.checked) }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="inline-checkbox"]' }]
  },

  // Teks di dalamnya hanya fallback untuk HTML polos (tanpa JS)
  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-type': 'inline-checkbox' }),
      node.attrs.checked ? '☑' : '☐',
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(InlineCheckboxComponent)
  },

  addCommands() {
    return {
      insertInlineCheckbox:
        (checked = false) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { checked } }),
    }
  },
})
