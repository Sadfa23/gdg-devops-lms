import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Hand-authored, not `shadcn add`-ed — the registry fetch was unreliable in
 * this environment, and the variants below are lifted directly from the
 * design handoff (README §Design Tokens → Components), not shadcn's stock
 * button. Zero radius / no shadow are enforced globally in globals.css, not
 * here — see that file's comment before adding a `shadow-*`/`rounded-*` class
 * anywhere, it will silently do nothing.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-sans font-extrabold text-[14px] transition-colors disabled:pointer-events-none disabled:opacity-50 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        primary: "bg-accent text-bg hover:bg-accent-ink active:brightness-90",
        secondary: "bg-transparent text-ink border border-line-strong hover:bg-plate active:bg-accent-surface",
        ghost: "bg-transparent text-ink hover:bg-plate",
        destructive: "bg-accent text-bg hover:brightness-110",
      },
      size: {
        default: "h-9 px-3.5 py-2",
        sm: "h-8 px-3 text-[13px]",
        lg: "h-11 px-4",
        inline: "h-auto p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
