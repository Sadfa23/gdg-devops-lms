import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getContinueLesson, getDashboardMetrics, getModuleProgress, getRecentActivity } from "@/features/dashboard/data";
import { PageHeader } from "@/components/shell/PageHeader";
import { WelcomeToast } from "@/components/WelcomeToast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [metrics, moduleProgress, continueLesson, activity] = await Promise.all([
    getDashboardMetrics(userId),
    getModuleProgress(userId),
    getContinueLesson(userId),
    getRecentActivity(userId),
  ]);

  const METRICS = [
    { label: "Total XP", value: metrics.xpTotal, color: "var(--g-blue)" },
    { label: "Cohort rank", value: metrics.rank ? `#${metrics.rank}` : "—", color: "var(--g-red)" },
    { label: "Labs passed", value: `${metrics.labsPassed}/${metrics.labsTotal}`, color: "var(--g-yellow)" },
    { label: "Quiz average", value: `${metrics.quizAveragePercent}%`, color: "var(--g-green)" },
  ];

  return (
    <div>
      <Suspense fallback={null}>
        <WelcomeToast />
      </Suspense>
      <PageHeader crumb="Home" title="Dashboard" />

      <div className="mb-6 grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
        {METRICS.map((m) => (
          <Card key={m.label} className="border-0">
            <div className="h-[3px]" style={{ background: m.color }} />
            <CardContent>
              <p className="text-[24px] font-extrabold tracking-[-0.03em] text-ink">{m.value}</p>
              <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {continueLesson ? "Continue where you stopped" : "Get started"}
            </p>
          </CardHeader>
          <CardContent>
            {continueLesson ? (
              <>
                <CardTitle className="mb-2 text-[24px]">{continueLesson.title}</CardTitle>
                <CardDescription className="mb-5">
                  {continueLesson.module.title} · {continueLesson.code}
                </CardDescription>
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-1.5 flex-1 border border-line bg-elev">
                    <div className="h-full w-0 bg-accent" />
                  </div>
                  <span className="font-mono text-[10px] text-muted">0%</span>
                </div>
                <Link href={`/lessons/${continueLesson.code}`}>
                  <Button>Start lesson →</Button>
                </Link>
              </>
            ) : (
              <CardDescription>No published lessons yet — check back once your track lead publishes one.</CardDescription>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Your track</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {moduleProgress.length === 0 ? (
              <CardDescription>No modules have published lessons yet.</CardDescription>
            ) : (
              moduleProgress.map((m) => (
                <div key={m.id}>
                  <div className="mb-1.5 flex justify-between text-[13px] text-ink">
                    <span>
                      Module {m.number} — {m.title}
                    </span>
                    <span className="font-mono text-[11px] text-muted">
                      {m.done}/{m.total}
                    </span>
                  </div>
                  <div className="h-1 border border-line bg-elev">
                    <div className="h-full bg-accent" style={{ width: `${m.total > 0 ? (m.done / m.total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Recent activity</p>
        </CardHeader>
        <CardContent className="p-0">
          {activity.length === 0 ? (
            <p className="p-4 text-[13px] text-muted">Nothing yet — take a quiz or submit a lab and it&apos;ll show up here.</p>
          ) : (
            <div className="flex flex-col divide-y divide-line">
              {activity.map((item) => (
                <div key={`${item.kind}-${item.id}`} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <span className="mr-2 font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">{item.kind}</span>
                    <span className="text-[13.5px] text-ink">{item.label}</span>
                  </div>
                  <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{item.detail}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
