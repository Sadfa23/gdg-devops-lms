import { deleteQuestion } from "../actions";

export function DeleteQuestionButton({ questionId, lessonId }: { questionId: string; lessonId: string }) {
  return (
    <form action={deleteQuestion.bind(null, questionId, lessonId)}>
      <button type="submit" className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted hover:text-accent-ink">
        ✕ Remove
      </button>
    </form>
  );
}
