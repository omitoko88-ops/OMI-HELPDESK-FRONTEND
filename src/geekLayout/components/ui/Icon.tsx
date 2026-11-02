interface IconProps {
  /** FontAwesome icon name without the "fa-" prefix, e.g. "share-nodes". */
  name: string;
  className?: string;
}

/**
 * Thin wrapper around FontAwesome's <i> tag (stylesheet is loaded in index.html).
 * Centralizing it means we can later swap to SVG icons (lucide, react-fontawesome...)
 * by editing just this file.
 */
export function Icon({ name, className = '' }: IconProps) {
  return <i className={`fa-solid fa-${name} ${className}`.trim()} aria-hidden="true" />;
}
