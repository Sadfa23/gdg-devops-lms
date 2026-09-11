"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addChapter, deleteChapter } from "../actions";
import type { Chapter } from "@/generated/prisma/client";
import { formatMmSs } from "@/lib/time";

export function ChapterList({ chapters, lessonId }: { chapters: Chapter[]; lessonId: string }) {
  return (
    <div className="flex flex-col gap-4">
      {chapters.length > 0 && (
        <div className="flex flex-col gap-px bg-line">
          {chapters.map((c) => (
            <div key={c.id} className="flex items-center gap-4 bg-surface px-4 py-2.5">
              <span className="font-mono text-[11px] text-muted">{formatMmSs(c.timecodeSeconds)}</span>
              <span className="flex-1 text-[13.5px] text-ink">{c.label}</span>
              <form action={deleteChapter.bind(null, c.id, lessonId)}>
                <button type="submit" className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted hover:text-accent-ink">
                  ✕
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
      <AddChapterForm lessonId={lessonId} />
    </div>
  );
}

function AddChapterForm({ lessonId }: { lessonId: string }) {
  const [state, formAction, pending] = useActionState(addChapter, undefined);

  return (
    <form action={formAction} className="flex items-start gap-3">
      <input type="hidden" name="lessonId" value={lessonId} />
      <Input name="timecode" placeholder="00:00" className="w-24 font-mono" required />
      <Input name="label" placeholder="What happens here" className="flex-1" required />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Adding…" : "+ Add"}
      </Button>
      {state?.error && <p className="text-[12px] text-accent-ink">{state.error}</p>}
    </form>
  );
}
