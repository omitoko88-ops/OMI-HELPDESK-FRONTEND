// components/TiptapEditor.tsx
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { useEffect, useState } from "react";
import { Toolbar } from "./Toolbar";
import { MarkdownPreview } from "./MarkdownPreview";
import Image from "@tiptap/extension-image";

export const TiptapEditor = ({
  onChangeMarkdown,
}: {
  onChangeMarkdown: (val: string) => void;
}) => {
  const [markdown, setMarkdown] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: "-",
      }),
    ],
    content: "# Hello Markdown 👋",
    onUpdate({ editor }) {
      const md = editor.storage.markdown.getMarkdown();
      setMarkdown(md);
      onChangeMarkdown?.(md);
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Toolbar editor={editor} />
        {editor && (
          <>
            <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
              <div className="p-2 bg-white shadow rounded border">
                Floating Menu
              </div>
            </FloatingMenu>
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
              <div className="p-2 bg-white shadow rounded border">
                Bubble Menu
              </div>
            </BubbleMenu>
          </>
        )}
        <div className="border rounded-md p-2 min-h-[300px] bg-background">
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="p-4 border rounded-md bg-muted whitespace-pre-wrap overflow-auto">
        <h2 className="text-lg font-bold mb-2">Markdown Output</h2>
        <pre className="text-sm">{markdown}</pre>
        <MarkdownPreview markdown={markdown} />
      </div>
    </div>
  );
};
