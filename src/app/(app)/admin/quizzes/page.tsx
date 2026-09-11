import Link from "next/link";
import { listLessonsWithQuestionCounts } from "@/features/quizzes/data";
import { PageHeader } from "@/components/shell/PageHeader";

export default async function QuizBuilderIndexPage() {
  const lessons = await listLessonsWithQuestionCounts();

  return (
    <div>
      <PageHeader crumb="Track lead · Assessment" title="10 · Quiz builder" />

      {lessons.length === 0 ? (
        <p className="text-[13px] text-muted">No lessons exist yet — create one first.</p>
      ) : (
        <div className="flex flex-col gap-px bg-line">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/admin/quizzes/${lesson.id}`}
              className="flex items-center gap-4 bg-surface px-4 py-3 no-underline hover:bg-elev"
            >
              <span className="font-mono text-[11px] text-muted">{lesson.code}</span>
              <span className="text-[14.5px] text-ink">{lesson.title}</span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                {lesson._count.questions} question{lesson._count.questions === 1 ? "" : "s"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
