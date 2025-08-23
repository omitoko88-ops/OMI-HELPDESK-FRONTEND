import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { useState } from "react";

export default function TabsComponent({
  node,
  updateAttributes,
}: NodeViewProps) {
  const tabs = node.content.content; // kumpulan <tab>
  const active = node.attrs.active ?? 0;

  return (
    <NodeViewWrapper className="my-4">
      <div className="border rounded-xl overflow-hidden">
        {/* Header Tabs */}
        <div className="flex border-b bg-gray-100 dark:bg-gray-800">
          {tabs.map((tab: any, i: number) => {
            const title = tab.attrs?.title ?? `Tab ${i + 1}`;
            return (
              <button
                key={i}
                onClick={() => updateAttributes({ active: i })}
                className={`px-4 py-2 text-sm font-medium ${
                  i === active
                    ? "bg-white dark:bg-gray-900 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
              >
                {title}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-4">
          {tabs.map((_: any, i: number) => (
            <div key={i} className={i === active ? "block" : "hidden"}>
              {`INDEX KE = ${i}`}
              <NodeViewContent as="div" />
            </div>
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export function TabComponent() {
  return (
    <NodeViewWrapper className="tab-pane">
      <NodeViewContent as="div" className="tab-content" />
    </NodeViewWrapper>
  );
}
