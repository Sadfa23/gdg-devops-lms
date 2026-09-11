import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Node's default DNS ordering can return an IPv6 address first even on
    // networks where IPv6 is broken or unreachable, causing `fetch()` to hang
    // until timeout before falling back to IPv4 — intermittently, since it
    // depends on which address a given lookup returns. Reproduced directly:
    // ~1 in 3 plain fetches to github.com timed out with default ordering,
    // 0 in 3 with this set. This is what caused Auth.js's OAuth token-exchange
    // fetch (server-side, during /api/auth/callback/*) to fail unpredictably
    // with "TypeError: fetch failed", surfaced to users as error=Configuration
    // — even though the browser's own redirect to the provider worked fine,
    // since browser and Node DNS resolution take different paths.
    const { setDefaultResultOrder } = await import("node:dns");
    setDefaultResultOrder("ipv4first");

    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
