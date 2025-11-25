import { Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'

export const CodeButton = ({ editor }: ToolbarButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    onClick={() => editor.chain().focus().toggleCode().run()}
    className={editor.isActive('code') ? 'bg-accent' : ''}
  >
    <Code className="w-4 h-4" />
  </Button>
)
