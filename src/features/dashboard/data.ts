import { db } from "@/lib/db";
import { getLeaderboard } from "@/features/leaderboard/data";

export async function getDashboardMetrics(userId: string) {
  const leaderboard = await getLeaderboard();
  const row = leaderboard.find((r) => r.id === userId);
  const rank = row ? leaderboard.indexOf(row) + 1 : null;

  return {
    xpTotal: row?.xpTotal ?? 0,
    rank,
    labsPassed: row?.labsPassed ?? 0,
    labsTotal: row?.labsTotal ?? 0,
    quizAveragePercent: row?.quizAveragePercent ?? 0,
  };
}

/**
 * Per module: how many of its LIVE lessons this user has marked done. There's
 * no "mark lesson complete" action built yet, so every LessonProgress query
 * here correctly returns empty — this shows real 0/N bars, not placeholder
 * numbers, until that write path exists.
 */
export async function getModuleProgress(userId: string) {
  const modules = await db.module.findMany({
    include: { lessons: { where: { visibility: "live" } } },
    orderBy: { position: "asc" },
  });

  const progress = await db.lessonProgress.findMany({
    where: { userId, state: "done", lesson: { visibility: "live" } },
    select: { lessonId: true },
  });
  const doneLessonIds = new Set(progress.map((p) => p.lessonId));

  return modules
    .filter((m) => m.lessons.length > 0)
    .map((m) => {
      const done = m.lessons.filter((l) => doneLessonIds.has(l.id)).length;
      return { id: m.id, title: m.title, number: m.number, done, total: m.lessons.length };
    });
}

/** The lesson to resume — or, honestly, to start, since nothing's been
 * watched yet without a completion write path. First live lesson (by module
 * then lesson order) the user hasn't finished. */
export async function getContinueLesson(userId: string) {
  const progress = await db.lessonProgress.findMany({ where: { userId, state: "done" }, select: { lessonId: true } });
  const doneLessonIds = new Set(progress.map((p) => p.lessonId));

  const lessons = await db.lesson.findMany({
    where: { visibility: "live" },
    include: { module: true },
    orderBy: [{ module: { position: "asc" } }, { position: "asc" }],
  });

  return lessons.find((l) => !doneLessonIds.has(l.id)) ?? null;
}

export type ActivityItem =
  | { kind: "quiz"; id: string; label: string; detail: string; at: Date }
  | { kind: "lab"; id: string; label: string; detail: string; at: Date };

export async function getRecentActivity(userId: string, limit = 5): Promise<ActivityItem[]> {
  const [attempts, submissions] = await Promise.all([
    db.quizAttempt.findMany({ where: { userId, submittedAt: { not: null } }, include: { lesson: true }, orderBy: { submittedAt: "desc" }, take: limit }),
    db.labSubmission.findMany({ where: { userId }, include: { lab: true }, orderBy: { submittedAt: "desc" }, take: limit }),
  ]);

  const items: ActivityItem[] = [
    ...attempts.map((a) => ({
      kind: "quiz" as const,
      id: a.id,
      label: a.lesson.title,
      detail: `${a.scorePercent}% · ${a.passed ? "Passed" : "Below mark"}`,
      at: a.submittedAt!,
    })),
    ...submissions.map((s) => ({
      kind: "lab" as const,
      id: s.id,
      label: s.lab.title,
      detail: s.state.replace("_", " "),
      at: s.submittedAt,
    })),
  ];

  return items.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, limit);
}
