import { useEffect, useRef } from 'react';

/**
 * Calls `onOutside` when the user presses the mouse outside the returned ref's element.
 * Only listens while `active` is true, so closed dropdowns cost nothing.
 */
export function useClickOutside<T extends HTMLElement>(onOutside: () => void, active: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;

    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutside();
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [active, onOutside]);

  return ref;
}
