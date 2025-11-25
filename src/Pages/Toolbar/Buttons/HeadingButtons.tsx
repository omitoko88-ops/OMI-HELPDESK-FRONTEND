import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'

export const HeadingButtons = ({ editor }: ToolbarButtonProps) => (
  <>
    <Button
      variant="outline"
      size="sm"
      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
    >
      H1
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
    >
      H2
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
    >
      H3
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      className={editor.isActive('heading', { level: 4 }) ? 'bg-accent' : ''}
    >
      H4
    </Button>
  </>
)
