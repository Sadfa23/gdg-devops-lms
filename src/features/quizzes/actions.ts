"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { questionInputSchema, quizSettingsInputSchema, quizSubmissionSchema, type QuizSubmission } from "./schema";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "admin") throw new Error("Not authorized.");
  return session;
}

export type AddQuestionState = { error?: string } | undefined;

export async function addQuestion(_prevState: AddQuestionState, formData: FormData): Promise<AddQuestionState> {
  await requireAdmin();

  const parsed = questionInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { lessonId, optionA, optionB, optionC, optionD, correctOption, ...rest } = parsed.data;
  const options = [optionA, optionB, optionC, optionD];
  const correctIndex = { A: 0, B: 1, C: 2, D: 3 }[correctOption];

  const position = await db.question.count({ where: { lessonId } });
  await db.question.create({
    data: {
      ...rest,
      lessonId,
      position,
      options: {
        create: options.map((text, i) => ({ text, isCorrect: i === correctIndex, position: i })),
      },
    },
  });

  revalidatePath(`/admin/quizzes/${lessonId}`);
}

export async function deleteQuestion(questionId: string, lessonId: string) {
  await requireAdmin();
  await db.question.delete({ where: { id: questionId } });
  revalidatePath(`/admin/quizzes/${lessonId}`);
}

export type SaveSettingsState = { error?: string } | undefined;

export async function saveQuizSettings(_prevState: SaveSettingsState, formData: FormData): Promise<SaveSettingsState> {
  await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = quizSettingsInputSchema.safeParse({
    ...raw,
    shuffleQuestions: formData.get("shuffleQuestions") === "on",
    shuffleOptions: formData.get("shuffleOptions") === "on",
    showExplanationImmediately: formData.get("showExplanationImmediately") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { lessonId, ...settings } = parsed.data;
  await db.quizSettings.upsert({
    where: { lessonId },
    update: settings,
    create: { lessonId, ...settings },
  });

  revalidatePath(`/admin/quizzes/${lessonId}`);
}

export type CheckAnswerResult = { isCorrect: boolean; correctOptionId: string };

/**
 * The correct option is never sent to the client until this is called —
 * shipping it upfront with the question list would make it visible in
 * devtools/React props before the learner even picks. Called once per
 * question, right when they confirm their pick, purely to drive the reveal
 * UI; `submitQuiz` independently re-checks everything server-side for the
 * real score rather than trusting whatever this returned.
 */
export async function checkAnswer(questionId: string, selectedOptionId: string): Promise<CheckAnswerResult | { error: string }> {
  const session = await auth();
  if (!session) return { error: "Not signed in." };

  const options = await db.option.findMany({ where: { questionId } });
  const correct = options.find((o) => o.isCorrect);
  if (!correct) return { error: "This question has no correct option set." };

  return { isCorrect: correct.id === selectedOptionId, correctOptionId: correct.id };
}

export type SubmitQuizResult = { scorePercent: number; passed: boolean; xpEarned: number; correctCount: number; totalCount: number };

/** Scores a full quiz run in one call — the client holds every answer in
 * state as the learner goes and submits the whole set once, at the end. */
export async function submitQuiz(input: QuizSubmission): Promise<SubmitQuizResult | { error: string }> {
  const session = await auth();
  if (!session) return { error: "Not signed in." };

  const parsed = quizSubmissionSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid submission." };
  const { lessonId, answers } = parsed.data;

  const [settings, questions] = await Promise.all([
    db.quizSettings.findUnique({ where: { lessonId } }),
    db.question.findMany({ where: { lessonId }, include: { options: true } }),
  ]);

  const attemptsAllowed = settings?.attemptsAllowed ?? 0;
  if (attemptsAllowed > 0) {
    const priorAttempts = await db.quizAttempt.count({ where: { userId: session.user.id, lessonId } });
    if (priorAttempts >= attemptsAllowed) {
      return { error: "You've used all your attempts for this quiz." };
    }
  }

  const optionById = new Map(questions.flatMap((q) => q.options.map((o) => [o.id, o] as const)));
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  let earnedPoints = 0;
  let correctCount = 0;

  const responses = answers.map((a) => {
    const question = questions.find((q) => q.id === a.questionId);
    const selected = a.selectedOptionId ? optionById.get(a.selectedOptionId) : null;
    const isCorrect = !!selected?.isCorrect;
    const xpAwarded = isCorrect ? (question?.points ?? 0) : 0;
    if (isCorrect) {
      correctCount += 1;
      earnedPoints += xpAwarded;
    }
    return { questionId: a.questionId, selectedOptionId: a.selectedOptionId, isCorrect, xpAwarded };
  });

  const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = scorePercent >= (settings?.passMarkPercent ?? 70);
  const attemptNumber = (await db.quizAttempt.count({ where: { userId: session.user.id, lessonId } })) + 1;

  await db.quizAttempt.create({
    data: {
      userId: session.user.id,
      lessonId,
      attemptNumber,
      scorePercent,
      passed,
      submittedAt: new Date(),
      responses: { create: responses },
    },
  });

  revalidatePath("/leaderboard");
  revalidatePath("/profile");

  return { scorePercent, passed, xpEarned: earnedPoints, correctCount, totalCount: questions.length };
}
