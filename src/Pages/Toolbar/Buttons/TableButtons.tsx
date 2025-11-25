import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'
import { TableIcon, Trash2 } from 'lucide-react'

export const TableButtons = ({ editor }: ToolbarButtonProps) => {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <TableIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </>
  )
}
