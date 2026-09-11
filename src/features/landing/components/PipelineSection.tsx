"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PIPELINE_STAGES } from "../pipeline-data";

const STAGE_DURATION_MS = 5000;

/**
 * "The whole build, stage by stage" — auto-advances one stage every 5s,
 * crossfading the image layers exactly like the design's own stacked
 * `layer1..layer5` image approach (opacity transition, not a slide). A
 * manual click on a rail button jumps straight there AND resets the
 * countdown — re-running the effect on every `active` change (whether the
 * change came from the timer or a click) is what makes that "just work"
 * without separate pause/resume state.
 */
export function PipelineSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setActive((i) => (i + 1) % PIPELINE_STAGES.length), STAGE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [active]);

  const stage = PIPELINE_STAGES[active];

  return (
    <section id="pipeline" className="border-b-2 border-line">
      <div className="flex items-baseline justify-between gap-6 px-6 pb-6 pt-8 md:px-12">
        <h2 className="m-0 text-[clamp(28px,3.4vw,46px)] tracking-[-0.03em] text-ink">The whole build, stage by stage</h2>
        <span className="whitespace-nowrap font-mono text-[11px] tracking-[0.14em] text-muted">05 STAGES</span>
      </div>

      <div className="grid grid-cols-1 border-t border-line lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)]">
        <div className="flex flex-col border-line lg:border-r">
          {PIPELINE_STAGES.map((s, i) => (
            <button
              key={s.n}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-left transition-colors md:px-12",
                i === active ? "bg-ink text-bg" : "bg-transparent text-muted hover:bg-elev",
              )}
            >
              <span className="font-mono text-[11px] tracking-[0.1em] opacity-70">{s.n}</span>
              <span className="font-mono text-[11px] tracking-[0.13em]">{s.label}</span>
            </button>
          ))}

          <div className="mt-6 border-t border-line px-6 pt-5 md:px-12">
            <div key={`text-${active}`} className="animate-fade-in">
              <h3 className="mb-2.5 text-[26px] tracking-[-0.02em] text-ink">{stage.title}</h3>
              <p className="mb-4 max-w-[40ch] text-muted">{stage.body}</p>
              <ul className="mb-5 list-disc pl-[18px] text-[14px] text-ink">
                {stage.bullets.map((b) => (
                  <li key={b} className="mb-1.5">
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/lessons"
                className="inline-flex h-10 items-center border border-line-strong px-4 font-mono text-[11px] tracking-[0.12em] text-ink hover:bg-plate"
              >
                {stage.cta}
              </Link>
            </div>
          </div>
        </div>

        <div className="flex min-h-[520px] min-w-0 flex-col bg-surface">
          <div className="relative min-h-[300px] flex-1 overflow-hidden bg-[#0c0c0c]">
            {PIPELINE_STAGES.map((s, i) => (
              <Image
                key={s.n}
                src={s.image}
                alt={`${s.label} stage`}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className={cn("object-cover transition-opacity duration-700", i === active ? "opacity-100" : "opacity-0")}
                priority={i === 0}
              />
            ))}
          </div>

          <div key={`labels-${active}`} className="animate-fade-in flex flex-wrap justify-between gap-x-6 gap-y-2.5 border-t-2 border-line px-5 py-4">
            <div className="font-mono text-[11px] leading-[1.9] tracking-[0.1em] text-muted">
              {stage.leftLabels.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
            <div className="text-right font-mono text-[11px] leading-[1.9] tracking-[0.1em] text-muted">
              {stage.rightLabels.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          </div>

          <div className="border-t border-line bg-bg">
            <div className="flex items-center justify-between border-b border-line px-5 py-2.5 font-mono text-[10px] tracking-[0.1em] text-muted">
              <span className="text-ink">{stage.file}</span>
              <span>{stage.n}</span>
            </div>
            <pre key={`code-${active}`} className="animate-fade-in m-0 overflow-x-auto whitespace-pre-wrap px-5 py-4 font-mono text-[11.5px] leading-[1.85] text-ink">
              {stage.code}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
