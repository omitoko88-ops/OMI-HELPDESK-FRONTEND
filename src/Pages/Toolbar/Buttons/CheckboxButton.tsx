import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'
import { CheckSquare } from 'lucide-react'

export const CheckboxInsertButton = ({ editor }: ToolbarButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    title="Checkbox (di dalam teks/sel)"
    onClick={() => editor.chain().focus().insertInlineCheckbox().run()}
  >
    <CheckSquare className="w-5 h-5" />
  </Button>
)
