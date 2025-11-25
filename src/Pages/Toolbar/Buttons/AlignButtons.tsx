import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'

export const AlignButtons = ({ editor }: ToolbarButtonProps) => (
  <>
    <Button
      variant="outline"
      size="sm"
      onClick={() => editor.chain().focus().setTextAlign('left').run()}
      className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}
    >
      <AlignLeft className="w-4 h-4" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => editor.commands.setTextAlign('center')}
      className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}
    >
      <AlignCenter className="w-4 h-4" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => editor.chain().focus().setTextAlign('right').run()}
      className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}
    >
      <AlignRight className="w-4 h-4" />
    </Button>
  </>
)
