"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GdgLogo } from "@/components/GdgLogo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { NAV_COMMUNITY, NAV_LEARN, NAV_MANAGE, NAV_TOOLS, type NavItem } from "./nav";

type AppSidebarProps = {
  isAdmin: boolean;
  userName: string;
  userInitials: string;
  userRoleLabel: string;
};

function NavGroup({ heading, items }: { heading: string; items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <>
      <div className="px-[18px] pb-2 pt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted first:pt-0">{heading}</div>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 border-l-2 border-transparent px-[18px] py-2 text-[13.5px] text-ink hover:bg-elev",
              active ? "border-accent bg-elev font-medium" : "text-ink/90",
            )}
          >
            <Icon size={16} strokeWidth={2} className={cn("shrink-0", active ? "text-accent-ink" : "text-muted")} />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

/** The design's full sidebar (README §3): brand lockup, four numbered nav
 * groups (MANAGE gated to admins), identity block, theme toggle. */
export function AppSidebar({ isAdmin, userName, userInitials, userRoleLabel }: AppSidebarProps) {
  return (
    <aside className="sticky top-0 flex h-screen w-[246px] shrink-0 flex-col overflow-y-auto border-r-2 border-line bg-surface py-5">
      <Link href="/" className="flex items-center gap-2.5 px-[18px] pb-[18px]">
        <GdgLogo />
        <span className="flex flex-col leading-[1.15]">
          <span className="text-[13px] font-extrabold text-ink">DevOps Track</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">GDG JKUAT LMS</span>
        </span>
      </Link>
      <div className="mb-4 h-px bg-line" />

      <nav className="flex flex-1 flex-col">
        <NavGroup heading="Learn" items={NAV_LEARN} />
        <NavGroup heading="Community" items={NAV_COMMUNITY} />
        <NavGroup heading="Visualizers" items={NAV_TOOLS} />
        {isAdmin && <NavGroup heading="Manage" items={NAV_MANAGE} />}
      </nav>

      <div className="mt-auto border-t border-line px-[18px] pt-[18px]">
        <Link href="/profile" className="mb-3.5 flex w-full items-center gap-2.5 text-left hover:opacity-75">
          <span className="grid h-8 w-8 shrink-0 place-items-center bg-g-blue text-[11px] font-bold text-white">{userInitials}</span>
          <span className="flex min-w-0 flex-col leading-[1.2]">
            <span className="truncate text-[13px] font-semibold text-ink">{userName}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">{userRoleLabel} · View profile</span>
          </span>
        </Link>
        <ThemeToggle className="w-full justify-start" />
      </div>
    </aside>
  );
}
