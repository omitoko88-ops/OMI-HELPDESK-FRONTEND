import { Italic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'

export const ItalicButton = ({ editor }: ToolbarButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    onClick={() => editor.chain().focus().toggleItalic().run()}
    className={editor.isActive('italic') ? 'bg-accent' : ''}
  >
    <Italic className="w-4 h-4" />
  </Button>
)
