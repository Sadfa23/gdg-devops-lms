"use client";

import { useEffect, useId, useRef, useState } from "react";

/** Renders a ```mermaid fenced block as an inline diagram. Mermaid needs a
 * real DOM to lay out and produce SVG, so this is a client-only island
 * inside an otherwise server-rendered post body — the same pattern as any
 * other interactive widget embedded in static content. */
export function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "strict", fontFamily: "inherit" });
      try {
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch {
        if (!cancelled) setError("Couldn't render this diagram — check the Mermaid syntax.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return <p className="max-w-[70ch] border-l-2 border-accent bg-accent-soft px-3 py-2 text-[13px] text-accent-ink">{error}</p>;
  }

  return <div ref={ref} className="max-w-[80ch] overflow-x-auto border border-line bg-surface p-6 [&_svg]:mx-auto" />;
}
