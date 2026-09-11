import { auth } from "@/lib/auth";
import { getLeaderboard } from "@/features/leaderboard/data";
import { PageHeader } from "@/components/shell/PageHeader";
import { initialsOf } from "@/lib/initials";
import { cn } from "@/lib/utils";

const ACCENT_COLOR: Record<string, string> = {
  blue: "var(--g-blue)",
  red: "var(--g-red)",
  yellow: "var(--g-yellow)",
  green: "var(--g-green)",
  none: "var(--muted)",
};

export default async function LeaderboardPage() {
  const [rows, session] = await Promise.all([getLeaderboard(), auth()]);

  return (
    <div>
      <PageHeader crumb="Community" title="Leaderboard" />

      {rows.length === 0 ? (
        <p className="text-[13px] text-muted">Nobody&apos;s attempted a quiz or lab yet.</p>
      ) : (
        <div className="flex flex-col gap-px bg-line">
          {rows.map((row, i) => (
            <div
              key={row.id}
              className={cn(
                "grid grid-cols-[40px_32px_1fr_140px_80px_80px] items-center gap-4 bg-surface px-4 py-3",
                row.id === session?.user.id && "border-l-2 border-accent",
              )}
            >
              <span className="font-mono text-[13px] text-muted">#{i + 1}</span>
              <span className="grid h-8 w-8 place-items-center font-mono text-[11px] font-bold text-white" style={{ background: ACCENT_COLOR[row.accent] }}>
                {initialsOf(row.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[14px] text-ink">{row.name}</p>
                {row.focusArea && <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">{row.focusArea}</p>}
              </div>
              <span className="font-mono text-[11px] text-muted">
                {row.labsPassed}/{row.labsTotal} labs
              </span>
              <span className="font-mono text-[11px] text-muted">{row.quizAveragePercent}% quiz</span>
              <span className="text-right font-mono text-[13px] font-semibold text-accent-ink">{row.xpTotal} XP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
