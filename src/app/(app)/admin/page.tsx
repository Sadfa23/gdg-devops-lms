import Link from "next/link";
import { PageHeader } from "@/components/shell/PageHeader";
import { cn } from "@/lib/utils";

const CREATE_CARDS = [
  {
    n: "01",
    color: "var(--g-blue)",
    title: "A video lesson",
    body: "Recording, chapters, takeaways and the code walkthrough — in one form.",
    cta: "OPEN LESSON BUILDER",
    href: "/admin/lessons/new",
  },
  {
    n: "02",
    color: "var(--g-yellow)",
    title: "Quiz questions",
    body: "Author questions per lesson, mark the answer, write the explanation learners see.",
    cta: "OPEN QUIZ BUILDER",
    href: "/admin/quizzes",
  },
  {
    n: "03",
    color: "var(--g-green)",
    title: "A blog post",
    body: "Block editor with code, figures, diagrams and clips, then publish to the cohort.",
    cta: "OPEN POST EDITOR",
    href: "/admin/posts/new",
  },
];

export default function AdminHomePage() {
  return (
    <div>
      <PageHeader crumb="Track lead" title="Admin panel" />

      <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-3">
        {CREATE_CARDS.map((card) => (
          <Link
            key={card.n}
            href={card.href}
            className={cn("flex flex-col bg-surface p-6 no-underline hover:bg-elev")}
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{card.n} · Create</span>
              <span className="h-2 w-2" style={{ background: card.color }} />
            </div>
            <p className="mb-2.5 text-[18px] font-extrabold text-ink">{card.title}</p>
            <p className="mb-5 text-[13.5px] text-muted">{card.body}</p>
            <span className="mt-auto font-mono text-[10px] uppercase tracking-[0.12em] text-accent-ink">{card.cta} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
