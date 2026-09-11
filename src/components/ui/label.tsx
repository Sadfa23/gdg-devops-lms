import * as React from "react";
import { cn } from "@/lib/utils";

/** The design's "signature detail": 10px uppercase mono, wide tracking, muted. */
export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("block font-mono text-[10px] uppercase tracking-[0.12em] text-muted", className)}
      {...props}
    />
  );
}
