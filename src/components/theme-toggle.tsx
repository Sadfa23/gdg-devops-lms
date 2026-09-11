"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/** The header/sidebar's `{{ themeLabel }}` button — shows the mode you'd switch TO, per the design. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // next-themes' resolvedTheme is genuinely undefined until after hydration —
  // this mount-flag is the documented way to avoid a hydration mismatch /
  // flash of the wrong label, not state that belongs in a derived value.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title="Toggle appearance"
      className={cn(
        "flex h-8.5 items-center gap-1.5 whitespace-nowrap border border-line px-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink hover:border-line-strong",
        className,
      )}
    >
      {mounted ? (isDark ? "Light mode" : "Dark mode") : "Theme"}
    </button>
  );
}
