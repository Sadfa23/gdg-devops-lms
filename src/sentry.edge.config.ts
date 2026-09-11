import * as Sentry from "@sentry/nextjs";

// Covers proxy.ts (Edge runtime) — kept separate from sentry.server.config.ts
// since the Edge runtime can't use every Node API the Node config might rely on.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.2,
});
