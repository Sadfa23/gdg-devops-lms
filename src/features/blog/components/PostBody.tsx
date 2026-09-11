import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import { MermaidDiagram } from "./MermaidDiagram";
import { fenceLang, sharedMarkdownComponents, textContent, VideoEmbed } from "../markdown-elements";

/** The published article's renderer — a Server Component so fenced code
 * blocks can go through Shiki (see CodeBlock) at zero client-bundle cost,
 * same precedent as Topograph's own code surfaces. The admin compose page's
 * live preview renders the same Markdown through a lighter, client-side-only
 * set of `code`/`pre` renderers instead (no Shiki there). */
export function PostBody({ content }: { content: string }) {
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
            return <CodeBlock code={code} lang={lang} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
