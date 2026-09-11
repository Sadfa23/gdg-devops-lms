import { z } from "zod";

export const questionInputSchema = z.object({
  lessonId: z.string().uuid(),
  prompt: z.string().min(1, "Ask about a decision, not a definition."),
  topic: z.string().optional(),
  points: z.coerce.number().int().min(1).default(10),
  difficulty: z.enum(["recall", "core", "applied"]).default("core"),
  explanation: z.string().optional(),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  correctOption: z.enum(["A", "B", "C", "D"]),
});

export type QuestionInput = z.infer<typeof questionInputSchema>;

export const quizSettingsInputSchema = z.object({
  lessonId: z.string().uuid(),
  passMarkPercent: z.coerce.number().int().min(1).max(100).default(70),
  timeLimitMinutes: z.coerce.number().int().min(1).default(10),
  attemptsAllowed: z.coerce.number().int().min(0).default(2),
  // Plain booleans, not z.coerce — HTML checkboxes are absent from FormData
  // entirely when unchecked, not "false", so these are parsed by hand from
  // `formData.get(...)` in the action rather than via Object.fromEntries.
  shuffleQuestions: z.boolean(),
  shuffleOptions: z.boolean(),
  showExplanationImmediately: z.boolean(),
});

/** One answer per question, submitted together at the end of a run. */
export const quizSubmissionSchema = z.object({
  lessonId: z.string().uuid(),
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      selectedOptionId: z.string().uuid().nullable(),
    }),
  ),
});

export type QuizSubmission = z.infer<typeof quizSubmissionSchema>;
