export const docTableClasses = [
  // pembungkus: border luar, sudut membulat, scroll horizontal di layar sempit
  '[&_.tableWrapper]:my-6 [&_.tableWrapper]:overflow-x-auto [&_.tableWrapper]:rounded-xl [&_.tableWrapper]:border',

  // tabel + reset style bawaan prose
  '[&_table]:my-0 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm',
  '[&_tr]:border-0',

  // sel
  '[&_th]:relative [&_td]:relative',
  '[&_th]:border [&_td]:border [&_th]:px-3 [&_td]:px-3 [&_th]:py-2 [&_td]:py-2',
  '[&_th]:bg-muted/60 [&_th]:text-left [&_th]:font-semibold [&_td]:align-middle',
  '[&_td>p]:my-0 [&_th>p]:my-0',

  // hilangkan border ganda di tepi luar
  '[&_tr:first-child>*]:border-t-0 [&_tr:last-child>*]:border-b-0',
  '[&_tr>*:first-child]:border-l-0 [&_tr>*:last-child]:border-r-0',

  // sel yang sedang diseleksi (drag lintas sel)
  '[&_.selectedCell]:outline [&_.selectedCell]:outline-2 [&_.selectedCell]:-outline-offset-2 [&_.selectedCell]:outline-primary',

  // warna sel (tahan dark mode karena transparan)
  '[&_[data-tone=yellow]]:bg-yellow-500/20',
  '[&_[data-tone=red]]:bg-red-500/20',
  '[&_[data-tone=green]]:bg-green-500/20',
  '[&_[data-tone=blue]]:bg-blue-500/20',

  // handle resize kolom (dibutuhkan karena Table resizable: true)
  '[&_.column-resize-handle]:pointer-events-none [&_.column-resize-handle]:absolute [&_.column-resize-handle]:-right-0.5 [&_.column-resize-handle]:-bottom-0.5 [&_.column-resize-handle]:top-0 [&_.column-resize-handle]:w-1 [&_.column-resize-handle]:bg-primary',
  '[&_.resize-cursor]:cursor-col-resize',
].join(' ')
