import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'
import { Lightbulb } from 'lucide-react'

export const TipInsertButton = ({ editor }: ToolbarButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        editor
          .chain()
          .focus()
          .insertContent('<div data-type="tip-block">Your tip here...</div>')
          .run()
      }
      className="p-2 hover:bg-green-100 dark:hover:bg-green-800"
    >
      <Lightbulb className="w-5 h-5 text-green-600" />
    </Button>
  )
}
