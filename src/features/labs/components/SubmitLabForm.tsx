"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitLab } from "../actions";
import type { Lab } from "@/generated/prisma/client";

export function SubmitLabForm({ labs }: { labs: Lab[] }) {
  const [state, formAction, pending] = useActionState(submitLab, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 border border-line bg-surface p-4">
      {state?.error && <p className="w-full border-l-2 border-accent bg-accent-soft px-3 py-2 text-[13px] text-accent-ink">{state.error}</p>}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="labId">Lab</Label>
        <select
          id="labId"
          name="labId"
          required
          className="h-10 border border-line bg-transparent px-3 font-sans text-[14px] text-ink outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          {labs.map((lab) => (
            <option key={lab.id} value={lab.id} className="bg-surface text-ink">
              {lab.code} — {lab.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-w-[260px] flex-1 flex-col gap-1.5">
        <Label htmlFor="repoUrl">Repo URL</Label>
        <Input id="repoUrl" name="repoUrl" type="url" required placeholder="https://github.com/gdg-jkuat/lab04-you" />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit"}
      </Button>
    </form>
  );
}
