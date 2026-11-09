// BlockLineHeight.ts
// Jarak baris (line-height) per BLOK (paragraf/heading), bukan per teks inline.
// Alasan: line-height pada <span> inline tidak bisa memperkecil tinggi baris,
// karena tinggi baris ditentukan oleh paragraf induknya.

import { Extension } from '@tiptap/core'

// Mendaftarkan tipe perintah baru agar TypeScript mengenali
// editor.commands.setBlockLineHeight(...) dan unsetBlockLineHeight().
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blockLineHeight: {
      setBlockLineHeight: (value: string) => ReturnType
      unsetBlockLineHeight: () => ReturnType
    }
  }
}

export const BlockLineHeight = Extension.create({
  name: 'blockLineHeight',

  // Node yang boleh diatur jarak barisnya. Bisa diubah lewat .configure({ types: [...] }).
  addOptions() {
    return { types: ['paragraph', 'heading'] }
  },

  // Menambahkan atribut "lineHeight" ke node di atas tanpa mengubah definisinya.
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null, // null = ikuti gaya bawaan (prose)

            // Baca dari HTML: <p style="line-height: 1.5">
            parseHTML: (el: HTMLElement) => el.style.lineHeight || null,

            // Tulis ke HTML. Hanya muncul kalau nilainya diatur.
            // Style ini otomatis digabung dengan style lain (mis. text-align dari TextAlign).
            renderHTML: (attrs: Record<string, unknown>) =>
              attrs.lineHeight
                ? { style: `line-height: ${attrs.lineHeight}` }
                : {},
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      // Set nilai ke semua paragraf/heading yang terkena seleksi
      setBlockLineHeight:
        (value) =>
        ({ commands }) =>
          this.options.types
            .map((type: string) =>
              commands.updateAttributes(type, { lineHeight: value }),
            )
            .some(Boolean),

      // Kembalikan ke bawaan (atribut dihapus)
      unsetBlockLineHeight:
        () =>
        ({ commands }) =>
          this.options.types
            .map((type: string) => commands.resetAttributes(type, 'lineHeight'))
            .some(Boolean),
    }
  },
})
