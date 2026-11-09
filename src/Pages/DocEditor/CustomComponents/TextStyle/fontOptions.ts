// fontOptions.ts
// Daftar pilihan untuk kontrol font di toolbar. Ubah di sini untuk menambah/mengurangi opsi.

// value '' = "Bawaan" (gaya dihapus, ikut tema/prose).
// Tiap value berisi font cadangan (fallback) kalau font utama tidak tersedia di perangkat pembaca.
export const FONT_FAMILIES = [
  { label: 'Bawaan', value: '' },
  {
    label: 'Sans Serif',
    value: 'ui-sans-serif, system-ui, "Segoe UI", Roboto, Arial, sans-serif',
  },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Monospace', value: 'ui-monospace, Menlo, Consolas, monospace' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  // Tiga font di bawah butuh paket @fontsource (lihat langkah 0). Hapus kalau tidak dipakai.
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Merriweather', value: 'Merriweather, serif' },
  { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
]

// Ukuran font dalam px. '' = bawaan.
export const FONT_SIZES = [
  '',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '28px',
  '32px',
  '40px',
  '48px',
]

// Jarak baris (angka tanpa satuan = kelipatan ukuran font). '' = bawaan.
export const LINE_HEIGHTS = [
  { label: 'Bawaan', value: '' },
  { label: 'Rapat (1.0)', value: '1' },
  { label: 'Sempit (1.25)', value: '1.25' },
  { label: 'Normal (1.5)', value: '1.5' },
  { label: 'Longgar (1.75)', value: '1.75' },
  { label: 'Lebar (2.0)', value: '2' },
]

// Warna teks. Sengaja nada menengah (tanpa hitam/putih murni) supaya tetap terbaca
// di light DAN dark mode, karena warna yang dipilih tersimpan tetap, tidak ikut tema.
export const TEXT_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
  '#a16207',
  '#15803d',
  '#1d4ed8',
]

// Warna stabilo (latar teks). Tembus pandang, jadi teks di atasnya tetap terbaca di kedua tema.
export const HIGHLIGHT_COLORS = [
  'rgba(250, 204, 21, 0.35)', // kuning
  'rgba(74, 222, 128, 0.35)', // hijau
  'rgba(56, 189, 248, 0.35)', // biru muda
  'rgba(244, 114, 182, 0.35)', // merah muda
  'rgba(251, 146, 60, 0.35)', // oranye
  'rgba(167, 139, 250, 0.35)', // ungu
]
