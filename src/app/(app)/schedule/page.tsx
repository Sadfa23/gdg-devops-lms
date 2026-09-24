import { SessionCalendar } from "@/features/schedule/SessionCalendar";
import { ScheduleLegend } from "@/features/schedule/ScheduleLegend";

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-[1180px]">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b-2 border-line-strong pb-5">
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-ink">GDG on Campus · JKUAT</div>
          <h1 className="text-[clamp(30px,4vw,44px)] font-extrabold tracking-[-0.03em] text-ink">DevOps Track — Sep 2026 to Mar 2027</h1>
        </div>
        <ScheduleLegend />
      </header>

      <SessionCalendar />
    </div>
  );
}
