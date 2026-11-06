import { uploadImage, uploadPdf } from '@/lib/uploadPdf'
import Image from '@tiptap/extension-image'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextAlign from '@tiptap/extension-text-align'
import { Badge } from '../CustomComponents/Badge/Badge'
import { Table, TableRow } from '@tiptap/extension-table'
import { PdfViewer } from '../CustomComponents/Pdf/PdfViewer'
import { TipBlock } from '../CustomComponents/TipBlock/TipBlock'
import { TabPanel, TabsNode } from '../CustomComponents/Tabs/TabsNode'
import { CustomSeparator } from '../CustomComponents/Separator/Separator'
import { CodeTab, CodeTabs } from '../CustomComponents/CodeTabs/CodeTabs'
import { InlineCheckbox } from '../CustomComponents/Checkbox/InlineCheckbox'
import { InlineCombobox } from '../CustomComponents/Combobox/InlineCombobox'
import {
  Step,
  StepBody,
  Steps,
  StepTitle,
} from '../CustomComponents/Steps/Steps'
import {
  CustomTableCell,
  CustomTableHeader,
} from '../CustomComponents/Table/CustomTableCells'
import { ImageBlock } from '../CustomComponents/Image/ImageBlock'

export const createEditorExtensions = () => [
  StarterKit.configure({
    dropcursor: {
      color: 'var(--primary)',
      width: 2,
    },
  }),

  CustomSeparator,
  Badge,
  TipBlock,

  TabsNode,
  TabPanel,
  CodeTabs,
  CodeTab,

  PdfViewer.configure({
    upload: uploadPdf,
    maxSizeMB: 10,
  }),

  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),

  ImageBlock.configure({
    upload: uploadImage,
    maxSizeMB: 5,
    onError: (msg) => alert(msg),
  }),

  Image,

  Table.configure({
    resizable: true,
  }),
  TableRow,
  CustomTableCell,
  CustomTableHeader,

  TaskList,
  TaskItem,
  InlineCheckbox,
  InlineCombobox,

  Steps,
  Step,
  StepTitle,
  StepBody,
]
