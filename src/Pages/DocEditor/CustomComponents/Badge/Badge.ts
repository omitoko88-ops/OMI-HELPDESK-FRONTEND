// extensions/Badge.tsx
import { Node, mergeAttributes, CommandProps } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import BadgeComponent from "./BadgeComponent";

// Tambah typing command ke TipTap
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    badge: {
      setBadge: (options: { label?: string; color?: string }) => ReturnType;
    };
  }
}

export const Badge = Node.create({
  name: "badge",
  inline: true,
  group: "inline",
  atom: true,

  addAttributes() {
    return {
      label: { default: "Badge" },
      color: { default: "#7af441" },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-type='badge']" }];
  },

  renderHTML({ HTMLAttributes }) {
    // ini dipakai saat export ke HTML
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": "badge",
      }),
      HTMLAttributes.label,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BadgeComponent);
  },

  addCommands() {
    return {
      setBadge:
        (options: { label?: string; color?: string }) =>
        ({ chain, editor }) => {
          const { from, to } = editor.state.selection;
          const selectedText = editor.state.doc.textBetween(from, to, " ");

          // Kalau ada teks terseleksi → bungkus dalam badge
          if (selectedText.length > 0) {
            return chain()
              .deleteRange({ from, to })
              .insertContent({
                type: this.name,
                attrs: {
                  label: selectedText,
                  color: options.color ?? "#7af441",
                },
              })
              .run();
          }

          // Kalau tidak ada selection → insert biasa
          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run();
        },
    };
  },
});
