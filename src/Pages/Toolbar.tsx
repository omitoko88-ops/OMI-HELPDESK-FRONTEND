import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table as TableIcon,
  Trash2,
  CheckSquare,
  Image as ImageIcon,
  Lightbulb,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { editor: Editor | null };

export const Toolbar = ({ editor }: Props) => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const url = URL.createObjectURL(file);

    editor.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="flex gap-2 border p-2 rounded-lg bg-muted mb-4 flex-wrap">
      {/* text styles */}
      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent({
              type: "tabs",
              attrs: { active: 0 },
              content: [
                {
                  type: "tab",
                  attrs: { title: "yarn" },
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Isi Tab 1" }],
                    },
                  ],
                },
                {
                  type: "tab",
                  attrs: { title: "roshan" },
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Isi Tab 2" }],
                    },
                  ],
                },
              ],
            })
            .run()
        }
        className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-800"
      >
        <Folder className="w-5 h-5 text-blue-600" />
      </button>
      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent('<div data-type="tip-block">Your tip here...</div>')
            .run()
        }
        className="p-2 rounded hover:bg-green-100 dark:hover:bg-green-800"
      >
        <Lightbulb className="w-5 h-5 text-green-600" />
      </button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-accent" : ""}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-accent" : ""}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "bg-accent" : ""}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "bg-accent" : ""}
      >
        <Code className="w-4 h-4" />
      </Button>

      {/* headings */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}
      >
        H1
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
      >
        H2
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""}
      >
        H3
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive("heading", { level: 4 }) ? "bg-accent" : ""}
      >
        H4
      </Button>

      {/* lists */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-accent" : ""}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-accent" : ""}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={editor.isActive("taskList") ? "bg-accent" : ""}
      >
        <CheckSquare className="w-4 h-4" />
      </Button>

      {/* alignment */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""}
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.commands.setTextAlign("center")}
        className={editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""}
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""}
      >
        <AlignRight className="w-4 h-4" />
      </Button>

      {/* table */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <TableIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {/* image */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => document.getElementById("image-upload")?.click()}
      >
        <ImageIcon className="w-4 h-4" />
      </Button>
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        hidden
        onChange={handleImageUpload}
      />
    </div>
  );
};
