import { notFound } from "next/navigation";
import Link from "next/link";
import { getLessonForEdit, listModulesForSelect } from "@/features/lessons/data";
import { PageHeader } from "@/components/shell/PageHeader";
import { BasicsForm } from "@/features/lessons/components/BasicsForm";
import { RecordingForm } from "@/features/lessons/components/RecordingForm";
import { ChapterList } from "@/features/lessons/components/ChapterForm";
import { TakeawayList } from "@/features/lessons/components/TakeawayForm";
import { ReleaseForm } from "@/features/lessons/components/ReleaseForm";
import { PublishChecklist } from "@/features/lessons/components/PublishChecklist";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

function SectionHeading({ n, title }: { n: string; title: string }) {
  return (
    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
      {n} · {title}
    </p>
  );
}

export default async function EditLessonPage({ params }: PageProps<"/admin/lessons/[id]/edit">) {
  const { id } = await params;
  const [lesson, modules] = await Promise.all([getLessonForEdit(id), listModulesForSelect()]);
  if (!lesson) notFound();

  return (
    <div>
      <PageHeader crumb={`Track lead · ${lesson.code}`} title={lesson.title} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-10">
          <section>
            <SectionHeading n="01" title="The basics" />
            <BasicsForm
              lessonId={lesson.id}
              modules={modules}
              initial={{ moduleId: lesson.moduleId, code: lesson.code, title: lesson.title, summary: lesson.summary }}
            />
          </section>

          <section>
            <SectionHeading n="02 / 05" title="Recording & code walkthrough" />
            <RecordingForm
              lessonId={lesson.id}
              cloudName={env.CLOUDINARY_CLOUD_NAME}
              apiKey={env.CLOUDINARY_API_KEY}
              initial={{
                bunnyVideoId: lesson.bunnyVideoId,
                videoPublicId: lesson.videoPublicId,
                posterPublicId: lesson.posterPublicId,
                captionsPublicId: lesson.captionsPublicId,
                transcript: lesson.transcript,
              }}
            />
          </section>

          <section>
            <SectionHeading n="03" title="Chapters" />
            <ChapterList chapters={lesson.chapters} lessonId={lesson.id} />
          </section>

          <section>
            <SectionHeading n="04" title="Key takeaways" />
            <TakeawayList takeaways={lesson.takeaways} lessonId={lesson.id} />
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <ReleaseForm
            lessonId={lesson.id}
            initial={{ visibility: lesson.visibility, xp: lesson.xp, level: lesson.level, scheduledFor: lesson.scheduledFor }}
          />

          <div className="border border-line bg-surface p-5">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Attached assessment</p>
            <p className="mb-4 text-[13px] text-ink">
              {lesson._count.questions} question{lesson._count.questions === 1 ? "" : "s"} · {lesson.code}
            </p>
            <Link href={`/admin/quizzes/${lesson.id}`}>
              <Button variant="secondary" size="sm">
                Author questions →
              </Button>
            </Link>
          </div>

          <PublishChecklist lesson={lesson} questionCount={lesson._count.questions} />
        </div>
      </div>
    </div>
  );
}
