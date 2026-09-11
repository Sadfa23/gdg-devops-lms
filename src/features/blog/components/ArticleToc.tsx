"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ArticleTocProps = { headings: { id: string; text: string }[] };

/** "Quick scroll based on the subtitles" — sticky nav that tracks which
 * heading is currently in view via IntersectionObserver, the same
 * `tocAt`-scroll-spy behavior the design's article view calls for (README §9). */
export function ArticleToc({ headings }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px" },
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-[88px] hidden max-h-[calc(100vh-120px)] w-[220px] shrink-0 overflow-y-auto lg:block">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">On this page</p>
      <ul className="flex flex-col gap-2.5 border-l border-line pl-3.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn("block text-[13px] leading-[1.4] text-muted hover:text-ink", activeId === h.id && "text-ink font-medium")}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
