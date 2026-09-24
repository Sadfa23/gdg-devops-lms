"use client";

import { useEffect, useRef } from "react";
import schedule from "./sessions.json";

type CalendarElement = HTMLElement & { data: unknown; select(date: string): void };

/** Wraps the <devops-calendar> web component. It uses `customElements`, so it
 * can only be registered in the browser — hence the dynamic import inside the
 * effect. The selected date is mirrored to `?date=YYYY-MM-DD` so members can
 * share a link straight to a session. */
export function SessionCalendar() {
  const ref = useRef<CalendarElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const onSelect = (e: Event) => {
      const { date } = (e as CustomEvent<{ date: string }>).detail;
      const url = new URL(window.location.href);
      url.searchParams.set("date", date);
      window.history.replaceState(null, "", url);
    };

    import("@/components/devops-calendar/devops-calendar.js").then(() => {
      if (cancelled) return;
      // The component sorts and annotates the array it's given, so hand it a copy.
      el.data = structuredClone(schedule);
      const requested = new URLSearchParams(window.location.search).get("date");
      if (requested && /^\d{4}-\d{2}-\d{2}$/.test(requested)) el.select(requested);
      el.addEventListener("session-select", onSelect);
    });

    return () => {
      cancelled = true;
      el.removeEventListener("session-select", onSelect);
    };
  }, []);

  return <devops-calendar ref={ref} />;
}
