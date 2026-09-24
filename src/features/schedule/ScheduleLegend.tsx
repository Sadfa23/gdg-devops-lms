// Markers are SVG, not CSS circles: globals.css zeroes border-radius on every
// light-DOM element, which would square these off. (The calendar itself renders
// in a shadow root, so its rounded design survives untouched.)
function Marker({ variant }: { variant: "ring" | "fill" | "today" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      {variant === "fill" ? (
        <circle cx="7" cy="7" r="7" fill="#ec3013" />
      ) : (
        <circle
          cx="7"
          cy="7"
          r="6.25"
          fill="none"
          stroke={variant === "ring" ? "#ec3013" : "#7d7979"}
          strokeWidth="1.5"
          strokeDasharray={variant === "today" ? "2.5 2" : undefined}
        />
      )}
    </svg>
  );
}

export function ScheduleLegend() {
  return (
    <div className="flex flex-wrap gap-[18px] text-[12px] text-muted">
      <span className="flex items-center gap-2">
        <Marker variant="ring" />
        Session (Tue &amp; Thu)
      </span>
      <span className="flex items-center gap-2">
        <Marker variant="fill" />
        Selected
      </span>
      <span className="flex items-center gap-2">
        <Marker variant="today" />
        Today
      </span>
    </div>
  );
}
