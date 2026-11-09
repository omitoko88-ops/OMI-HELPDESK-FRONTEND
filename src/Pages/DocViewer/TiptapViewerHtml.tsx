import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { createEditorExtensions } from '../DocEditor/Extentions/extensions'
import { docTableClasses } from '../DocEditor/CustomComponents/Table/tableStyles'
import { docStepsClasses } from '../DocEditor/CustomComponents/Steps/stepsStyles'
import '../DocEditor/CustomComponents/List/doc-lists.css'

interface TiptapViewerProps {
  html: string
  editable?: boolean
  showToolbar?: boolean
}

export function TiptapViewer({
  html,
  editable = false,
  showToolbar = false,
}: TiptapViewerProps) {
  const editor = useEditor({
    extensions: createEditorExtensions(),
    content: html || '',
    editable,
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor) editor.commands.setContent(html || '', { emitUpdate: false })
  }, [editor, html])

  useEffect(() => {
    if (editor) editor.setEditable(editable)
  }, [editor, editable])

  if (!editor) return null

  return (
    <div className="min-w-0">
      {showToolbar && editable && (
        <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-500">
          Toolbar editor tersedia di halaman Edit.
        </div>
      )}
      <EditorContent
        editor={editor}
        className={`prose dark:prose-invert min-w-full ${docTableClasses} ${docStepsClasses}`}
      />
    </div>
  )
}
