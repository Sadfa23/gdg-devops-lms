import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Trivial DB round-trip. Meant to be hit by an external scheduler every few
 * minutes so Neon's compute doesn't scale to zero — see the
 * devops_cloud_lms_neon_p1001 note: cold-start wake-up (10-15s) after idle is
 * what makes sign-in/dashboard loads feel hung, not a bug in the app itself.
 */
export async function GET() {
  await db.$queryRaw`SELECT 1`;
  return NextResponse.json({ ok: true });
}
