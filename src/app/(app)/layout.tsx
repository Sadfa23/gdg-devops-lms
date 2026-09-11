import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/shell/AppSidebar";
import { initialsOf } from "@/lib/initials";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex min-h-screen">
      <AppSidebar
        isAdmin={isAdmin}
        userName={user?.name ?? ""}
        userInitials={user?.name ? initialsOf(user.name) : ""}
        userRoleLabel={isAdmin ? "Track lead" : "Learner"}
      />
      <main className="min-w-0 flex-1 px-8 py-7">{children}</main>
    </div>
  );
}
