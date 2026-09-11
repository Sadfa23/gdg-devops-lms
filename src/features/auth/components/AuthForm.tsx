"use client";

import { useActionState, useState } from "react";
import { signInWithCredentials, signInWithGithub, signInWithGoogle, signUp } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

/**
 * The design's split auth panel (README §2) with its SIGN IN / CREATE
 * ACCOUNT tab pills — extended with real email+password fields, since
 * credentials auth is now a real (dev/testing) option alongside OAuth, not
 * just a mockup. OAuth buttons live outside this component (sign-in/page.tsx),
 * since they're plain server actions with no client state of their own.
 */
export function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [signInState, signInAction, signInPending] = useActionState(signInWithCredentials, undefined);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, undefined);

  const state = mode === "signin" ? signInState : signUpState;
  const pending = mode === "signin" ? signInPending : signUpPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-px border border-line bg-line">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={cn(
            "flex-1 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em]",
            mode === "signin" ? "bg-ink text-bg" : "bg-surface text-muted hover:bg-elev",
          )}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={cn(
            "flex-1 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em]",
            mode === "signup" ? "bg-ink text-bg" : "bg-surface text-muted hover:bg-elev",
          )}
        >
          Create account
        </button>
      </div>

      {state?.error && <p className="border-l-2 border-accent bg-accent-soft px-3 py-2 text-[13px] text-accent-ink">{state.error}</p>}

      <form action={mode === "signin" ? signInAction : signUpAction} className="flex flex-col gap-4">
        {mode === "signup" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required placeholder="Terence Otieno" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="registrationNumber">Reg. number</Label>
              <Input id="registrationNumber" name="registrationNumber" placeholder="SCT221-0000/2023" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">{mode === "signup" ? "University email" : "Email"}</Label>
          <Input id="email" name="email" type="email" required placeholder="you@students.jkuat.ac.ke" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={mode === "signup" ? 8 : undefined} />
        </div>

        <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
          {pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-muted">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[10px] uppercase tracking-[0.1em]">Or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form action={signInWithGoogle}>
        <Button type="submit" variant="secondary" size="lg" className="w-full">
          Continue with Google
        </Button>
      </form>
      <form action={signInWithGithub}>
        <Button type="submit" variant="secondary" size="lg" className="w-full">
          Continue with GitHub
        </Button>
      </form>
    </div>
  );
}
