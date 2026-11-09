import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { ToolbarFloating } from './Toolbar/ToolbarFloating'
import { docTableClasses } from './DocEditor/CustomComponents/Table/tableStyles'
import { docStepsClasses } from './DocEditor/CustomComponents/Steps/stepsStyles'
import { createEditorExtensions } from './DocEditor/Extentions/extensions'
import type { TiptapEditorProps } from './DocEditor/types'
import './DocEditor/CustomComponents/List/doc-lists.css'

export const TiptapEditorHtmlOutput = ({
  initialContent = '',
  onChangeHtml,
  editable = true,
  showToolbar = true,
  className = '',
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: createEditorExtensions(),
    content: initialContent,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChangeHtml?.(currentEditor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    editor.commands.setContent(initialContent || '', { emitUpdate: false })
  }, [editor, initialContent])

  useEffect(() => {
    if (editor) editor.setEditable(editable)
  }, [editor, editable])

  if (!editor) return null

  return (
    <div className="flex w-full min-w-0 flex-col">
      {showToolbar && <ToolbarFloating editor={editor} />}
      <EditorContent
        editor={editor}
        className={`prose dark:prose-invert min-w-full doc-lists ${docTableClasses} ${docStepsClasses} ${className}`}
      />
    </div>
  )
}
