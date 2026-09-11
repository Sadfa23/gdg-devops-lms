import Link from "next/link";
import { listQuizzableLessons } from "@/features/quizzes/data";
import { PageHeader } from "@/components/shell/PageHeader";

export default async function QuizIndexPage() {
  const lessons = await listQuizzableLessons();

  return (
    <div>
      <PageHeader crumb="Community" title="Quizzes" />

      {lessons.length === 0 ? (
        <p className="text-[13px] text-muted">No quizzes published yet.</p>
      ) : (
        <div className="flex flex-col gap-px bg-line">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/quiz/${lesson.code}`}
              className="flex items-center gap-4 bg-surface px-4 py-3 no-underline hover:bg-elev"
            >
              <span className="font-mono text-[11px] text-muted">{lesson.code}</span>
              <span className="text-[14.5px] text-ink">{lesson.title}</span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                {lesson._count.questions} questions
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
