import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import TipBlockComponent from "./TipBlockComponent";

export const TipBlock = Node.create({
  name: "tipBlock",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [{ tag: "div[data-type='tip-block']" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "tip-block" }),
      0,
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(TipBlockComponent);
  },
});
