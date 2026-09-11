import { db } from "@/lib/db";

export type LeaderboardRow = {
  id: string;
  name: string;
  focusArea: string | null;
  accent: string;
  xpTotal: number;
  labsPassed: number;
  labsTotal: number;
  quizAveragePercent: number;
};

/**
 * XP/rank/quiz-average are all derived here, not stored columns (see
 * schema.prisma's note on this) — fine at club scale (dozens to low
 * hundreds of members); revisit only if this query ever shows up slow.
 */
export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  const users = await db.user.findMany({
    where: { status: { not: "suspended" } },
    include: {
      quizAttempts: { where: { submittedAt: { not: null } }, include: { responses: true } },
      labSubmissions: true,
    },
  });

  const rows = users.map((u) => {
    const xpTotal = u.quizAttempts.flatMap((a) => a.responses).reduce((sum, r) => sum + r.xpAwarded, 0);
    const labsPassed = u.labSubmissions.filter((s) => s.state === "passed").length;
    const quizAveragePercent =
      u.quizAttempts.length > 0
        ? Math.round(u.quizAttempts.reduce((sum, a) => sum + (a.scorePercent ?? 0), 0) / u.quizAttempts.length)
        : 0;

    return {
      id: u.id,
      name: u.name,
      focusArea: u.focusArea,
      accent: u.accent,
      xpTotal,
      labsPassed,
      labsTotal: u.labSubmissions.length,
      quizAveragePercent,
    };
  });

  return rows.sort((a, b) => b.xpTotal - a.xpTotal);
}
