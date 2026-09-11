"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveQuizSettings } from "../actions";

type SettingsFormProps = {
  lessonId: string;
  initial: {
    passMarkPercent: number;
    timeLimitMinutes: number;
    attemptsAllowed: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showExplanationImmediately: boolean;
  };
};

export function SettingsForm({ lessonId, initial }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(saveQuizSettings, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 border border-line bg-surface p-5">
      <input type="hidden" name="lessonId" value={lessonId} />
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Quiz settings</p>

      {state?.error && <p className="border-l-2 border-accent bg-accent-soft px-3 py-2 text-[13px] text-accent-ink">{state.error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="passMarkPercent">Pass mark %</Label>
          <Input id="passMarkPercent" name="passMarkPercent" type="number" defaultValue={initial.passMarkPercent} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="timeLimitMinutes">Time limit (min)</Label>
          <Input id="timeLimitMinutes" name="timeLimitMinutes" type="number" defaultValue={initial.timeLimitMinutes} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="attemptsAllowed">Attempts allowed (0 = unlimited)</Label>
        <Input id="attemptsAllowed" name="attemptsAllowed" type="number" defaultValue={initial.attemptsAllowed} />
      </div>

      <div className="flex flex-col gap-2 border-t border-line pt-3">
        <label className="flex items-center gap-2 text-[13px] text-ink">
          <input type="checkbox" name="shuffleQuestions" defaultChecked={initial.shuffleQuestions} className="accent-accent" />
          Shuffle question order
        </label>
        <label className="flex items-center gap-2 text-[13px] text-ink">
          <input type="checkbox" name="shuffleOptions" defaultChecked={initial.shuffleOptions} className="accent-accent" />
          Shuffle options
        </label>
        <label className="flex items-center gap-2 text-[13px] text-ink">
          <input
            type="checkbox"
            name="showExplanationImmediately"
            defaultChecked={initial.showExplanationImmediately}
            className="accent-accent"
          />
          Show explanation after each answer
        </label>
      </div>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
