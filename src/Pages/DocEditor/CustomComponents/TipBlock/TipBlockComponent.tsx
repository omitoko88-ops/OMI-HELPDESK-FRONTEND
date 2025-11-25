import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Lightbulb } from "lucide-react";

export default function TipBlockComponent() {
  return (
    <NodeViewWrapper className="my-4">
      <div className="bg-green-900/20 border-l-4 border-green-600 p-2 rounded-xl relative">
        <div className="flex items-center gap-1">
          <Lightbulb strokeWidth={3} className=" size-4 text-green-600" />
          <span className="text-lg font-bold text-green-600">Tip</span>
        </div>
        <div className="ml-8 py-2">
          <NodeViewContent className="prose prose-sm dark:prose-invert text-green-600" />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
