import { useEffect } from 'react'
import prettier from 'prettier/standalone'
import parserHtml from 'prettier/plugins/html'
import { useEditor, EditorContent } from '@tiptap/react'
import { ToolbarFloating } from '../Toolbar/ToolbarFloating'
import { createEditorExtensions } from '../DocEditor/Extentions/extensions'
import { docTableClasses } from '../DocEditor/CustomComponents/Table/tableStyles'
import { docStepsClasses } from '../DocEditor/CustomComponents/Steps/stepsStyles'

export function TiptapViewer({ html }: { html: string }) {
  const editor = useEditor({
    extensions: createEditorExtensions(),
    content: 'initialContent',
    editable: true,

    onUpdate: async ({ editor }) => {
      const rawHtml = editor.getHTML()

      try {
        // format HTML biar rapi
        const prettyHtml = await prettier.format(rawHtml, {
          parser: 'html',
          plugins: [parserHtml],
          tabWidth: 2,
          useTabs: false,
          printWidth: 80,
          htmlWhitespaceSensitivity: 'ignore',
          bracketSameLine: false,
          singleAttributePerLine: true,
        })

        // onChangeHtml?.(prettyHtml)
      } catch (e) {
        console.error('Prettier gagal format:', e)
      }
    },
  })

  if (!editor) {
    return null
  }

  // update content kalau prop html berubah
  useEffect(() => {
    if (editor && html) {
      editor.commands.setContent(html)
    }
  }, [editor, html])

  return (
    <div>
      <ToolbarFloating editor={editor} />
      <EditorContent
        editor={editor}
        className={`prose dark:prose-invert min-w-full ${docTableClasses} ${docStepsClasses}`}
      />
    </div>
  )
}
