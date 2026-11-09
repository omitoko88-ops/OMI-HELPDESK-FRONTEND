// ListVariant.ts
// Tujuan: menambahkan atribut "variant" (gaya tampilan) ke list bawaan Tiptap
// (bulletList dan orderedList) TANPA mengganti node aslinya.
// Jadi Enter, Tab (nested), dan input rule "- " / "1. " tetap bekerja seperti biasa.

// Extension = kelas dasar Tiptap untuk fitur yang bukan node dan bukan mark.
// Kita memakainya karena kita hanya MENAMBAH atribut ke node yang sudah ada.
import { Extension } from '@tiptap/core'

// Gaya yang diizinkan untuk <ul> (bullet list).
// "as const" membuat TypeScript memperlakukannya sebagai nilai tetap.
export const BULLET_VARIANTS = ['check', 'cross', 'arrow', 'dash'] as const

// Gaya yang diizinkan untuk <ol> (numbered list).
export const ORDERED_VARIANTS = ['badge', 'alpha', 'roman'] as const

export const ListVariant = Extension.create({
  // Nama unik extension. Dipakai Tiptap secara internal.
  name: 'listVariant',

  // addGlobalAttributes = cara resmi Tiptap menambah atribut ke node LAIN.
  addGlobalAttributes() {
    return [
      {
        // Node yang akan menerima atribut. Nama harus sama persis dengan nama node di Tiptap.
        types: ['bulletList', 'orderedList'],

        attributes: {
          // Nama atribut. Nanti bisa dibaca lewat node.attrs.variant
          variant: {
            // Nilai awal. null = "otomatis", artinya gaya mengikuti level nesting.
            default: null,

            // parseHTML: dipanggil saat HTML dibaca (misalnya konten dimuat dari database).
            // Membaca atribut data-variant dari tag <ul>/<ol>.
            parseHTML: (el: HTMLElement) => {
              // Ambil nilai mentah, misalnya "check"
              const v = el.getAttribute('data-variant')

              // <ol> hanya boleh gaya numbered, <ul> hanya boleh gaya bullet.
              // Dengan cek ini, nilai sembarang dari luar akan diabaikan.
              const allowed: readonly string[] =
                el.tagName === 'OL' ? ORDERED_VARIANTS : BULLET_VARIANTS

              // Nilai valid dipakai; selain itu jatuh ke null (gaya otomatis)
              return v && allowed.includes(v) ? v : null
            },

            // renderHTML: dipanggil saat dokumen diubah ke HTML (getHTML()).
            // Atribut hanya ditulis kalau gayanya BUKAN otomatis,
            // sehingga list biasa tetap menghasilkan HTML bersih (<ul> tanpa atribut).
            renderHTML: (attrs: Record<string, unknown>) =>
              attrs.variant ? { 'data-variant': attrs.variant } : {},
          },
        },
      },
    ]
  },
})
