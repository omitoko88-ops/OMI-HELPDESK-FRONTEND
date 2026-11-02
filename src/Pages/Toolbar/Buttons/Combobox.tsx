import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'
import { ChevronsUpDown } from 'lucide-react'

export const ComboboxInsertButton = ({ editor }: ToolbarButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    title="Combobox (di dalam teks/sel)"
    onClick={() => editor.chain().focus().insertInlineCombobox().run()}
  >
    <ChevronsUpDown className="w-5 h-5" />
  </Button>
)
