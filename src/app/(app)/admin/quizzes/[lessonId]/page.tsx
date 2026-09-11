import { notFound } from "next/navigation";
import { getLessonQuizForEdit } from "@/features/quizzes/data";
import { PageHeader } from "@/components/shell/PageHeader";
import { QuestionForm } from "@/features/quizzes/components/QuestionForm";
import { SettingsForm } from "@/features/quizzes/components/SettingsForm";
import { DeleteQuestionButton } from "@/features/quizzes/components/DeleteQuestionButton";

export default async function QuizBuilderEditPage({ params }: PageProps<"/admin/quizzes/[lessonId]">) {
  const { lessonId } = await params;
  const lesson = await getLessonQuizForEdit(lessonId);
  if (!lesson) notFound();

  return (
    <div>
      <PageHeader crumb={`Track lead · ${lesson.code}`} title={lesson.title} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-px bg-line">
            {lesson.questions.length === 0 && (
              <p className="bg-bg py-4 text-[13px] text-muted">
                No questions yet for this lesson. Add the first one — four options, one correct, one sentence of explanation.
              </p>
            )}
            {lesson.questions.map((q, i) => (
              <div key={q.id} className="flex items-start justify-between gap-4 bg-surface px-4 py-3">
                <div className="min-w-0">
                  <span className="mr-2 font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">
                    {String(i + 1).padStart(2, "0")} · {q.difficulty}
                  </span>
                  <span className="mr-2 font-mono text-[10px] text-muted">{q.points} XP</span>
                  <p className="mt-1 truncate text-[13.5px] text-ink">{q.prompt}</p>
                </div>
                <DeleteQuestionButton questionId={q.id} lessonId={lesson.id} />
              </div>
            ))}
          </div>

          <QuestionForm lessonId={lesson.id} />
        </div>

        <SettingsForm
          lessonId={lesson.id}
          initial={{
            passMarkPercent: lesson.quizSettings?.passMarkPercent ?? 70,
            timeLimitMinutes: lesson.quizSettings?.timeLimitMinutes ?? 10,
            attemptsAllowed: lesson.quizSettings?.attemptsAllowed ?? 2,
            shuffleQuestions: lesson.quizSettings?.shuffleQuestions ?? true,
            shuffleOptions: lesson.quizSettings?.shuffleOptions ?? false,
            showExplanationImmediately: lesson.quizSettings?.showExplanationImmediately ?? true,
          }}
        />
      </div>
    </div>
  );
}
