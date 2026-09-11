import { codeToHtml } from "shiki";

type CodeBlockProps = { code: string; lang?: string };

/**
 * Server Component — Shiki runs at render time, no client bundle cost.
 * Always renders in a fixed dark theme regardless of the site's light/dark
 * mode, same precedent as Topograph's code editor: code surfaces stay dark
 * even inside an otherwise light UI.
 *
 * For a CODE block, `meta` on the underlying Block doubles as the language
 * hint (e.g. "hcl", "yaml", "bash") — there's no separate language field in
 * the block model. Falls back to plain text if Shiki doesn't recognize it.
 */
export async function CodeBlock({ code, lang }: CodeBlockProps) {
  let html: string;
  try {
    html = await codeToHtml(code, { lang: lang || "bash", theme: "github-dark-default" });
  } catch {
    html = await codeToHtml(code, { lang: "text", theme: "github-dark-default" });
  }

  return (
    <div
      className="[&_pre]:overflow-x-auto [&_pre]:p-5 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-[1.7]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
