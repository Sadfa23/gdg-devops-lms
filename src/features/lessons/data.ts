import { db } from "@/lib/db";

/** Read path — called directly from Server Components, no API route needed. */
export function listLessons() {
  return db.lesson.findMany({
    include: { module: true },
    orderBy: [{ module: { position: "asc" } }, { position: "asc" }],
  });
}

export function listModulesForSelect() {
  return db.module.findMany({ orderBy: { position: "asc" } });
}

export function getLessonByCode(code: string) {
  return db.lesson.findUnique({
    where: { code },
    include: { module: true, chapters: { orderBy: { position: "asc" } }, takeaways: { orderBy: { position: "asc" } } },
  });
}

// --- Admin / lesson builder ---

export function listLessonsForAdmin() {
  return db.lesson.findMany({
    include: { module: true },
    orderBy: [{ module: { position: "asc" } }, { position: "asc" }],
  });
}

export function getLessonForEdit(id: string) {
  return db.lesson.findUnique({
    where: { id },
    include: {
      module: true,
      chapters: { orderBy: { position: "asc" } },
      takeaways: { orderBy: { position: "asc" } },
      _count: { select: { questions: true } },
    },
  });
}
