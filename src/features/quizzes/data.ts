import { db } from "@/lib/db";

/** Lessons with at least a quiz shell — the pool the quiz index/picker draws from. */
export function listQuizzableLessons() {
  return db.lesson.findMany({
    where: { questions: { some: {} } },
    include: { module: true, _count: { select: { questions: true } } },
    orderBy: [{ module: { position: "asc" } }, { position: "asc" }],
  });
}

export function getQuizForLesson(code: string) {
  return db.lesson.findUnique({
    where: { code },
    include: {
      quizSettings: true,
      questions: { orderBy: { position: "asc" }, include: { options: { orderBy: { position: "asc" } } } },
    },
  });
}

export function countAttempts(userId: string, lessonId: string) {
  return db.quizAttempt.count({ where: { userId, lessonId } });
}

export function listAttemptsForUser(userId: string) {
  return db.quizAttempt.findMany({
    where: { userId, submittedAt: { not: null } },
    include: { lesson: true },
    orderBy: { submittedAt: "desc" },
  });
}

export function listResponsesForUser(userId: string) {
  return db.questionResponse.findMany({
    where: { quizAttempt: { userId } },
    include: { question: true, selectedOption: true, quizAttempt: { include: { lesson: true } } },
    orderBy: { answeredAt: "desc" },
  });
}

// --- Admin / quiz builder ---

export function listLessonsWithQuestionCounts() {
  return db.lesson.findMany({
    include: { _count: { select: { questions: true } } },
    orderBy: { code: "asc" },
  });
}

export function getLessonQuizForEdit(lessonId: string) {
  return db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      quizSettings: true,
      questions: { orderBy: { position: "asc" }, include: { options: { orderBy: { position: "asc" } } } },
    },
  });
}
