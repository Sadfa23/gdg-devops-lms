"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createLesson } from "../actions";
import type { Module } from "@/generated/prisma/client";

type LessonFormProps = { modules: Module[] };

/** `01 · THE BASICS` — module, lesson number, title, summary. Used for
 * *creating* a lesson; `BasicsForm` is the equivalent for editing an
 * existing one inside the full builder. */
export function LessonForm({ modules }: LessonFormProps) {
  const [state, formAction, pending] = useActionState(createLesson, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      {state?.error && (
        <p className="border-l-2 border-accent bg-accent-soft px-3 py-2 text-[13px] text-accent-ink">{state.error}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="moduleId">Module</Label>
        <select
          id="moduleId"
          name="moduleId"
          required
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
        <Input id="code" name="code" placeholder="04.10" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="What does the learner walk away able to do?" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" name="summary" placeholder="Two or three sentences — what is built, what breaks, what is proved." />
      </div>

      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? "Creating…" : "Create & continue →"}
      </Button>
    </form>
  );
}
