"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateLessonBasics } from "../actions";
import type { Module } from "@/generated/prisma/client";

type BasicsFormProps = {
  lessonId: string;
  modules: Module[];
  initial: { moduleId: string; code: string; title: string; summary: string | null };
};

/** `01 · THE BASICS`, editable — the update counterpart to `LessonForm`'s create path. */
export function BasicsForm({ lessonId, modules, initial }: BasicsFormProps) {
  const [state, formAction, pending] = useActionState(updateLessonBasics, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="lessonId" value={lessonId} />
      {state?.error && <p className="border-l-2 border-accent bg-accent-soft px-3 py-2 text-[13px] text-accent-ink">{state.error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="moduleId">Module</Label>
          <select
            id="moduleId"
            name="moduleId"
            defaultValue={initial.moduleId}
            className="h-10 border border-line bg-transparent px-3 font-sans text-[14px] text-ink outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            {modules.map((m) => (
              <option key={m.id} value={m.id} className="bg-surface text-ink">
                Module {m.number} — {m.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="code">Lesson number</Label>
          <Input id="code" name="code" defaultValue={initial.code} required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={initial.title} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" name="summary" defaultValue={initial.summary ?? ""} />
      </div>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
