"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addQuestion } from "../actions";

const DIFFICULTIES = ["recall", "core", "applied"] as const;
const OPTION_KEYS = ["A", "B", "C", "D"] as const;

export function QuestionForm({ lessonId }: { lessonId: string }) {
  const [state, formAction, pending] = useActionState(addQuestion, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 border border-dashed border-line-strong p-5">
      <input type="hidden" name="lessonId" value={lessonId} />

      {state?.error && <p className="border-l-2 border-accent bg-accent-soft px-3 py-2 text-[13px] text-accent-ink">{state.error}</p>}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea id="prompt" name="prompt" required placeholder="Ask about a decision, not a definition." />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="topic">Topic label</Label>
          <Input id="topic" name="topic" placeholder="MODULE 04 · DEPLOY ORDERING" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="points">Points</Label>
          <Input id="points" name="points" type="number" defaultValue={10} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="difficulty">Difficulty</Label>
          <select
            id="difficulty"
            name="difficulty"
            className="h-10 border border-line bg-transparent px-3 font-sans text-[14px] text-ink outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d} className="bg-surface text-ink">
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Options · pick the correct one</Label>
        {OPTION_KEYS.map((key) => (
          <div key={key} className="flex items-center gap-2.5">
            <label className="flex items-center gap-1.5">
              <input type="radio" name="correctOption" value={key} required className="accent-accent" />
              <span className="font-mono text-[11px] text-muted">{key}</span>
            </label>
            <Input name={`option${key}`} required placeholder="Make the wrong answers plausible" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="explanation">Explanation shown after answering</Label>
        <Textarea id="explanation" name="explanation" placeholder="Say why the right answer is right — and why the tempting one is not." />
      </div>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Adding…" : "+ Add question"}
      </Button>
    </form>
  );
}
