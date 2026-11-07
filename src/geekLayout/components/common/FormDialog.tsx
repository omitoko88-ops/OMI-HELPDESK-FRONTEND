import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Icon } from '../ui/Icon'

interface FormDialogProps {
  open: boolean
  title: string
  description?: string
  /** Terminal-style kicker shown above the title, e.g. "// CREATE_DOCUMENT". */
  eyebrow?: string
  /** FontAwesome icon name used in the dialog header. */
  icon?: string
  confirmText?: string
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  submitDisabled?: boolean
  children: ReactNode
}

export function FormDialog({
  open,
  title,
  description,
  eyebrow,
  icon = 'file-lines',
  confirmText = 'Simpan',
  isPending,
  onOpenChange,
  onSubmit,
  submitDisabled,
  children,
}: FormDialogProps) {
  const kicker = eyebrow ?? `// ${title.trim().replace(/\s+/g, '_').toUpperCase()}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-slate-900/40 backdrop-blur-md"
        className="gap-0 overflow-hidden rounded-2xl border border-slate-300 bg-white p-0 shadow-2xl sm:max-w-md [&>button]:top-3.5 [&>button]:right-3.5 [&>button]:rounded-lg [&>button]:p-1.5 [&>button]:text-slate-400 [&>button]:opacity-100 [&>button]:transition-colors [&>button]:hover:bg-slate-200 [&>button]:hover:text-slate-700"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
        >
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-6 py-4 pr-14">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-geek-cyan bg-geek-cyan/15 text-xs text-geek-cyan">
              <Icon name={icon} />
            </div>
            <div className="min-w-0">
              <span className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
                {kicker}
              </span>
              <DialogTitle className="block truncate font-mono text-[11px] font-bold text-geek-secondary">
                {title}
              </DialogTitle>
            </div>
          </div>

          <div className="space-y-5 p-6 font-mono text-xs">
            {description && (
              <DialogDescription className="text-[11px] leading-relaxed text-slate-500">
                {description}
              </DialogDescription>
            )}
            <div className="space-y-4">{children}</div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg bg-slate-200 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 transition-all hover:bg-slate-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending || submitDisabled}
              className="rounded-lg bg-geek-secondary px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPending ? 'Menyimpan...' : confirmText}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
