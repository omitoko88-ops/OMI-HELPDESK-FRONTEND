import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
  JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { useEffect, useState } from "react";
import { Toolbar } from "./Toolbar";
import { MarkdownPreview } from "./MarkdownPreview";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Card, CardContent } from "@/components/ui/card";
import prettier from "prettier/standalone";
// import parserHtml from "prettier/parser-html";
import parserHtml from "prettier/plugins/html";
import { TipBlock } from "./DocEditor/Extentions/TipBlock";
import { TiptapViewer } from "./DocViewer/TiptapViewerHtml";
import { Tab, Tabs } from "./DocEditor/Extentions/Tab";

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
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TaskList,
      TaskItem,
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

      // const json = editor.getJSON();
      // const markdown = customMarkdownExport(json);
      // console.log(markdown);
      // setMarkdown(markdown);
      // onChangeMarkdown?.(markdown);
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
        <div className=" rounded-md p-2 min-h-[300px] bg-background">
          <EditorContent editor={editor} role="presentation" className="" />
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

function customMarkdownExport(json: any): string {
  let md = "";

  const processContent = (content: any[]) =>
    content
      .map((node) => {
        const text = node.text || "";
        if (!node.marks) return text;

        return node.marks.reduce((acc: any, mark: { type: any }) => {
          switch (mark.type) {
            case "bold":
              return `**${acc}**`;
            case "italic":
              return `*${acc}*`;
            case "strike":
              return `~~${acc}~~`;
            default:
              return acc;
          }
        }, text);
      })
      .join("");

  const walk = (nodes: any[]) => {
    for (const node of nodes) {
      switch (node.type) {
        case "heading":
          md += `${"#".repeat(node.attrs.level)} ${processContent(
            node.content || []
          )}\n\n`;
          break;
        case "paragraph":
          const textAlign = node.attrs?.textAlign;
          const paraText = processContent(node.content || []);

          if (textAlign === "center") {
            md += `::center\n${paraText}\n::\n\n`;
          } else {
            md += `${paraText}\n\n`;
          }
          break;
        case "bulletList":
          node.content?.forEach((li: any) => {
            md += `- ${processContent(li.content?.[0]?.content || [])}\n`;
          });
          md += "\n";
          break;
        case "orderedList":
          node.content?.forEach((li: any, i: number) => {
            md += `${i + 1}. ${processContent(
              li.content?.[0]?.content || []
            )}\n`;
          });
          md += "\n";
          break;
        case "taskList":
          node.content?.forEach((item: any) => {
            const checked = item.attrs.checked ? "x" : " ";
            md += `- [${checked}] ${processContent(
              item.content?.[0]?.content || []
            )}\n`;
          });
          md += "\n";
          break;
        default:
          console.warn("Unhandled type:", node.type);
      }
    }
  };

  walk(json.content || []);
  return md.trim();
}

//! HTML OUTPUT TIPTAP EDITOR
export const TiptapEditorHtmlOutput = ({
  onChangeHtml,
}: {
  onChangeHtml: (val: string) => void;
}) => {
  const [html, setHtml] = useState(
    `<h1><strong>Docs Theme</strong></h1>
      <p>
        Nextra Docs Theme is a theme that includes almost everything you need to build
        a modern documentation website. It includes:
      </p>
      <ul>
        <li><p>a top navigation bar</p></li>
        <li><p>a search bar</p></li>
        <li><p>a pages sidebar</p></li>
        <li><p>a table of contents (TOC)</p></li>
        <li><p>and other built-in components</p></li>
      </ul>
      <div data-type="tip-block">Your tip here...</div>`
  );

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
    content: "",
    onUpdate: async ({ editor }) => {
      const rawHtml = editor.getHTML();

      try {
        // format HTML biar rapi
        const prettyHtml = await prettier.format(rawHtml, {
          parser: "html",
          plugins: [parserHtml],
        });

        setHtml(prettyHtml);
        onChangeHtml?.(prettyHtml);
      } catch (e) {
        console.error("Prettier gagal format:", e);
        setHtml(rawHtml); // fallback biar tidak blank
      }
    },
  });

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

      <Card className="flex flex-row w-full px-4">
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
  );
};
