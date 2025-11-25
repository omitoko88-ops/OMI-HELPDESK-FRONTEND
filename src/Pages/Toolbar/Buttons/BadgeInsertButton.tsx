import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ColorPicker from '@/components/common/CustomColorPicker'
import { ToolbarButtonProps } from '../types'

export const BadgeInsertButton = ({ editor }: ToolbarButtonProps) => {
  const [hexColor, setHexColor] = useState('#7af441')

  return (
    <div className="flex gap-2 items-center border rounded-lg relative p-2">
      <div className="absolute text-[8px] -top-2 left-3 bg-mute px-1">
        Badge
      </div>

      {/* Pilih warna */}
      <ColorPicker
        typeComponent="dropdown"
        value={hexColor}
        onChange={(c) => setHexColor(c)}
      />

      {/* Tombol Insert */}
      <Button
        variant="default"
        size="sm"
        onClick={() => {
          editor.chain().focus().setBadge({ color: hexColor }).run()
        }}
      >
        Add Badge
      </Button>
    </div>
  )
}
