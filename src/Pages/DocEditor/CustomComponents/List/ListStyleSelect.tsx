// ListStyleSelect.tsx
// Dropdown di toolbar untuk mengganti gaya list tempat kursor berada.
// Selalu tampil (nonaktif kalau kursor di luar list) supaya toolbar tidak bergeser.

// useEditorState: hook Tiptap agar komponen re-render saat state editor berubah
// (tanpa re-render di setiap ketikan).
import { useEditorState, type Editor } from '@tiptap/react'
// Tipe props yang sama dengan tombol toolbar lain (TipInsertButton dll.)
import { ToolbarButtonProps } from '@/Pages/Toolbar/types'

// Pilihan gaya untuk bullet list. value '' = otomatis (mengikuti level).
const BULLET_STYLES = [
  { value: '', label: 'Otomatis (• ◦ ▪)' },
  { value: 'check', label: 'Centang ✓' },
  { value: 'cross', label: 'Silang ✕' },
  { value: 'arrow', label: 'Panah →' },
  { value: 'dash', label: 'Strip –' },
]

// Pilihan gaya untuk numbered list.
const ORDERED_STYLES = [
  { value: '', label: 'Otomatis (1 → a → i)' },
  { value: 'badge', label: 'Angka dalam lingkaran' },
  { value: 'alpha', label: 'Huruf (a, b, c)' },
  { value: 'roman', label: 'Romawi (i, ii, iii)' },
]

// Mencari list TERDALAM tempat kursor berada.
// editor.isActive('bulletList') tidak cukup karena pada list bersarang
// ia bisa bernilai true untuk beberapa level sekaligus.
function findActiveList(editor: Editor) {
  // $from = posisi awal seleksi, dengan info "pohon" node di atasnya
  const { $from } = editor.state.selection

  // Naik dari node terdalam (depth terbesar) ke akar (depth 1)
  for (let d = $from.depth; d > 0; d--) {
    const node = $from.node(d) // node pada kedalaman d
    if (node.type.name === 'bulletList' || node.type.name === 'orderedList') {
      return {
        type: node.type.name as 'bulletList' | 'orderedList',
        variant: (node.attrs.variant as string | null) ?? '', // null -> '' (otomatis)
      }
    }
  }
  return null // kursor tidak berada di dalam list
}

export const ListStyleSelect = ({ editor }: ToolbarButtonProps) => {
  // Hasil findActiveList dipantau; komponen hanya re-render kalau hasilnya berubah.
  const active = useEditorState({
    editor,
    selector: ({ editor }) => (editor ? findActiveList(editor) : null),
  })

  // Dipanggil saat pengguna memilih gaya baru dari dropdown
  const apply = (value: string) => {
    editor
      .chain()
      .focus() // kembalikan fokus ke editor setelah klik dropdown
      .command(({ tr }) => {
        // tr = transaksi yang sedang disusun. Ambil posisi kursor dari sini.
        const { $from } = tr.selection

        // Cari lagi list terdalam, lalu ubah atributnya
        for (let d = $from.depth; d > 0; d--) {
          const node = $from.node(d)
          if (
            node.type.name === 'bulletList' ||
            node.type.name === 'orderedList'
          ) {
            // setNodeMarkup mengubah atribut node di posisi tertentu.
            // $from.before(d) = posisi tepat sebelum list itu.
            // Dengan cara ini HANYA list terdalam yang berubah, bukan list induknya.
            tr.setNodeMarkup($from.before(d), undefined, {
              ...node.attrs, // pertahankan atribut lain (mis. "start")
              variant: value || null, // '' dikembalikan ke null (otomatis)
            })
            return true // perintah berhasil
          }
        }
        return false // tidak ada list di kursor, tidak melakukan apa-apa
      })
      .run() // eksekusi semua perintah di chain
  }

  // Pilih daftar opsi sesuai jenis list yang aktif
  const styles = active?.type === 'orderedList' ? ORDERED_STYLES : BULLET_STYLES

  return (
    <select
      title="Gaya list"
      disabled={!active} // nonaktif kalau kursor di luar list
      value={active?.variant ?? ''} // tampilkan gaya list saat ini
      onChange={(e) => apply(e.target.value)}
      className="h-8 rounded-md border bg-background px-2 text-xs disabled:opacity-50"
    >
      {/* Placeholder saat kursor tidak di dalam list */}
      {!active && <option value="">Gaya list</option>}

      {/* Opsi gaya hanya ditampilkan saat kursor di dalam list */}
      {active &&
        styles.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
    </select>
  )
}
