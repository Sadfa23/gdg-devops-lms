export function formatMmSs(totalSeconds: number | null | undefined): string {
  if (!totalSeconds && totalSeconds !== 0) return "—";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** "15:00" -> 900. Returns null for anything unparsable rather than throwing —
 * callers decide whether that's an error or just "leave it unset". */
export function parseMmSs(value: string): number | null {
  const match = value.trim().match(/^(\d+):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}
