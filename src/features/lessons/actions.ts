"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseMmSs } from "@/lib/time";
import { chapterInputSchema, lessonInputSchema, lessonReleaseSchema, lessonRecordingSchema, takeawayInputSchema } from "./schema";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "admin") throw new Error("Not authorized.");
  return session;
}

export type CreateLessonState = { error?: string } | undefined;

/**
 * The template every other feature's mutations should copy: re-validate with
 * the same schema the form used (never trust the client copy alone), check
 * authorization against the *current* session — not just the proxy's
 * optimistic pass, then mutate and revalidate.
 *
 * Creates just the basics and redirects into the full builder — the same
 * create-then-edit shape the blog post editor already uses, needed here for
 * the same reason: chapters/takeaways are child rows that need a real
 * lessonId to attach to.
 */
export async function createLesson(_prevState: CreateLessonState, formData: FormData): Promise<CreateLessonState> {
  const session = await requireAdmin();

  const parsed = lessonInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const position = await db.lesson.count({ where: { moduleId: parsed.data.moduleId } });

  const lesson = await db.lesson.create({
    data: { ...parsed.data, position, createdById: session.user.id },
  });

  redirect(`/admin/lessons/${lesson.id}/edit`);
}

export type SaveState = { error?: string } | undefined;

export async function updateLessonBasics(_prevState: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const lessonId = formData.get("lessonId");
  if (typeof lessonId !== "string") return { error: "Missing lesson." };

  const parsed = lessonInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db.lesson.update({ where: { id: lessonId }, data: parsed.data });
  revalidatePath(`/admin/lessons/${lessonId}/edit`);
}

export async function updateLessonRecording(_prevState: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const parsed = lessonRecordingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { lessonId, ...data } = parsed.data;
  await db.lesson.update({ where: { id: lessonId }, data });
  revalidatePath(`/admin/lessons/${lessonId}/edit`);
}

export type AddChapterState = { error?: string } | undefined;

export async function addChapter(_prevState: AddChapterState, formData: FormData): Promise<AddChapterState> {
  await requireAdmin();
  const parsed = chapterInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const seconds = parseMmSs(parsed.data.timecode);
  if (seconds === null) return { error: "Use mm:ss, e.g. 03:20." };

  const position = await db.chapter.count({ where: { lessonId: parsed.data.lessonId } });
  await db.chapter.create({
    data: { lessonId: parsed.data.lessonId, label: parsed.data.label, timecodeSeconds: seconds, position },
  });
  revalidatePath(`/admin/lessons/${parsed.data.lessonId}/edit`);
}

export async function deleteChapter(chapterId: string, lessonId: string) {
  await requireAdmin();
  await db.chapter.delete({ where: { id: chapterId } });
  revalidatePath(`/admin/lessons/${lessonId}/edit`);
}

export type AddTakeawayState = { error?: string } | undefined;

export async function addTakeaway(_prevState: AddTakeawayState, formData: FormData): Promise<AddTakeawayState> {
  await requireAdmin();
  const parsed = takeawayInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const position = await db.takeaway.count({ where: { lessonId: parsed.data.lessonId } });
  await db.takeaway.create({
    data: { lessonId: parsed.data.lessonId, text: parsed.data.text, code: `K${position + 1}`, position },
  });
  revalidatePath(`/admin/lessons/${parsed.data.lessonId}/edit`);
}

export async function deleteTakeaway(takeawayId: string, lessonId: string) {
  await requireAdmin();
  await db.takeaway.delete({ where: { id: takeawayId } });
  revalidatePath(`/admin/lessons/${lessonId}/edit`);
}

export async function updateLessonRelease(_prevState: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const parsed = lessonReleaseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { lessonId, scheduledFor, ...rest } = parsed.data;
  await db.lesson.update({
    where: { id: lessonId },
    data: { ...rest, scheduledFor: scheduledFor ? new Date(scheduledFor) : null },
  });
  revalidatePath(`/admin/lessons/${lessonId}/edit`);
  revalidatePath("/lessons");
  revalidatePath("/dashboard");
}
