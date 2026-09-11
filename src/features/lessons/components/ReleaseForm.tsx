"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateLessonRelease } from "../actions";
import type { LessonLevel, LessonVisibility } from "@/generated/prisma/client";

type ReleaseFormProps = {
  lessonId: string;
  initial: { visibility: LessonVisibility; xp: number; level: LessonLevel; scheduledFor: Date | null };
};

export function ReleaseForm({ lessonId, initial }: ReleaseFormProps) {
  const [state, formAction, pending] = useActionState(updateLessonRelease, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 border border-line bg-surface p-5">
      <input type="hidden" name="lessonId" value={lessonId} />
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Release</p>

      {state?.error && <p className="border-l-2 border-accent bg-accent-soft px-3 py-2 text-[13px] text-accent-ink">{state.error}</p>}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="visibility">Visibility</Label>
        <select
          id="visibility"
          name="visibility"
          defaultValue={initial.visibility}
          className="h-10 border border-line bg-transparent px-3 font-sans text-[14px] text-ink outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <option value="draft" className="bg-surface text-ink">
            Draft — track leads only
          </option>
          <option value="scheduled" className="bg-surface text-ink">
            Scheduled
          </option>
          <option value="live" className="bg-surface text-ink">
            Live now
          </option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="scheduledFor">Scheduled for (if scheduled)</Label>
        <Input
          id="scheduledFor"
          name="scheduledFor"
          type="date"
          defaultValue={initial.scheduledFor ? initial.scheduledFor.toISOString().slice(0, 10) : ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="xp">XP</Label>
          <Input id="xp" name="xp" type="number" defaultValue={initial.xp} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="level">Level</Label>
          <select
            id="level"
            name="level"
            defaultValue={initial.level}
            className="h-10 border border-line bg-transparent px-3 font-sans text-[14px] text-ink outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <option value="core" className="bg-surface text-ink">
              Core
            </option>
            <option value="deep_dive" className="bg-surface text-ink">
              Deep dive
            </option>
            <option value="optional" className="bg-surface text-ink">
              Optional
            </option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save release settings"}
      </Button>
    </form>
  );
}
