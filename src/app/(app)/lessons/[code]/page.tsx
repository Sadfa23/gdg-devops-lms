import { notFound } from "next/navigation";
import Link from "next/link";
import { getLessonByCode } from "@/features/lessons/data";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shell/PageHeader";
import { Button } from "@/components/ui/button";
import { cloudinaryImageUrl, cloudinaryVideoUrl } from "@/lib/cloudinary";
import { bunnyEmbedUrl } from "@/lib/bunny";
import { formatMmSs } from "@/lib/time";
import { env } from "@/lib/env";

export default async function LessonPlayerPage({ params }: PageProps<"/lessons/[code]">) {
  const { code } = await params;
  const lesson = await getLessonByCode(code);
  if (!lesson || lesson.visibility !== "live") notFound();

  const questionCount = await db.question.count({ where: { lessonId: lesson.id } });

  return (
    <div className="mx-auto max-w-[860px]">
      <PageHeader crumb={`${lesson.module.title} · ${lesson.code}`} title={lesson.title} />

      <div className="mb-6 flex aspect-video items-center justify-center border border-line bg-[#0c0c0c]">
        {lesson.bunnyVideoId ? (
          <iframe
            src={bunnyEmbedUrl(env.BUNNY_STREAM_LIBRARY_ID, lesson.bunnyVideoId)}
            className="h-full w-full"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : lesson.videoPublicId ? (
          <video
            src={cloudinaryVideoUrl(env.CLOUDINARY_CLOUD_NAME, lesson.videoPublicId)}
            controls
            className="h-full w-full"
            poster={lesson.posterPublicId ? cloudinaryImageUrl(env.CLOUDINARY_CLOUD_NAME, lesson.posterPublicId) : undefined}
          />
        ) : (
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">No video source attached yet</p>
        )}
      </div>

      {lesson.summary && <p className="mb-6 text-[15px] leading-[1.6] text-ink">{lesson.summary}</p>}

      {questionCount > 0 && (
        <Link href={`/quiz/${lesson.code}`} className="mb-8 inline-block">
          <Button>Take the quiz ({questionCount} questions) →</Button>
        </Link>
      )}

      {lesson.chapters.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Chapters</p>
          <div className="flex flex-col gap-px bg-line">
            {lesson.chapters.map((c) => (
              <div key={c.id} className="flex items-center gap-4 bg-surface px-4 py-2.5">
                <span className="font-mono text-[11px] text-muted">{formatMmSs(c.timecodeSeconds)}</span>
                <span className="text-[13.5px] text-ink">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {lesson.takeaways.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Key takeaways</p>
          <div className="flex flex-col gap-3">
            {lesson.takeaways.map((t) => (
              <div key={t.id} className="flex gap-3">
                <span className="mt-0.5 shrink-0 border border-line-strong px-1.5 py-0.5 font-mono text-[10px] text-muted">{t.code}</span>
                <p className="text-[14px] leading-[1.5] text-ink">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {lesson.transcript && (
        <div className="border border-line bg-surface">
          <p className="border-b border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Terminal</p>
          <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-3.5 font-mono text-[12.5px] leading-[1.7] text-ink">{lesson.transcript}</pre>
        </div>
      )}
    </div>
  );
}
