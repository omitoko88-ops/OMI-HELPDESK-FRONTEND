import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'

export default function InlineCheckboxComponent({
  node,
  editor,
  updateAttributes,
}: NodeViewProps) {
  const editable = editor.isEditable

  return (
    <NodeViewWrapper
      as="span"
      className="mx-0.5 inline-flex items-center align-middle"
    >
      <input
        type="checkbox"
        checked={!!node.attrs.checked}
        // Di viewer hanya tampilan; perubahan pembaca tidak akan tersimpan
        onChange={(e) =>
          editable && updateAttributes({ checked: e.target.checked })
        }
        tabIndex={editable ? 0 : -1}
        aria-label="Checkbox"
        className={`size-4 accent-primary ${editable ? 'cursor-pointer' : 'cursor-default'}`}
      />
    </NodeViewWrapper>
  )
}
