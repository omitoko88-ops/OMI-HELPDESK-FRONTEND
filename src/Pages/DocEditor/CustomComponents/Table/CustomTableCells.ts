import { TableCell, TableHeader } from '@tiptap/extension-table'

export const CELL_TONES = ['yellow', 'red', 'green', 'blue'] as const
export type CellTone = (typeof CELL_TONES)[number]

const toneAttribute = {
  tone: {
    default: null as CellTone | null,
    parseHTML: (el: HTMLElement) => {
      const v = el.getAttribute('data-tone')
      return CELL_TONES.includes(v as CellTone) ? v : null
    },
    renderHTML: (attrs: Record<string, unknown>) =>
      attrs.tone ? { 'data-tone': attrs.tone } : {},
  },
}

export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return { ...this.parent?.(), ...toneAttribute }
  },
})

export const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return { ...this.parent?.(), ...toneAttribute }
  },
})
