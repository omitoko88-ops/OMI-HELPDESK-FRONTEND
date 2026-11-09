// ListItemWithHeading.ts
// Tujuan: mengizinkan heading (h1-h6) sebagai isi item list.
// Tanpa ini, menekan H2 di dalam list malah mengeluarkan teks dari list.

// ListItem bawaan Tiptap v3 ada di paket @tiptap/extension-list.
// (Kalau import ini error di versimu, coba: import { ListItem } from '@tiptap/extension-list-item')
import { ListItem } from '@tiptap/extension-list'

export const ListItemWithHeading = ListItem.extend({
  // Bawaan  : 'paragraph block*'              -> blok pertama WAJIB paragraf
  // Diubah  : '(paragraph | heading) block*'  -> blok pertama boleh paragraf ATAU heading,
  //           blok-blok sesudahnya tetap boleh apa saja (termasuk list bersarang).
  content: '(paragraph | heading) block*',
})
