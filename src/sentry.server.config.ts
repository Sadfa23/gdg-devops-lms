import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // A modest sample in production keeps this well inside the free tier's
  // span quota — full traces in dev, where volume is naturally tiny.
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.2,
});
