import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { GdgLogo } from "@/components/GdgLogo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ToolTabs } from "@/components/shell/ToolTabs";

/**
 * A deliberately separate, minimal-chrome route group — the visualizers are
 * meant to be used almost full-screen, not squeezed into the app shell's
 * 246px sidebar + padded main column. No AppSidebar here at all, just a
 * slim bar with a way back and a way to switch tools, then the tool gets
 * the rest of the viewport. proxy.ts still gates `/viz/*` on a session
 * cookie regardless of which route group serves it, so this re-checks the
 * real session itself (same reasoning as the admin layout's own check).
 */
export default async function ToolsLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-13 shrink-0 items-center gap-4 border-b-2 border-line bg-surface px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted no-underline hover:text-ink"
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <span className="h-4 w-px bg-line" />
        <GdgLogo width={20} height={12} />
        <ToolTabs />
        <ThemeToggle className="ml-auto" />
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
