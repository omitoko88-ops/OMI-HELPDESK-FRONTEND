import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import TabsComponent, { TabComponent } from "../CustomComponents/TabsComponent";

export const Tabs = Node.create({
  name: "tabs",
  group: "block",
  content: "tab+",

  addAttributes() {
    return {
      active: {
        default: 0, // default tab pertama
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='tabs']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "tabs",
        "data-active": HTMLAttributes.active,
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TabsComponent);
  },
});

export const Tab = Node.create({
  name: "tab",
  content: "block+",
  group: "block",
  defining: true,

  addAttributes() {
    return {
      title: { default: "Tab" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='tab']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "tab" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TabComponent);
  },
});
