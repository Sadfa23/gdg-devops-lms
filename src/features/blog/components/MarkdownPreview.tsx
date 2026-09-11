"use client";

import { useDeferredValue } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MermaidDiagram } from "./MermaidDiagram";
import { fenceLang, sharedMarkdownComponents, textContent, VideoEmbed } from "../markdown-elements";

function PlainCodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <div className="max-w-[80ch] border border-line bg-surface">
      {lang && <div className="border-b border-line px-5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{lang}</div>}
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-ink">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/** Live preview for the compose page — deliberately lighter than the real
 * published-post renderer (no Shiki, since that needs a Server Component):
 * close enough to proof-read structure, headings, images and diagrams while
 * writing, without paying for a server round-trip on every keystroke.
 * `useDeferredValue` keeps typing responsive on long posts by letting the
 * (heavier) markdown-to-React pass trail a beat behind the raw text. */
export function MarkdownPreview({ content }: { content: string }) {
  const deferred = useDeferredValue(content);

  return (
    <div className="flex flex-col gap-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ...sharedMarkdownComponents,
          code({ className, children }) {
            const lang = fenceLang(className);
            const code = textContent(children).replace(/\n$/, "");

            if (!lang) {
              return <code className="bg-plate px-1.5 py-0.5 font-mono text-[0.9em] text-ink">{children}</code>;
            }
            if (lang === "mermaid") return <MermaidDiagram chart={code} />;
            if (lang === "video") return <VideoEmbed url={code.trim()} />;
            return <PlainCodeBlock code={code} lang={lang} />;
          },
        }}
      >
        {deferred || "*Nothing to preview yet — start writing on the left.*"}
      </ReactMarkdown>
    </div>
  );
}
