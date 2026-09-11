import { cn } from "@/lib/utils";

type SpinnerProps = { size?: number; className?: string };

/**
 * A single rotating SVG stroke, no JS, no dependency — split into four
 * dash segments in the GDG brand colors so it reads as a spinning version
 * of the logo mark rather than a generic ring. Circumference of r=9 is
 * ~56.5; four 14-unit dashes (with a matching 42-unit gap each) tile it
 * almost exactly, so the four colors sit edge-to-edge with no overlap.
 */
export function Spinner({ size = 20, className }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin", className)}
      role="status"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="9" stroke="var(--g-blue)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14 42" />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="var(--g-red)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="14 42"
        strokeDashoffset="-14"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="var(--g-yellow)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="14 42"
        strokeDashoffset="-28"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="var(--g-green)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="14 42"
        strokeDashoffset="-42"
      />
    </svg>
  );
}
