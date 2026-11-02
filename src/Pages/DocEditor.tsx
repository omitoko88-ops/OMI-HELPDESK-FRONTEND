// components/DocEditor.tsx
import { Button } from "@/components/ui/button";
import "highlight.js/styles/github.css";
import { TiptapEditorHtmlOutput } from "./TiptapEditor";
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
    <div className=" space-y-4 px- py-6">
        <TiptapEditorHtmlOutput onChangeHtml={(value) => setContent(value)} />

      <div className="">
        

        <Button className="mt-4" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
};
