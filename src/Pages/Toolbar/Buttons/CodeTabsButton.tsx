import { Terminal } from 'lucide-react'
import { ToolbarButtonProps } from '../types'
import { Button } from '@/components/ui/button'

export const CodeTabsInsertButton = ({ editor }: ToolbarButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    onClick={() => editor.chain().focus().insertCodeTabs().run()}
  >
    <Terminal className="w-5 h-5" />
  </Button>
)
