import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'
import { CheckSquare, List, ListOrdered } from 'lucide-react'

export const ListButtons = ({ editor }: ToolbarButtonProps) => (
  <>
    <Button
      variant="outline"
      size="sm"
      onClick={() => editor.chain().focus().toggleBulletList().run()}
      className={editor.isActive('bulletList') ? 'bg-accent' : ''}
    >
      <List className="w-4 h-4" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
      className={editor.isActive('orderedList') ? 'bg-accent' : ''}
    >
      <ListOrdered className="w-4 h-4" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => editor.chain().focus().toggleTaskList().run()}
      className={editor.isActive('taskList') ? 'bg-accent' : ''}
    >
      <CheckSquare className="w-4 h-4" />
    </Button>
  </>
)
