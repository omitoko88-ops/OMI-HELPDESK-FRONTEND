// TabsInsertButton.tsx
import { PanelTop } from 'lucide-react'
import { ToolbarButtonProps } from '../types'
import { Button } from '@/components/ui/button'

export const TabsInsertButton = ({ editor }: ToolbarButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    onClick={() => editor.chain().focus().insertTabs().run()}
  >
    <PanelTop className="w-5 h-5" />
  </Button>
)
