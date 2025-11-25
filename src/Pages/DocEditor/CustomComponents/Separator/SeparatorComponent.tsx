import { Separator } from "@/components/ui/separator";
import { NodeViewWrapper } from "@tiptap/react";

export const CustomSeparatorComponent = () => {
  return (
    <NodeViewWrapper className="flex items-center my-4">
      <Separator />
    </NodeViewWrapper>
  );
};
