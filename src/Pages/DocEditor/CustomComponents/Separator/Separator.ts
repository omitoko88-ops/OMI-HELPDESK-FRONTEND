import { CommandProps, Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CustomSeparatorComponent } from "./SeparatorComponent";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customSeparator: {
      insertCustomSeparator: () => ReturnType;
    };
  }
}

export const CustomSeparator = Node.create({
  name: "customSeparator",
  group: "block",
  inline: false,
  atom: false, // ⬅️ biar bisa di-select / di-copy
  selectable: true, // ⬅️ optional, biar bisa klik sekali select node
  draggable: false,
  defining: true,

  parseHTML() {
    return [{ tag: "custom-separator" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["custom-separator", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomSeparatorComponent);
  },

  // biar bisa dipanggil: editor.commands.insertCustomSeparator()
  addCommands() {
    return {
      insertCustomSeparator:
        () =>
        ({ commands }: CommandProps) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },
});
