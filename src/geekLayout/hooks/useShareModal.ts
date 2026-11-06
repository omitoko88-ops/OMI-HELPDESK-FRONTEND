import { useState } from 'react'
import type { ShareTarget } from '../types'

/** Open/closed state of the Share modal + the document being shared. */
export function useShareModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [target, setTarget] = useState<ShareTarget>({ id: '', title: '' })

  const open = (documentId: string, title: string) => {
    setTarget({ id: documentId, title })
    setIsOpen(true)
  }
  const close = () => setIsOpen(false)

  return { isOpen, target, open, close }
}
