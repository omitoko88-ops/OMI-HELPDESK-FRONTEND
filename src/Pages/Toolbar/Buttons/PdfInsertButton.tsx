// PdfInsertButton.tsx
import { FileText } from 'lucide-react'
import { ToolbarButtonProps } from '../types'
import { Button } from '@/components/ui/button'

export const PdfInsertButton = ({ editor }: ToolbarButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    title="Sisipkan PDF"
    onClick={() => editor.chain().focus().insertPdfViewer().run()}
  >
    <FileText className="w-5 h-5" />
  </Button>
)
