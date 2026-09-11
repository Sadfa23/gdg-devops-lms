"use client";

import type { CSSProperties } from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Toast notifications (sign-in, quiz results, saves) — square, hairline-bordered, matching the rest of the app rather than sonner's rounded default. */
export function Toaster(props: ToasterProps) {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--surface)",
          "--normal-text": "var(--ink)",
          "--normal-border": "var(--line-strong)",
          "--border-radius": "0px",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "font-sans",
          title: "text-[14px] font-semibold",
          description: "text-[13px] text-muted",
        },
      }}
      {...props}
    />
  );
}
