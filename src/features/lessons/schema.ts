import { z } from "zod";

/**
 * Single source of truth for a lesson's input shape — used by the builder
 * form's client-side validation AND re-validated server-side inside the
 * Server Action. Never trust the client copy alone.
 */
export const lessonInputSchema = z.object({
  moduleId: z.string().uuid(),
  code: z
    .string()
    .min(1, "Required — e.g. 04.10")
    .regex(/^\d{2}\.\d{2}$/, "Use the MM.LL format, e.g. 04.10"),
  title: z.string().min(1, "What does the learner walk away able to do?"),
  summary: z.string().optional(),
});

export type LessonInput = z.infer<typeof lessonInputSchema>;

export const lessonRecordingSchema = z.object({
  lessonId: z.string().uuid(),
  bunnyVideoId: z.string().optional(),
  videoPublicId: z.string().optional(),
  posterPublicId: z.string().optional(),
  captionsPublicId: z.string().optional(),
  transcript: z.string().optional(),
});

export const chapterInputSchema = z.object({
  lessonId: z.string().uuid(),
  timecode: z.string().regex(/^\d+:\d{2}$/, "Use mm:ss, e.g. 03:20"),
  label: z.string().min(1),
});

export const takeawayInputSchema = z.object({
  lessonId: z.string().uuid(),
  text: z.string().min(1),
});

export const lessonReleaseSchema = z.object({
  lessonId: z.string().uuid(),
  visibility: z.enum(["draft", "scheduled", "live"]),
  scheduledFor: z.string().optional(),
  xp: z.coerce.number().int().min(0).default(0),
  level: z.enum(["core", "deep_dive", "optional"]).default("core"),
});
