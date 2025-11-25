import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import { Toolbar } from './Toolbar'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Card, CardContent } from '@/components/ui/card'
import prettier from 'prettier/standalone'
import parserHtml from 'prettier/plugins/html'
import { TipBlock } from './DocEditor/CustomComponents/TipBlock/TipBlock'
import { TiptapViewer } from './DocViewer/TiptapViewerHtml'
import { Tab, Tabs } from './DocEditor/CustomComponents/TabsComponent/Tab'
import { Badge } from './DocEditor/CustomComponents/Badge/Badge'
import { CustomSeparator } from './DocEditor/CustomComponents/Separator/Separator'
import { Steps } from './DocEditor/CustomComponents/Steps/Steps'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useTableContent } from '@/contexts/TableContentContext'

export const TiptapEditorHtmlOutput = ({
  onChangeHtml,
}: {
  onChangeHtml: (val: string) => void
}) => {
  const [html, setHtml] = useState(
    `<h1><strong>Docs Theme</strong></h1> <p> Nextra Docs Theme is a theme that includes almost everything you need to build a modern documentation website. It <s>includes</s>: </p> <ul> <li><p>a top navigation bar</p></li> <li><p>a search bar</p></li> <li> <p>a <code>pages sidebar</code></p> </li> <li><p>a table of contents (TOC)</p></li> <li> <p> <em>and other built-in</em> <span label="components" color="#ca0a0a" data-type="badge" >components</span > </p> </li> </ul> <div data-type="tip-block">Your tip here...</div> <h2><strong>Start as a New Project</strong></h2> <custom-separator></custom-separator> <p style="text-align: right">Halo Pak Dedi</p> <p style="text-align: center">Nama Saya Roshan Ram Metta</p> <table style="min-width: 75px"> <colgroup> <col style="min-width: 25px" /> <col style="min-width: 25px" /> <col style="min-width: 25px" /> </colgroup> <tbody> <tr> <th colspan="1" rowspan="1"><p>Gaji</p></th> <th colspan="1" rowspan="1"><p>Alamat</p></th> <th colspan="1" rowspan="1"><p>Umur</p></th> </tr> <tr> <td colspan="1" rowspan="1"><p>2.000.000</p></td> <td colspan="1" rowspan="1"><p>Jl. Sei Mencirim</p></td> <td colspan="1" rowspan="1"><p>26 Tahun</p></td> </tr> <tr> <td colspan="1" rowspan="1"><p>3.500.000</p></td> <td colspan="1" rowspan="1"><p>Jl. Timut laut paling kanan</p></td> <td colspan="1" rowspan="1"> <p>30 Tahun</p> <p></p> </td> </tr> </tbody> </table> <ol> <li><p>Satu</p></li> <li><p>Dua</p></li> <li><p>Tiga</p></li> </ol> <p></p> <img src="blob:http://localhost:5173/15b47ab7-a2a6-49f4-8c14-37d3ccee4803" /> <p></p> <p></p>`
  )

  const editor = useEditor({
    extensions: [
      StarterKit,
      Steps,
      CustomSeparator,
      Badge,
      TipBlock,
      Tabs,
      Tab,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem,
    ],
    content: '',
    onUpdate: async ({ editor }) => {
      const rawHtml = editor.getHTML()

      try {
        // format HTML biar rapi
        const prettyHtml = await prettier.format(rawHtml, {
          parser: 'html',
          plugins: [parserHtml],
        })

        setHtml(prettyHtml)
        onChangeHtml?.(prettyHtml)
      } catch (e) {
        console.error('Prettier gagal format:', e)
        setHtml(rawHtml) // fallback biar tidak blank
      }
    },
  })
  const { setTableContent } = useTableContent()
  const isMd = useMediaQuery('(min-width: 868px)')
  useEffect(() => {
    if (isMd) {
      setTableContent(
        <div className="w-64">
          <pre className="text-sm whitespace-pre-wrap">{html}</pre>
        </div>
      )
    } else {
      setTableContent(null)
    }
  }, [isMd, setTableContent])

  return (
    <div className="flex flex-col w-full">
      <div>
        <Toolbar editor={editor} />
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert min-w-full"
        />
      </div>

      <h2 className="text-lg font-bold mb-2">HTML Output</h2>

      <Card className="flex flex-col w-full px-4">
        <Card className="w-full">
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap">{html}</pre>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardContent>
            <TiptapViewer html={html} />
          </CardContent>
        </Card>
      </Card>
    </div>
  )
}
