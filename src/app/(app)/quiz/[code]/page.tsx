import { notFound } from "next/navigation";
import { getQuizForLesson } from "@/features/quizzes/data";
import { QuizRunner } from "@/features/quizzes/components/QuizRunner";
import { PageHeader } from "@/components/shell/PageHeader";

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default async function QuizRunnerPage({ params }: PageProps<"/quiz/[code]">) {
  const { code } = await params;
  const lesson = await getQuizForLesson(code);
  if (!lesson || lesson.questions.length === 0) notFound();

  // Strip `isCorrect` before this ever reaches the client — see checkAnswer's
  // comment in features/quizzes/actions.ts for why that matters.
  let questions = lesson.questions.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    topic: q.topic,
    explanation: q.explanation,
    options: q.options.map((o) => ({ id: o.id, text: o.text })),
  }));

  if (lesson.quizSettings?.shuffleQuestions) questions = shuffled(questions);
  if (lesson.quizSettings?.shuffleOptions) questions = questions.map((q) => ({ ...q, options: shuffled(q.options) }));

  return (
    <div>
      <PageHeader crumb={lesson.code} title={lesson.title} />
      <QuizRunner
        lessonId={lesson.id}
        questions={questions}
        showExplanationImmediately={lesson.quizSettings?.showExplanationImmediately ?? true}
      />
    </div>
  );
}
