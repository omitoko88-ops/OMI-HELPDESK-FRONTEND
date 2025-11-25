import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'
import { Strikethrough } from 'lucide-react'

export const StrikeButton = ({ editor }: ToolbarButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => editor.chain().focus().toggleStrike().run()}
      className={editor.isActive('strike') ? 'bg-accent' : ''}
    >
      <Strikethrough className="w-4 h-4" />
    </Button>
  )
}
