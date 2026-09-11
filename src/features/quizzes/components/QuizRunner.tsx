"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { checkAnswer, submitQuiz, type SubmitQuizResult } from "../actions";

type Option = { id: string; text: string };
type Question = { id: string; prompt: string; topic: string | null; options: Option[]; explanation: string | null };

type QuizRunnerProps = {
  lessonId: string;
  questions: Question[];
  showExplanationImmediately: boolean;
};

type Answer = { questionId: string; selectedOptionId: string | null };

/**
 * One question at a time (README §6): select → confirm → reveal (if
 * `showExplanationImmediately`) → next → summary. Answers accumulate in
 * local state; the whole run is scored authoritatively in one Server Action
 * call when the last question is confirmed — `checkAnswer` (called per
 * question, on confirm) only drives the reveal UI, it never sets the score.
 */
export function QuizRunner({ lessonId, questions, showExplanationImmediately }: QuizRunnerProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [reveal, setReveal] = useState<{ isCorrect: boolean; correctOptionId: string } | null>(null);
  const [result, setResult] = useState<SubmitQuizResult | null>(null);
  const [pending, startTransition] = useTransition();

  const question = questions[index];
  const isLast = index === questions.length - 1;

  function confirm() {
    if (!picked) return;
    startTransition(async () => {
      const res = await checkAnswer(question.id, picked);
      if ("error" in res) {
        toast.error("Couldn't check that answer", { description: res.error });
        return;
      }
      setReveal(res);
      if (!showExplanationImmediately) advance();
    });
  }

  function advance() {
    const nextAnswers = [...answers, { questionId: question.id, selectedOptionId: picked }];
    setAnswers(nextAnswers);

    if (isLast) {
      startTransition(async () => {
        const res = await submitQuiz({ lessonId, answers: nextAnswers });
        if ("error" in res) {
          toast.error("Couldn't submit your quiz", { description: res.error });
          return;
        }
        setResult(res);
        toast[res.passed ? "success" : "error"](res.passed ? "Quiz passed" : "Below the pass mark", {
          description: `${res.correctCount}/${res.totalCount} correct · +${res.xpEarned} XP`,
        });
      });
    } else {
      setIndex(index + 1);
      setPicked(null);
      setReveal(null);
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-[56ch] text-center">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Result</p>
        <p className={cn("mb-1 text-[48px] font-extrabold tracking-[-0.03em]", result.passed ? "text-g-green" : "text-accent-ink")}>
          {result.scorePercent}%
        </p>
        <p className="mb-6 text-[14px] text-muted">
          {result.correctCount} / {result.totalCount} correct · +{result.xpEarned} XP · {result.passed ? "Passed" : "Below the pass mark"}
        </p>
        <Button onClick={() => router.push("/quiz")}>Back to quizzes</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[56ch]">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        {question.topic ?? "Question"} · {index + 1} / {questions.length}
      </p>
      <h2 className="mb-6 text-[20px] font-bold leading-[1.35] text-ink">{question.prompt}</h2>

      <div className="mb-6 flex flex-col gap-px bg-line">
        {question.options.map((option, i) => {
          const isPicked = picked === option.id;
          const isCorrectOption = reveal?.correctOptionId === option.id;
          const isWrongPick = !!reveal && isPicked && !reveal.isCorrect;
          return (
            <button
              key={option.id}
              type="button"
              disabled={!!reveal}
              onClick={() => setPicked(option.id)}
              className={cn(
                "flex items-center gap-3.5 border-2 border-transparent bg-surface px-4 py-3.5 text-left text-[15px] text-ink",
                !reveal && isPicked && "border-ink",
                !reveal && "hover:bg-elev",
                isCorrectOption && "border-g-green bg-accent-soft",
                isWrongPick && "border-accent bg-accent-soft",
              )}
            >
              <span className="w-4 font-mono text-[13px] text-muted">{String.fromCharCode(65 + i)}</span>
              {option.text}
              {isCorrectOption && (
                <span className="ml-auto font-mono text-[9.5px] uppercase tracking-[0.1em] text-g-green">Correct answer</span>
              )}
            </button>
          );
        })}
      </div>

      {reveal && question.explanation && (
        <div className="mb-6 border-l-2 border-accent bg-accent-soft px-4 py-3.5 text-[14px] leading-[1.5] text-ink">
          {question.explanation}
        </div>
      )}

      {!reveal ? (
        <Button size="lg" disabled={!picked || pending} onClick={confirm}>
          {pending ? "Checking…" : "Confirm"}
        </Button>
      ) : (
        <Button size="lg" disabled={pending} onClick={advance}>
          {pending ? "Scoring…" : isLast ? "See result" : "Next"}
        </Button>
      )}
    </div>
  );
}
