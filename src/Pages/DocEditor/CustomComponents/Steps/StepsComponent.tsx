// components/editor/StepsComponent.tsx
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

const StepsComponent = ({ node }: any) => {
  const { step = 1 } = node.attrs;

  return (
    <NodeViewWrapper className="flex items-start gap-4 my-4 p-4 border rounded bg-muted">
      <div className="font-semibold">Step {step}</div>
      <NodeViewContent className="text-sm flex-1" />
    </NodeViewWrapper>
  );
};

export default StepsComponent;
