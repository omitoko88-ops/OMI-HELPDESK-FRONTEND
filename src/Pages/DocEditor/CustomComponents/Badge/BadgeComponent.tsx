import { hexToRgba } from '@/lib/hexToRgb'
import { NodeViewProps } from '@tiptap/core'
import { NodeViewWrapper } from '@tiptap/react'

export default function BadgeComponent(props: NodeViewProps) {
  const { node } = props
  const { label, color } = node.attrs

  return (
    <NodeViewWrapper
      as="span"
      className={`inline-block px-2 py-0.5 rounded-md`}
      style={{
        backgroundColor: hexToRgba(color, 0.2),
        color: hexToRgba(color, 0.9),
      }}
      contentEditable={false} // biar tidak bisa diubah langsung
      data-type="badge"
    >
      {label}
    </NodeViewWrapper>
  )
}
