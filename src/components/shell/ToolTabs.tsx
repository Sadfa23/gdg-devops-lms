"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TOOLS = [
  { slug: "terraform", label: "Terraform" },
  { slug: "actions", label: "Actions" },
  { slug: "k8s", label: "K8s" },
] as const;

/** Lets you switch tools without leaving the full-screen view — the
 * visualizer itself also has its own internal K8s/Actions/Terraform rail
 * (it's the same Topograph instance for all three), so this is really just
 * a fast way to jump straight to a specific one from a shared link. */
export function ToolTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-px bg-line">
      {TOOLS.map((t) => (
        <Link
          key={t.slug}
          href={`/viz/${t.slug}`}
          className={cn(
            "bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted no-underline hover:bg-elev",
            pathname === `/viz/${t.slug}` && "bg-ink text-bg",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
