// components/DocEditor.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "highlight.js/styles/github.css";
import { TiptapEditor } from "./TiptapEditor";
import { useState } from "react";

export const DocEditor = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    const newDoc = {
      title,
      slug,
      content,
    };

    console.log("Submitted doc:", newDoc);
    // TODO: Kirim ke API
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 px-4 py-6">
      <h2 className="text-2xl font-bold">Create New Document</h2>

      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        placeholder="Slug (example: getting-started)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Document Editor</h2>

        <h1 className="text-2xl font-bold mb-6">📝 Markdown Editor</h1>
        <TiptapEditor onChangeMarkdown={(value) => setContent(value)} />

        <Button className="mt-4" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
};
