import Link from "next/link";
import { auth } from "@/lib/auth";
import { listLabsForSelect, listSubmissionsForUser } from "@/features/labs/data";
import { SubmitLabForm } from "@/features/labs/components/SubmitLabForm";
import { PageHeader } from "@/components/shell/PageHeader";
import { cn } from "@/lib/utils";
import type { LabState } from "@/generated/prisma/client";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "passed", label: "Passed" },
  { key: "in_review", label: "In review" },
  { key: "changes_asked", label: "Changes asked" },
] as const;

const STATE_COLOR: Record<LabState, string> = {
  passed: "var(--g-green)",
  in_review: "var(--g-blue)",
  changes_asked: "var(--accent)",
  overdue: "var(--accent)",
};

export default async function SubmissionsPage({ searchParams }: PageProps<"/submissions">) {
  const { filter } = await searchParams;
  const activeFilter = typeof filter === "string" ? filter : "all";

  const session = await auth();
  const [labs, submissions] = await Promise.all([listLabsForSelect(), listSubmissionsForUser(session!.user.id)]);

  const visible = activeFilter === "all" ? submissions : submissions.filter((s) => s.state === activeFilter);

  return (
    <div>
      <PageHeader crumb="Labs" title="Submissions" />

      <div className="mb-6">
        <SubmitLabForm labs={labs} />
      </div>

      <div className="mb-4 flex gap-px bg-line">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/submissions" : `/submissions?filter=${f.key}`}
            className={cn(
              "bg-surface px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted no-underline hover:bg-elev",
              activeFilter === f.key && "bg-ink text-bg",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-[13px] text-muted">No submissions {activeFilter !== "all" ? "in this state" : "yet"}.</p>
      ) : (
        <div className="flex flex-col gap-px bg-line">
          {visible.map((s) => (
            <div key={s.id} className="grid grid-cols-[80px_1fr_1fr_auto_60px] items-center gap-4 bg-surface px-4 py-3">
              <span className="font-mono text-[11px] text-muted">{s.lab.code}</span>
              <span className="truncate text-[14px] text-ink">{s.lab.title}</span>
              <span className="truncate font-mono text-[11px] text-muted">{s.repoUrl.replace(/^https?:\/\//, "")}</span>
              <span className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                <span className="h-1.5 w-1.5" style={{ background: STATE_COLOR[s.state] }} />
                {s.state.replace("_", " ")}
              </span>
              <span className="text-right font-mono text-[12px] text-ink">{s.grade ?? "—"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
