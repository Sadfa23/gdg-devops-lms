"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { toast } from "sonner";
import { Bold, Code2, Heading2, Link2, MessageSquareQuote, Waypoints } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CloudinaryUploadButton } from "@/components/CloudinaryUploadButton";
import { BunnyUploadButton } from "@/components/BunnyUploadButton";
import { cloudinaryImageUrl } from "@/lib/cloudinary";
import { bunnyEmbedUrl } from "@/lib/bunny";
import { countWords, estimateReadingTime } from "@/lib/reading-time";
import { updatePostContent } from "../actions";
import { MarkdownPreview } from "./MarkdownPreview";

type MarkdownEditorProps = {
  postId: string;
  initialContent: string;
  cloudName: string;
  apiKey: string;
  bunnyLibraryId: string;
};
type Pane = "editor" | "split" | "preview";

const SAVE_DEBOUNCE_MS = 1200;

/**
 * The compose surface: one continuous Markdown document, a toolbar that
 * inserts snippets at the current caret position (never at the end of the
 * document), and a live preview. Caret-position insertion is the deliberate
 * fix for "an uploaded image lands at the bottom instead of where I put the
 * cursor" — every toolbar action, including the upload buttons, calls the
 * same `insertAtCaret`, so an image lands exactly where it was requested.
 */
export function MarkdownEditor({ postId, initialContent, cloudName, apiKey, bunnyLibraryId }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [pane, setPane] = useState<Pane>("split");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextSave = useRef(true);
  const [, startTransition] = useTransition();

  function save(next: string) {
    setSaveState("saving");
    startTransition(async () => {
      try {
        await updatePostContent({ postId, content: next });
        setSaveState("saved");
      } catch {
        toast.error("Couldn't save your changes.");
        setSaveState("idle");
      }
    });
  }

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(content), SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // save() intentionally excluded — it's stable enough for this effect's purpose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  function flushSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    save(content);
  }

  // Uses the functional setState form deliberately — two toolbar clicks (or
  // an upload finishing) fired back-to-back, before React re-renders between
  // them, would otherwise both close over the same stale `content` and the
  // second call would silently clobber the first's insertion.
  function insertAtCaret(snippet: string, caretOffset?: number) {
    const el = textareaRef.current;
    const pos = el ? el.selectionStart : null;
    setContent((prev) => {
      const insertPos = pos ?? prev.length;
      pendingCaret.current = insertPos + (caretOffset ?? snippet.length);
      return prev.slice(0, insertPos) + snippet + prev.slice(insertPos);
    });
    requestAnimationFrame(() => {
      if (el && pendingCaret.current != null) {
        el.focus();
        try {
          el.setSelectionRange(pendingCaret.current, pendingCaret.current);
        } catch {
          // ignore — element may have unmounted
        }
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={pane} onValueChange={(v) => setPane(v as Pane)}>
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="split">Split</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
          {countWords(content)} words · {estimateReadingTime(content)} min read ·{" "}
          {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Autosaves as you write"}
        </p>
      </div>

      <div className={pane === "split" ? "grid grid-cols-1 gap-4 lg:grid-cols-2" : "grid grid-cols-1"}>
        {pane !== "preview" && (
          <div className="flex flex-col border border-line bg-surface">
            <div className="flex flex-wrap items-center gap-1.5 border-b border-line bg-elev px-3 py-2">
              <ToolbarButton label="H2" onClick={() => insertAtCaret("\n## Heading\n")}>
                <Heading2 size={14} />
              </ToolbarButton>
              <ToolbarButton label="Bold" onClick={() => insertAtCaret("**bold**", 2)}>
                <Bold size={14} />
              </ToolbarButton>
              <ToolbarButton label="Code" onClick={() => insertAtCaret("\n```bash\ncommand\n```\n", 9)}>
                <Code2 size={14} />
              </ToolbarButton>
              <ToolbarButton label="Link" onClick={() => insertAtCaret("[text](url)", 1)}>
                <Link2 size={14} />
              </ToolbarButton>
              <ToolbarButton label="Callout" onClick={() => insertAtCaret("\n> **Note**\n> ")}>
                <MessageSquareQuote size={14} />
              </ToolbarButton>
              <ToolbarButton
                label="Diagram"
                onClick={() => insertAtCaret("\n```mermaid\nflowchart LR\n  A[Client] --> B(Service)\n```\n")}
              >
                <Waypoints size={14} />
              </ToolbarButton>
              <span className="mx-1 h-4.5 w-px bg-line" />
              <CloudinaryUploadButton
                cloudName={cloudName}
                apiKey={apiKey}
                resourceType="image"
                folder="blog"
                label="Image"
                className="h-7 gap-1.5 border border-line-strong bg-surface px-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink hover:bg-elev"
                onUploaded={(publicId) => insertAtCaret(`\n![Image](${cloudinaryImageUrl(cloudName, publicId)})\n`)}
              />
              <BunnyUploadButton
                label="Video"
                className="h-7 gap-1.5 border border-line-strong bg-surface px-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink hover:bg-elev"
                onUploaded={(videoId) => insertAtCaret(`\n\`\`\`video\n${bunnyEmbedUrl(bunnyLibraryId, videoId)}\n\`\`\`\n`)}
              />
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={flushSave}
              spellCheck={false}
              placeholder={"Write in Markdown — ## for headings, ![alt](url) for images, ```lang for code…"}
              className="min-h-[560px] flex-1 resize-y border-none bg-transparent p-4 font-mono text-[13.5px] leading-[1.7] text-ink outline-none"
            />
          </div>
        )}

        {pane !== "editor" && (
          <div className="flex flex-col border border-line bg-bg">
            <div className="border-b border-line bg-elev px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Live preview
            </div>
            <div className="max-h-[calc(100vh-260px)] min-h-[560px] overflow-y-auto p-6">
              <MarkdownPreview content={content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="flex h-7 items-center gap-1.5 border border-line-strong bg-surface px-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink hover:bg-elev"
    >
      {children}
      {label}
    </button>
  );
}
