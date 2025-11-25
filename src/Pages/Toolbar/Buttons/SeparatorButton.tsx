import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'

export const SeparatorButton = ({ editor }: ToolbarButtonProps) => (
  <Button
    variant={'outline'}
    size={'sm'}
    onClick={() => editor?.commands.insertCustomSeparator()}
    className=" border rounded"
  >
    {`<->`}
  </Button>
)
