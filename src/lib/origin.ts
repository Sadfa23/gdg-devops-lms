import { headers } from "next/headers";

/**
 * Same "trust the host" call as Auth.js's trustHost in src/lib/auth.ts —
 * there's no single fixed domain to hardcode (localhost in dev, Vercel's
 * dynamic domain in production), so this reads it from the incoming request
 * instead of a env var that would need updating per deploy.
 */
export async function originUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : (h.get("x-forwarded-proto") ?? "https");
  return `${proto}://${host}`;
}
