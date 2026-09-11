"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

/**
 * Admin panel's `adminTab`/`profileTab`/`vizTool` pill-group pattern
 * (design README §3, §11, §15): a 1px-gap row of mono uppercase labels,
 * selected tab inverted (ink fill, bg text) — not an underline indicator.
 */
export function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("flex flex-col gap-4", className)} {...props} />;
}

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("flex gap-px bg-line", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Tab>) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "bg-surface px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted transition-colors",
        "data-[active]:bg-ink data-[active]:text-bg",
        "hover:not-data-[active]:bg-elev",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return <TabsPrimitive.Panel className={cn(className)} {...props} />;
}
