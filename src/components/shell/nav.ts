import {
  LayoutDashboard,
  CalendarDays,
  PlayCircle,
  ListChecks,
  FolderGit2,
  Newspaper,
  Trophy,
  Waypoints,
  Workflow,
  Boxes,
  ShieldCheck,
  Clapperboard,
  FileQuestion,
  PenSquare,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

/** Mirrors the design handoff's navLearn/navCommunity/navTools/navManage
 * groupings (README §3, design/*.dc.html sidebar) — the numbered index labels
 * from that spec were dropped in favor of icons, which carry real scannable
 * meaning instead of an arbitrary ordinal. Profile isn't in here — it's
 * reached via the identity block at the bottom of the sidebar, per the design. */
export const NAV_LEARN: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/lessons", label: "Video lessons", icon: PlayCircle },
  { href: "/quiz", label: "Quizzes", icon: ListChecks },
  { href: "/submissions", label: "Submissions", icon: FolderGit2 },
];

export const NAV_COMMUNITY: NavItem[] = [
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export const NAV_TOOLS: NavItem[] = [
  { href: "/viz/terraform", label: "Terraform graph", icon: Waypoints },
  { href: "/viz/actions", label: "Actions workflow", icon: Workflow },
  { href: "/viz/k8s", label: "K8s manifests", icon: Boxes },
];

export const NAV_MANAGE: NavItem[] = [
  { href: "/admin", label: "Admin panel", icon: ShieldCheck },
  { href: "/admin/lessons", label: "Lessons", icon: Clapperboard },
  { href: "/admin/quizzes", label: "Quiz builder", icon: FileQuestion },
  { href: "/admin/posts", label: "Posts", icon: PenSquare },
  { href: "/admin/labs", label: "Lab submissions", icon: ClipboardCheck },
];
