import { useEditor, EditorContent } from '@tiptap/react'

import { ToolbarFloating } from './Toolbar/ToolbarFloating'

import { docTableClasses } from './DocEditor/CustomComponents/Table/tableStyles'
import { docStepsClasses } from './DocEditor/CustomComponents/Steps/stepsStyles'
import { createEditorExtensions } from './DocEditor/Extentions/extensions'
import { TiptapEditorProps } from './DocEditor/types'

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

    onUpdate: ({ editor }) => {
      onChangeHtml?.(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="flex w-full min-w-0 flex-col">
      {showToolbar && <ToolbarFloating editor={editor} />}

      <EditorContent
        editor={editor}
        className={`
          prose dark:prose-invert min-w-full
          ${docTableClasses}
          ${docStepsClasses}
          ${className}
        `}
      />
    </div>
  )
}
