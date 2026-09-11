import Link from "next/link";
import { listAllSubmissionsForAdmin } from "@/features/labs/data";
import { GradeSubmissionForm } from "@/features/labs/components/GradeSubmissionForm";
import { PageHeader } from "@/components/shell/PageHeader";
import { cn } from "@/lib/utils";
import type { LabState } from "@/generated/prisma/client";

const FILTERS = [
  { key: "in_review", label: "Needs grading" },
  { key: "all", label: "All" },
  { key: "passed", label: "Passed" },
  { key: "changes_asked", label: "Changes asked" },
  { key: "overdue", label: "Overdue" },
] as const;

const STATE_COLOR: Record<LabState, string> = {
  passed: "var(--g-green)",
  in_review: "var(--g-blue)",
  changes_asked: "var(--accent)",
  overdue: "var(--accent)",
};

/** Lands on "Needs grading" by default rather than "All" — the point of
 * this screen is to work through the queue, not just browse history. */
export default async function AdminLabsPage({ searchParams }: PageProps<"/admin/labs">) {
  const { filter } = await searchParams;
  const activeFilter = typeof filter === "string" ? filter : "in_review";

  const submissions = await listAllSubmissionsForAdmin();
  const visible = activeFilter === "all" ? submissions : submissions.filter((s) => s.state === activeFilter);

  return (
    <div>
      <PageHeader crumb="Track lead · Grading" title="Lab submissions" />

      <div className="mb-4 flex flex-wrap gap-px bg-line">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "in_review" ? "/admin/labs" : `/admin/labs?filter=${f.key}`}
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
        <div className="flex flex-col gap-4">
          {visible.map((s) => (
            <div key={s.id} className="border border-line bg-surface">
              <div className="flex flex-wrap items-center gap-4 px-4 py-3">
                <span className="font-mono text-[11px] text-muted">{s.lab.code}</span>
                <span className="text-[14px] font-medium text-ink">{s.lab.title}</span>
                <span className="ml-auto flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                  <span className="h-1.5 w-1.5" style={{ background: STATE_COLOR[s.state] }} />
                  {s.state.replace("_", " ")}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-2.5">
                <span className="text-[13px] text-ink">{s.user.name}</span>
                <a
                  href={s.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate font-mono text-[11px] text-accent-ink hover:underline"
                >
                  {s.repoUrl.replace(/^https?:\/\//, "")}
                </a>
                <span className="ml-auto font-mono text-[10px] text-muted">Submitted {s.submittedAt.toLocaleDateString()}</span>
              </div>
              <GradeSubmissionForm submissionId={s.id} initial={{ state: s.state, grade: s.grade, feedback: s.feedback }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
