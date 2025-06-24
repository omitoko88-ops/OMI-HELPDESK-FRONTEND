// components/Toolbar.tsx
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { editor: Editor | null };

export const Toolbar = ({ editor }: Props) => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    // Simpan ke server jika perlu. Ini contoh untuk lokal blob:
    const url = URL.createObjectURL(file);

    // Sisipkan ke editor
    editor.chain().focus().setImage({ src: url }).run();
  };
  if (!editor) return null;

  return (
    <div className="flex gap-2 border p-2 rounded-lg bg-muted mb-4 flex-wrap">
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
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
      >
        <Heading className="w-4 h-4" />
      </Button>
      <button
        type="button"
        className="px-2 py-1 border rounded"
        onClick={() => document.getElementById("image-upload")?.click()}
      >
        🖼️ Upload Image
      </button>
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
