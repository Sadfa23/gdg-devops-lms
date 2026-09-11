import { db } from "@/lib/db";
import { getLeaderboard } from "@/features/leaderboard/data";

export async function getProfileMetrics(userId: string) {
  const [responses, leaderboard] = await Promise.all([
    db.questionResponse.count({ where: { quizAttempt: { userId } } }),
    getLeaderboard(),
  ]);
  const correct = await db.questionResponse.count({ where: { quizAttempt: { userId }, isCorrect: true } });
  const rank = leaderboard.findIndex((r) => r.id === userId) + 1;
  const xpTotal = leaderboard.find((r) => r.id === userId)?.xpTotal ?? 0;
  const accuracyPercent = responses > 0 ? Math.round((correct / responses) * 100) : 0;

  return { xpTotal, rank: rank || null, questionsAttempted: responses, accuracyPercent };
}
