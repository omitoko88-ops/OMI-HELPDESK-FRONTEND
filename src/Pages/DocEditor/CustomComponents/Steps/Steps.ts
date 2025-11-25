// extensions/Steps.ts
import { CommandProps, Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import StepsComponent from "./StepsComponent";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    Steps: {
      insertStep: () => ReturnType;
    };
  }
}

export const Steps = Node.create({
  name: "steps",
  group: "block",
  content: "block+",

  parseHTML() {
    return [{ tag: "div[data-type='steps']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "steps",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(StepsComponent);
  },

  addCommands() {
    return {
      insertStep:
        () =>
        ({ commands, editor }: CommandProps) => {
          const count = editor.state.doc.content.content.filter(
            (n: any) => n.type.name === this.name
          ).length;
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Your step description..." }],
              },
            ],
          });
        },
    };
  },
});
