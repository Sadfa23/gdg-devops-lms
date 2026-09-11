"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { gradeSubmission } from "../actions";
import type { LabState } from "@/generated/prisma/client";

type GradeSubmissionFormProps = {
  submissionId: string;
  initial: { state: LabState; grade: number | null; feedback: string | null };
};

export function GradeSubmissionForm({ submissionId, initial }: GradeSubmissionFormProps) {
  const [state, formAction, pending] = useActionState(gradeSubmission, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 border-t border-line bg-elev px-4 py-3">
      <input type="hidden" name="submissionId" value={submissionId} />
      {state?.error && (
        <p className="w-full border-l-2 border-accent bg-accent-soft px-3 py-2 text-[13px] text-accent-ink">{state.error}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`state-${submissionId}`}>State</Label>
        <select
          id={`state-${submissionId}`}
          name="state"
          defaultValue={initial.state}
          className="h-9 border border-line bg-transparent px-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <option value="in_review" className="bg-surface text-ink">
            In review
          </option>
          <option value="passed" className="bg-surface text-ink">
            Passed
          </option>
          <option value="changes_asked" className="bg-surface text-ink">
            Changes asked
          </option>
          <option value="overdue" className="bg-surface text-ink">
            Overdue
          </option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`grade-${submissionId}`}>Grade</Label>
        <Input
          id={`grade-${submissionId}`}
          name="grade"
          type="number"
          min={0}
          max={100}
          defaultValue={initial.grade ?? ""}
          className="w-20"
        />
      </div>

      <div className="flex min-w-[240px] flex-1 flex-col gap-1.5">
        <Label htmlFor={`feedback-${submissionId}`}>Feedback</Label>
        <Textarea
          id={`feedback-${submissionId}`}
          name="feedback"
          defaultValue={initial.feedback ?? ""}
          className="min-h-9"
          placeholder="What to fix, or why it passed"
        />
      </div>

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
