import { Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToolbarButtonProps } from '../types'

export const ImageUploadButton = ({ editor }: ToolbarButtonProps) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => document.getElementById('image-upload')?.click()}
      >
        <ImageIcon className="w-4 h-4" />
      </Button>

      <input
        id="image-upload"
        type="file"
        hidden
        accept="image/*"
        onChange={handleUpload}
      />
    </>
  )
}
