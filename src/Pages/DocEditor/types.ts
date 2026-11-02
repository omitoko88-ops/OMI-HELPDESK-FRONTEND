import type { Editor } from '@tiptap/core'

export type TiptapEditorProps = {
  initialContent?: string
  onChangeHtml?: (html: string) => void
  editable?: boolean
  showToolbar?: boolean
  className?: string
}

export type EditorToolbarProps = {
  editor: Editor | null
}
