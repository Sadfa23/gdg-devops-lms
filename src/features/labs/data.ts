import { db } from "@/lib/db";

export function listLabsForSelect() {
  return db.lab.findMany({ orderBy: { code: "asc" } });
}

export function listSubmissionsForUser(userId: string) {
  return db.labSubmission.findMany({
    where: { userId },
    include: { lab: true },
    orderBy: { submittedAt: "desc" },
  });
}

// --- Admin / grading ---

export function listAllSubmissionsForAdmin() {
  return db.labSubmission.findMany({
    include: { lab: true, user: true },
    orderBy: { submittedAt: "desc" },
  });
}
