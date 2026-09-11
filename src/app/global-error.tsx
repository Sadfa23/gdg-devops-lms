"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Only triggers when the root layout itself throws — anything below it is
 * caught by ordinary error.tsx boundaries instead. Has to render its own
 * <html>/<body> since it replaces the whole document; kept deliberately
 * plain (no fonts, no ThemeProvider) since those live in the layout that
 * just failed.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111111", color: "#ffffff", fontFamily: "monospace" }}>
        <div style={{ textAlign: "center", padding: "24px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: "12px" }}>
            Something broke
          </p>
          <p style={{ fontSize: "15px", marginBottom: "20px" }}>The page hit an unexpected error. It&apos;s been reported.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: "#ec3013", color: "#fff", border: "none", padding: "10px 18px", fontFamily: "monospace", fontSize: "12px", cursor: "pointer" }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
