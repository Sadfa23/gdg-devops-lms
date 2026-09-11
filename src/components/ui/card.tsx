import * as React from "react";
import { cn } from "@/lib/utils";

/** The recurring "hairline grid cell" primitive — a surface with a 1px border, no radius, no shadow. */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("border border-line bg-surface", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("border-b border-line px-4 py-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-[16px] font-bold tracking-[-0.02em] text-ink", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-[13px] text-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-4", className)} {...props} />;
}
