import { Node, mergeAttributes } from '@tiptap/core'
import { Selection, TextSelection } from '@tiptap/pm/state'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    docSteps: {
      insertSteps: () => ReturnType
      addStep: () => ReturnType
      removeStep: () => ReturnType
    }
  }
}

const stepJSON = (title: string) => ({
  type: 'step',
  content: [
    { type: 'stepTitle', content: [{ type: 'text', text: title }] },
    { type: 'stepBody', content: [{ type: 'paragraph' }] },
  ],
})

// Judul langkah: teks polos saja
export const StepTitle = Node.create({
  name: 'stepTitle',
  content: 'text*',
  marks: '',

  parseHTML() {
    return [{ tag: 'div[data-type="step-title"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'step-title',
        role: 'heading',
        'aria-level': '3',
      }),
      0,
    ]
  },

  // Enter di judul = pindah ke isi langkah (bukan membuat judul kedua)
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) =>
        editor.commands.command(({ state, tr, dispatch }) => {
          const { $from } = state.selection
          if ($from.parent.type.name !== this.name) return false
          if (dispatch) {
            const next = Selection.near(tr.doc.resolve($from.after() + 1), 1)
            tr.setSelection(next).scrollIntoView()
          }
          return true
        }),
    }
  },
})

// Isi langkah: blok apa saja
export const StepBody = Node.create({
  name: 'stepBody',
  content: 'block+',
  isolating: true, // Backspace di awal isi tidak menyatu ke judul

  parseHTML() {
    return [{ tag: 'div[data-type="step-body"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'step-body' }),
      0,
    ]
  },
})

export const Step = Node.create({
  name: 'step',
  content: 'stepTitle stepBody',
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="step"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'step' }), 0]
  },
})

export const Steps = Node.create({
  name: 'steps',
  group: 'block',
  content: 'step+',
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-type="steps"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'steps' }), 0]
  },

  addCommands() {
    return {
      // Sisipkan blok Steps baru (2 langkah), teks judul pertama langsung terseleksi
      insertSteps:
        () =>
        ({ commands, tr }) => {
          const first = 'Langkah pertama'
          const inserted = commands.insertContent({
            type: this.name,
            content: [stepJSON(first), stepJSON('Langkah kedua')],
          })
          if (!inserted) return false

          const { $from } = tr.selection
          for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.name === this.name) {
              const start = $from.start(d) + 2 // masuk ke teks judul langkah pertama
              tr.setSelection(
                TextSelection.create(tr.doc, start, start + first.length),
              )
              break
            }
          }
          return true
        },

      // Tambah langkah tepat setelah langkah tempat kursor berada
      addStep:
        () =>
        ({ state, chain }) => {
          const title = 'Langkah baru'
          const { $from } = state.selection
          for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.name === 'step') {
              const pos = $from.after(d)
              return chain()
                .insertContentAt(pos, stepJSON(title))
                .setTextSelection({ from: pos + 2, to: pos + 2 + title.length })
                .run()
            }
          }
          return false
        },

      // Hapus langkah tempat kursor berada (kalau tinggal satu, hapus seluruh blok)
      removeStep:
        () =>
        ({ state, chain }) => {
          const { $from } = state.selection
          for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.name === 'step') {
              const only = $from.node(d - 1).childCount === 1
              const target = only ? d - 1 : d
              return chain()
                .deleteRange({
                  from: $from.before(target),
                  to: $from.after(target),
                })
                .run()
            }
          }
          return false
        },
    }
  },
})
