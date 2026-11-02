import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'
import { ImageIcon } from 'lucide-react'

export const ImageInsertButton = ({ editor }: ToolbarButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    title="Sisipkan gambar"
    onClick={() => editor.chain().focus().insertImagePlaceholder().run()}
  >
    <ImageIcon className="w-5 h-5" />
  </Button>
)
