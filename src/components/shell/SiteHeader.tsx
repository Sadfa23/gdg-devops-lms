import Link from "next/link";
import { GdgLogo } from "@/components/GdgLogo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b-2 border-line bg-bg/95 px-6 py-3.5 backdrop-blur-sm md:px-7">
      <Link href="/" className="flex items-center gap-3.5">
        <GdgLogo width={34} height={20} />
        <span className="flex flex-col leading-[1.1]">
          <span className="text-[15px] font-extrabold tracking-[-0.01em] text-ink">GDG On Campus JKUAT</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">DevOps Track · 2026/2027</span>
        </span>
      </Link>

      <nav className="hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink md:flex">
        <a href="#pipeline" className="hover:text-accent-ink">
          Pipeline
        </a>
        <a href="#tools" className="hover:text-accent-ink">
          Tools
        </a>
        <a href="#blog" className="hover:text-accent-ink">
          Blog
        </a>
      </nav>

      <div className="flex items-center gap-2.5">
        <ThemeToggle />
        <Link href="/sign-in">
          <Button variant="secondary" size="sm">
            Log in
          </Button>
        </Link>
        <Link href="/sign-in">
          <Button size="sm">Join the track</Button>
        </Link>
      </div>
    </header>
  );
}
