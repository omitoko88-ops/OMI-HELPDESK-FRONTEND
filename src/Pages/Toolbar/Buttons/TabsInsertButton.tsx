import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'
import { Folder } from 'lucide-react'

export const TabsInsertButton = ({ editor }: ToolbarButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'tabs',
            attrs: { active: 0 },
            content: [
              {
                type: 'tab',
                attrs: { title: 'npm' },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Npm Install' }],
                  },
                ],
              },
              {
                type: 'tab',
                attrs: { title: 'php' },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Composer Install' }],
                  },
                ],
              },
            ],
          })
          .run()
      }
      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800"
    >
      <Folder className="w-5 h-5 text-blue-600" />
    </Button>
  )
}
