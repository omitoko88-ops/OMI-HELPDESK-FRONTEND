import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TipBlock } from "../DocEditor/Extentions/TipBlock";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import { Tab, Tabs } from "../DocEditor/Extentions/Tab";

export function TiptapViewer({ html }: { html: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TipBlock,
      Tabs,
      Tab,
      TextAlign.configure({
        types: ["heading", "paragraph"],
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
    content: html,
    editable: false,
  });

  // update content kalau prop html berubah
  useEffect(() => {
    if (editor && html) {
      editor.commands.setContent(html, false); // false = jangan record ke history
    }
  }, [editor, html]);

  return <EditorContent editor={editor} className="prose dark:prose-invert" />;
}
