import { Bold } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'

export const BoldButton = ({ editor }: ToolbarButtonProps) => (
  <Button
    size="sm"
    variant="outline"
    onClick={() => editor.chain().focus().toggleBold().run()}
    className={editor.isActive('bold') ? 'bg-accent' : ''}
  >
    <Bold className="w-4 h-4" />
  </Button>
)
