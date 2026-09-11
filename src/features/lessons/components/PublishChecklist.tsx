import { cn } from "@/lib/utils";

type PublishChecklistProps = {
  lesson: {
    title: string;
    moduleId: string;
    bunnyVideoId: string | null;
    videoPublicId: string | null;
    chapters: unknown[];
    takeaways: unknown[];
  };
  questionCount: number;
};

/**
 * Computed fresh from the lesson's current state on every render — since
 * this is a multi-section page rather than one client-side form, "live" here
 * means it reflects reality the moment any section is saved and the page
 * revalidates, not that it recomputes on every keystroke.
 */
export function PublishChecklist({ lesson, questionCount }: PublishChecklistProps) {
  const items = [
    { label: "Title and module set", done: !!lesson.title && !!lesson.moduleId },
    { label: "Video source attached", done: !!lesson.bunnyVideoId || !!lesson.videoPublicId, warn: true },
    { label: "At least three chapters", done: lesson.chapters.length >= 3, warn: true },
    { label: "Takeaways written", done: lesson.takeaways.length >= 3, warn: true },
    { label: "Quiz attached", done: questionCount > 0, warn: true },
  ];

  return (
    <div className="border border-line bg-surface p-5">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Before publish</p>
      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <span
              className={cn("h-3.5 w-3.5 border", item.done ? "border-g-green bg-g-green" : item.warn ? "border-g-yellow bg-g-yellow" : "border-line")}
            />
            <span className="text-[13px] text-ink">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
