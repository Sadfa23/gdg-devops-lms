"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createPost } from "../actions";

const CATEGORIES = ["guide", "teardown", "career", "notes", "security"] as const;

export function PostForm() {
  const [state, formAction, pending] = useActionState(createPost, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      {state?.error && <p className="border-l-2 border-accent bg-accent-soft px-3 py-2 text-[13px] text-accent-ink">{state.error}</p>}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required placeholder="The scan gate that finally blocked a bad merge" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="kicker">Kicker</Label>
        <Input id="kicker" name="kicker" placeholder="DEVSECOPS · GUIDE" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="deck">Deck</Label>
        <Textarea id="deck" name="deck" placeholder="One or two sentences that pull the reader in." />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          className="h-10 w-full max-w-[220px] border border-line bg-transparent px-3 font-sans text-[14px] text-ink outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-surface text-ink">
              {c}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? "Creating…" : "Create draft"}
      </Button>
    </form>
  );
}
