import { useState } from 'react';

/**
 * Open/closed state of the Share modal + the title of the document being shared.
 * The fade/scale animation is handled purely with CSS classes in <ShareModal />,
 * so no setTimeout juggling is needed anymore.
 */
export function useShareModal(initialTitle = '') {
  const [isOpen, setIsOpen] = useState(false);
  const [docTitle, setDocTitle] = useState(initialTitle);

  const open = (title: string) => {
    setDocTitle(title);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return { isOpen, docTitle, open, close };
}
