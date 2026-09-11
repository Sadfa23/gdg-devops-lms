import type { Components } from "react-markdown";
import type { ReactNode } from "react";
import { slugify } from "./slug";

export function textContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textContent((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

export function headingId(children: ReactNode): string {
  return slugify(textContent(children));
}

/** Pulls every `##`/`###` line out of the raw Markdown, in document order —
 * feeds ArticleToc's "quick scroll based on the subtitles" nav. Must derive
 * ids the exact same way the `h2`/`h3` renderers below do, or the anchors
 * won't line up. */
export function headingsOf(content: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const re = /^#{2,3}\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = re.exec(content))) {
    const text = match[1].trim();
    headings.push({ id: slugify(text), text });
  }
  return headings;
}

/**
 * Renderers shared between the real published article (Server Component,
 * Shiki-highlighted code) and the admin compose page's live preview (Client
 * Component, plain code blocks) — everything except `code`/`pre`, which the
 * two callers supply themselves since one can run Shiki and the other can't.
 */
export const sharedMarkdownComponents: Partial<Components> = {
  h2: ({ children }) => (
    <h2 id={headingId(children)} className="mt-10 scroll-mt-24 text-[24px] font-extrabold tracking-[-0.02em] text-ink">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={headingId(children)} className="mt-8 scroll-mt-24 text-[19px] font-bold tracking-[-0.01em] text-ink">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="max-w-[70ch] text-[16px] leading-[1.7] text-ink">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="text-accent-ink underline underline-offset-2"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="max-w-[70ch] list-disc pl-5 text-[16px] leading-[1.7] text-ink">{children}</ul>,
  ol: ({ children }) => <ol className="max-w-[70ch] list-decimal pl-5 text-[16px] leading-[1.7] text-ink">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="max-w-[70ch] border-l-2 border-accent bg-accent-soft px-5 py-4 text-[14.5px] leading-[1.6] text-ink [&>p]:max-w-none">
      {children}
    </blockquote>
  ),
  img: ({ src, alt, title }) => (
    <figure className="max-w-[80ch]">
      {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary-hosted, arbitrary aspect ratio */}
      <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} className="w-full" />
      {title && <figcaption className="mt-2 font-mono text-[11px] text-muted">{title}</figcaption>}
    </figure>
  ),
  table: ({ children }) => (
    <div className="max-w-[80ch] overflow-x-auto">
      <table className="w-full border-collapse text-[14px]">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-line-strong px-3 py-2 text-left font-bold text-ink">{children}</th>,
  td: ({ children }) => <td className="border-b border-line px-3 py-2 text-ink">{children}</td>,
  hr: () => <hr className="my-8 border-line" />,
  // Our custom `code` renderers already own their wrapper element (a bordered
  // panel, a <video>, a mermaid <div>) — without this override, react-markdown's
  // default `pre` would wrap that in a second, redundant <pre>.
  pre: ({ children }) => <>{children}</>,
};

export function fenceLang(className?: string): string | undefined {
  return /language-(\w+)/.exec(className ?? "")?.[1];
}

/** A ```video fenced block holds either a Bunny Stream embed URL (every new
 * upload — see MarkdownEditor's Video button) or, for posts written before
 * the switch, a direct Cloudinary/other file URL. Bunny needs an <iframe>;
 * a plain file URL needs a native <video> tag — this picks the right one. */
export function VideoEmbed({ url }: { url: string }) {
  if (url.includes("mediadelivery.net")) {
    return (
      <iframe
        src={url}
        className="aspect-video w-full max-w-[80ch] border-0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return <video src={url} controls className="w-full max-w-[80ch] bg-black" />;
}
