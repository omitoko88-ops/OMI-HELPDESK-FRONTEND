import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { Markdown } from "tiptap-markdown";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";

import "@/styles/paragraph-node.scss";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";

export default function MyEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      //   Markdown.configure({
      //     html: true,
      //     tightLists: true,
      //     bulletListMarker: "-",
      //   }),
    ],
    content: `
        <p>Try selecting a paragraph and clicking one of the text alignment buttons.</p>
        <p style="text-align: left">Left-aligned text.</p>
        <p style="text-align: center">Center-aligned text.</p>
        <p style="text-align: right">Right-aligned text.</p>
        <p style="text-align: justify">Justified text.</p>

        <blockquote>
            <p>"The best way to predict the future is to invent it."</p><p>— Alan Kay</p>
        </blockquote>
        `,
    onUpdate({ editor }) {
      //   const md = editor.storage.markdown.getMarkdown();
      //   setMarkdown(md);
      //   onChangeMarkdown?.(md);
      //   console.log(md);
      // const json = editor.getJSON();
      // const markdown = customMarkdownExport(json);
      // console.log(markdown);
      // setMarkdown(markdown);
      // onChangeMarkdown?.(markdown);
    },
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="flex gap-2 border-b pb-2 mb-4">
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
        <BlockquoteButton />
      </div>

      <EditorContent editor={editor} role="alert" />
    </EditorContext.Provider>
  );
}
