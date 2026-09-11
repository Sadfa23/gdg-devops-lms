import { listModulesForSelect } from "@/features/lessons/data";
import { LessonForm } from "@/features/lessons/components/LessonForm";
import { PageHeader } from "@/components/shell/PageHeader";

export default async function NewLessonPage() {
  const modules = await listModulesForSelect();

  return (
    <div>
      <PageHeader crumb="Track lead · Content" title="09 · Create a lesson" />

      {modules.length === 0 ? (
        <p className="text-[13px] text-muted">No modules exist yet — seed at least one Module row before creating a lesson.</p>
      ) : (
        <LessonForm modules={modules} />
      )}
    </div>
  );
}
