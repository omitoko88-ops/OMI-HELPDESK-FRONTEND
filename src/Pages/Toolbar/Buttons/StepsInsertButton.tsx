// Buttons/StepsInsertButton.tsx
import { useEditorState } from '@tiptap/react'
import { ListChecks, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'

export const StepsInsertButton = ({ editor }: ToolbarButtonProps) => {
  const inStep = useEditorState({
    editor,
    selector: ({ editor }) => !!editor?.isActive('step'),
  })

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        title={inStep ? 'Tambah langkah setelah langkah ini' : 'Sisipkan Steps'}
        onClick={() =>
          inStep
            ? editor.chain().focus().addStep().run()
            : editor.chain().focus().insertSteps().run()
        }
      >
        <ListChecks className="w-5 h-5" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        title="Hapus langkah ini"
        disabled={!inStep}
        className="hover:text-destructive"
        onClick={() => {
          if (window.confirm('Hapus langkah ini?')) {
            editor.chain().focus().removeStep().run()
          }
        }}
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </>
  )
}
