import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ColorPicker from '@/components/common/CustomColorPicker'
import { ToolbarButtonProps } from '../types'
import { Badge, BadgeAlert } from 'lucide-react'

export const BadgeInsertButton = ({ editor }: ToolbarButtonProps) => {
  const [hexColor, setHexColor] = useState('#7af441')
  const [label, setLabel] = useState('New')

  return (
    <div className="flex gap-1">
      {/* <div className="absolute text-[8px] -top-2 left-3 bg-mute px-1">
        Badge
      </div> */}

      {/* <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Badge text"
        className="border px-2 py-1 text-sm rounded"
      /> */}

      {/* Pilih warna */}
      <ColorPicker
        typeComponent="dropdown"
        value={hexColor}
        onChange={(c) => setHexColor(c)}
      />

      {/* Tombol Insert */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          editor
            .chain()
            .focus()
            .setBadge({ label: label, color: hexColor })
            .run()
        }}
      >
        <BadgeAlert className="w-5 h-5" />
      </Button>
    </div>
  )
}
