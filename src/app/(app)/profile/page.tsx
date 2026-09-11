import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getProfileMetrics } from "@/features/profile/data";
import { listAttemptsForUser, listResponsesForUser } from "@/features/quizzes/data";
import { listSubmissionsForUser } from "@/features/labs/data";
import { PageHeader } from "@/components/shell/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialsOf } from "@/lib/initials";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session!.user.id;

  const [user, metrics, responses, attempts, submissions] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    getProfileMetrics(userId),
    listResponsesForUser(userId),
    listAttemptsForUser(userId),
    listSubmissionsForUser(userId),
  ]);
  if (!user) return null;

  return (
    <div>
      <PageHeader crumb="You" title="Profile" />

      <div className="mb-8 grid grid-cols-1 gap-px bg-line md:grid-cols-2">
        <div className="flex items-center gap-4 bg-surface p-6">
          <span className="grid h-16 w-16 shrink-0 place-items-center bg-g-red text-[22px] font-extrabold text-white">
            {initialsOf(user.name)}
          </span>
          <div>
            <p className="text-[26px] font-extrabold tracking-[-0.03em] text-ink">{user.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              DevOps Track · {user.role === "admin" ? "Track lead" : "Learner"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-line">
          {[
            { label: "Total XP", value: metrics.xpTotal },
            { label: "Cohort rank", value: metrics.rank ? `#${metrics.rank}` : "—" },
            { label: "Questions attempted", value: metrics.questionsAttempted },
            { label: "Answer accuracy", value: `${metrics.accuracyPercent}%` },
          ].map((m) => (
            <div key={m.label} className="bg-surface p-5">
              <p className="text-[24px] font-extrabold tracking-[-0.03em] text-ink">{m.value}</p>
              <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="attempts">
        <TabsList>
          <TabsTrigger value="attempts">Attempts</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="labs">Labs</TabsTrigger>
        </TabsList>

        <TabsContent value="attempts">
          {responses.length === 0 ? (
            <p className="text-[13px] text-muted">No attempts yet.</p>
          ) : (
            <div className="flex flex-col gap-px bg-line">
              {responses.map((r) => (
                <div key={r.id} className="grid grid-cols-[1fr_100px_80px] items-center gap-4 bg-surface px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] text-ink">{r.question.prompt}</p>
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">
                      {r.question.topic ?? r.quizAttempt.lesson.code}
                    </p>
                  </div>
                  <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${r.isCorrect ? "text-g-green" : "text-accent-ink"}`}>
                    {r.isCorrect ? "Correct" : "Missed"}
                  </span>
                  <span className="text-right font-mono text-[12px] text-ink">+{r.xpAwarded} XP</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="quizzes">
          {attempts.length === 0 ? (
            <p className="text-[13px] text-muted">No quiz attempts yet.</p>
          ) : (
            <div className="flex flex-col gap-px bg-line">
              {attempts.map((a) => (
                <div key={a.id} className="grid grid-cols-[1fr_80px_100px] items-center gap-4 bg-surface px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] text-ink">{a.lesson.title}</p>
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">Attempt {a.attemptNumber}</p>
                  </div>
                  <span className="font-mono text-[13px] text-ink">{a.scorePercent}%</span>
                  <span className={`text-right font-mono text-[10px] uppercase tracking-[0.1em] ${a.passed ? "text-g-green" : "text-accent-ink"}`}>
                    {a.passed ? "Passed" : "Below mark"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="labs">
          {submissions.length === 0 ? (
            <p className="text-[13px] text-muted">No lab submissions yet.</p>
          ) : (
            <div className="flex flex-col gap-px bg-line">
              {submissions.map((s) => (
                <div key={s.id} className="grid grid-cols-[80px_1fr_80px] items-center gap-4 bg-surface px-4 py-3">
                  <span className="font-mono text-[11px] text-muted">{s.lab.code}</span>
                  <span className="truncate text-[14px] text-ink">{s.lab.title}</span>
                  <span className="text-right font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{s.state.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
