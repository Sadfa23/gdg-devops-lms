"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  if (state?.message) {
    return <p className="border-l-2 border-accent bg-accent-soft px-3 py-2 text-[13px] text-accent-ink">{state.message}</p>;
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@students.jkuat.ac.ke" />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
