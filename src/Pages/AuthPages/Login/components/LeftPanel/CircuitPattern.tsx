/** Pola papan sirkuit sebagai aksen background panel kiri. */
export function CircuitPattern() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.08]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path
            d="M10 10 h 80 v 80 h -80 Z M30 30 h 40 v 40 h -40 Z"
            fill="none"
            stroke="#6366f1"
            strokeWidth="1.5"
          />
          <circle cx="10" cy="10" r="3" fill="#6366f1" />
          <circle cx="90" cy="10" r="3" fill="#6366f1" />
          <circle cx="90" cy="90" r="3" fill="#6366f1" />
          <circle cx="10" cy="90" r="3" fill="#6366f1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </div>
  );
}
