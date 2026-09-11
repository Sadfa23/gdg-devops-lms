/**
 * The GDG chevron mark — four round-capped strokes in the four Google
 * brand colors (README §Assets: "replace with the official GDG asset if the
 * codebase has one; do not redraw the Google or GDG marks freehand" — this
 * traces the handoff's own inline SVG exactly, not a freehand redraw).
 */
export function GdgLogo({ width = 28, height = 17 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 68 40" aria-hidden="true">
      <path d="M26 4 L8 20" fill="none" stroke="#ea4335" strokeWidth="9" strokeLinecap="round" />
      <path d="M8 20 L26 36" fill="none" stroke="#4285f4" strokeWidth="9" strokeLinecap="round" />
      <path d="M42 4 L60 20" fill="none" stroke="#34a853" strokeWidth="9" strokeLinecap="round" />
      <path d="M60 20 L42 36" fill="none" stroke="#fbbc04" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}
