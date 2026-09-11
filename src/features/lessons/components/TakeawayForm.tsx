"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addTakeaway, deleteTakeaway } from "../actions";
import type { Takeaway } from "@/generated/prisma/client";

export function TakeawayList({ takeaways, lessonId }: { takeaways: Takeaway[]; lessonId: string }) {
  return (
    <div className="flex flex-col gap-4">
      {takeaways.length > 0 && (
        <div className="flex flex-col gap-px bg-line">
          {takeaways.map((t) => (
            <div key={t.id} className="flex items-center gap-4 bg-surface px-4 py-2.5">
              <span className="border border-line-strong px-1.5 py-0.5 font-mono text-[10px] text-muted">{t.code}</span>
              <span className="flex-1 text-[13.5px] text-ink">{t.text}</span>
              <form action={deleteTakeaway.bind(null, t.id, lessonId)}>
                <button type="submit" className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted hover:text-accent-ink">
                  ✕
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
      <AddTakeawayForm lessonId={lessonId} />
    </div>
  );
}

function AddTakeawayForm({ lessonId }: { lessonId: string }) {
  const [state, formAction, pending] = useActionState(addTakeaway, undefined);

  return (
    <form action={formAction} className="flex items-start gap-3">
      <input type="hidden" name="lessonId" value={lessonId} />
      <Input name="text" placeholder="One sentence a learner should be able to repeat" className="flex-1" required />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Adding…" : "+ Add"}
      </Button>
      {state?.error && <p className="text-[12px] text-accent-ink">{state.error}</p>}
    </form>
  );
}
