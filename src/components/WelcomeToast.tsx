"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/** Fires the "signed in" toast once, then strips the `?welcome=1` marker
 * `signIn()`'s `redirectTo` set — the sign-in itself happens server-side
 * (a Server Action), so this is how the client finds out it succeeded. */
export function WelcomeToast() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("welcome") !== "1") return;
    toast.success("Signed in", { description: "Welcome back to the DevOps track." });
    router.replace("/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}
