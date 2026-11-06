import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface InputDialogProps {
  open: boolean
  title: string
  description?: string
  label: string
  placeholder?: string
  defaultValue?: string
  confirmText?: string
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (value: string) => void | Promise<void>
}

export function InputDialog({
  open,
  title,
  description,
  label,
  placeholder,
  defaultValue = '',
  confirmText = 'Simpan',
  isPending,
  onOpenChange,
  onConfirm,
}: InputDialogProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (open) setValue(defaultValue)
  }, [defaultValue, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="input-dialog-value">
            {label}
          </label>
          <Input
            id="input-dialog-value"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && value.trim()) void onConfirm(value.trim())
            }}
            placeholder={placeholder}
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            onClick={() => void onConfirm(value.trim())}
            disabled={!value.trim() || isPending}
          >
            {isPending ? 'Menyimpan...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
