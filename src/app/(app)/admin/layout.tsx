import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * The real authorization boundary for everything under /admin — proxy.ts
 * only checks "is someone logged in," not role, on purpose (see its
 * comment). This is a Server Component, so it has full, unrestricted access
 * to `auth()`/Prisma; every /admin/* page inherits this check for free
 * instead of repeating it.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/dashboard");

  return <>{children}</>;
}
