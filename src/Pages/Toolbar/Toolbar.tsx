import { Editor } from '@tiptap/react'
import { HexColorPicker } from 'react-colorful'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table as TableIcon,
  Trash2,
  CheckSquare,
  Image as ImageIcon,
  Lightbulb,
  Folder,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import ColorPicker from '@/components/common/CustomColorPicker'
import { BadgeInsertButton } from './Buttons/BadgeInsertButton'
import { SeparatorButton } from './Buttons/SeparatorButton'
import { TipInsertButton } from './Buttons/TipInsertButton'
import { BoldButton } from './Buttons/BoldButton'
import { ItalicButton } from './Buttons/ItalicButton'
import { StrikeButton } from './Buttons/StrikeButton'
import { CodeButton } from './Buttons/CodeButton'
import { HeadingButtons } from './Buttons/HeadingButtons'
import { ListButtons } from './Buttons/ListButtons'
import { AlignButtons } from './Buttons/AlignButtons'
import { TableButtons } from './Buttons/TableButtons'
import { ImageUploadButton } from './Buttons/ImageUploadButton'
import { CodeTabsInsertButton } from './Buttons/CodeTabsButton'
import { TabsInsertButton } from './Buttons/TabsButton'
import { PdfInsertButton } from './Buttons/PdfInsertButton'
import { TableControls } from '../DocEditor/CustomComponents/Table/TableControls'
import { BlockHandle } from '../DocEditor/CustomComponents/BlockWrap/BlockHandle'
import { ComboboxInsertButton } from './Buttons/Combobox'
import { CheckboxInsertButton } from './Buttons/CheckboxButton'
import { StepsInsertButton } from './Buttons/StepsInsertButton'
import { ImageInsertButton } from './Buttons/ImageInsertButton'

type Props = { editor: Editor | null }

export const Toolbar = ({ editor }: Props) => {
  if (!editor) return null

  return (
    <div className="flex gap-2 border p-2 rounded-lg bg-muted mb-4 flex-wrap">
      {/* COMPONENT BUTTONS */}
      <BadgeInsertButton editor={editor} />
      {/* <StepButton editor={editor} /> */}
      <SeparatorButton editor={editor} />
      <TipInsertButton editor={editor} />

      {/* text styles */}
      <BoldButton editor={editor} />
      <ItalicButton editor={editor} />
      <StrikeButton editor={editor} />

      {/* headings */}
      <HeadingButtons editor={editor} />

      <ComboboxInsertButton editor={editor} />

      <StepsInsertButton editor={editor} />

      {/* alignment */}
      <AlignButtons editor={editor} />

      <CheckboxInsertButton editor={editor} />

      {/* table */}
      <TableButtons editor={editor} />

      {/* image */}
      <ImageInsertButton editor={editor} />

      <CodeTabsInsertButton editor={editor} />

      <TabsInsertButton editor={editor} />

      <PdfInsertButton editor={editor} />

      <TableControls editor={editor} />

      <BlockHandle editor={editor} />
    </div>
  )
}
