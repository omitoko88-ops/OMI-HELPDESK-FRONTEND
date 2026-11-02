export const docStepsClasses = [
  // wadah + reset penghitung nomor
  '[&_[data-type=steps]]:my-6',
  '[&_[data-type=steps]]:[counter-reset:step]',

  // satu langkah
  '[&_[data-type=step]]:relative',
  '[&_[data-type=step]]:pl-10',
  'sm:[&_[data-type=step]]:pl-14',
  '[&_[data-type=step]]:pb-10',
  '[&_[data-type=step]:last-child]:pb-0',
  '[&_[data-type=step]]:[counter-increment:step]',

  // badge nomor (::before)
  '[&_[data-type=step]]:before:content-[counter(step)]',
  '[&_[data-type=step]]:before:absolute',
  '[&_[data-type=step]]:before:left-0',
  '[&_[data-type=step]]:before:top-0',
  '[&_[data-type=step]]:before:flex',
  '[&_[data-type=step]]:before:items-center',
  '[&_[data-type=step]]:before:justify-center',
  '[&_[data-type=step]]:before:size-8',
  'sm:[&_[data-type=step]]:before:size-10',
  '[&_[data-type=step]]:before:rounded-xl',
  '[&_[data-type=step]]:before:border-2',
  '[&_[data-type=step]]:before:border-border',
  '[&_[data-type=step]]:before:bg-card',
  '[&_[data-type=step]]:before:font-mono',
  '[&_[data-type=step]]:before:text-sm',
  '[&_[data-type=step]]:before:font-bold',
  '[&_[data-type=step]]:before:shadow-sm',
  '[&_[data-type=step]]:before:transition-all',

  // garis vertikal ke langkah berikutnya (::after)
  "[&_[data-type=step]]:after:content-['']",
  '[&_[data-type=step]]:after:absolute',
  '[&_[data-type=step]]:after:left-[15px]',
  'sm:[&_[data-type=step]]:after:left-[19px]',
  '[&_[data-type=step]]:after:top-10',
  '[&_[data-type=step]]:after:bottom-0',
  '[&_[data-type=step]]:after:w-[2px]',
  '[&_[data-type=step]]:after:bg-border',
  '[&_[data-type=step]]:after:transition-colors',

  // hover (bukan di langkah terakhir)
  '[&_[data-type=step]:not(:last-child):hover]:before:border-blue-500',
  '[&_[data-type=step]:not(:last-child):hover]:before:text-blue-500',
  '[&_[data-type=step]:not(:last-child):hover]:after:bg-blue-500/40',

  // langkah terakhir: badge hijau, tanpa garis
  '[&_[data-type=step]:last-child]:before:border-emerald-500',
  '[&_[data-type=step]:last-child]:before:bg-emerald-500',
  '[&_[data-type=step]:last-child]:before:text-white',
  '[&_[data-type=step]:last-child]:after:hidden',

  // judul
  '[&_[data-type=step-title]]:text-lg',
  '[&_[data-type=step-title]]:font-bold',
  '[&_[data-type=step-title]]:tracking-tight',
  '[&_[data-type=step-title]]:text-foreground',

  // isi: paragraf pertama = deskripsi (abu-abu), jarak antar blok seragam
  '[&_[data-type=step-body]]:mt-1',
  '[&_[data-type=step-body]]:text-sm',
  '[&_[data-type=step-body]]:leading-relaxed',
  '[&_[data-type=step-body]>*]:my-0',
  '[&_[data-type=step-body]>*+*]:mt-3',
  '[&_[data-type=step-body]>p:first-child]:text-muted-foreground',
  '[&_[data-type=step-body]>*:first-child:not(p)]:mt-3',
].join(' ')
