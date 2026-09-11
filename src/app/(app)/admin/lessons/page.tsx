import Link from "next/link";
import { listLessonsForAdmin } from "@/features/lessons/data";
import { PageHeader } from "@/components/shell/PageHeader";
import { Button } from "@/components/ui/button";

export default async function AdminLessonsIndexPage() {
  const lessons = await listLessonsForAdmin();

  return (
    <div>
      <PageHeader
        crumb="Track lead · Content"
        title="Lessons"
        actions={
          <Link href="/admin/lessons/new">
            <Button size="sm">+ New lesson</Button>
          </Link>
        }
      />

      {lessons.length === 0 ? (
        <p className="text-[13px] text-muted">No lessons yet.</p>
      ) : (
        <div className="flex flex-col gap-px bg-line">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/admin/lessons/${lesson.id}/edit`}
              className="flex items-center gap-4 bg-surface px-4 py-3 no-underline hover:bg-elev"
            >
              <span className="font-mono text-[11px] text-muted">{lesson.code}</span>
              <span className="text-[14.5px] text-ink">{lesson.title}</span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{lesson.visibility}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
