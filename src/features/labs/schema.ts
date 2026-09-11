import { z } from "zod";

export const submissionInputSchema = z.object({
  labId: z.string().uuid(),
  repoUrl: z.string().url("Paste a real repo URL."),
});

export type SubmissionInput = z.infer<typeof submissionInputSchema>;

export const gradeSubmissionSchema = z.object({
  submissionId: z.string().uuid(),
  state: z.enum(["in_review", "passed", "changes_asked", "overdue"]),
  grade: z.coerce.number().int().min(0).max(100).optional(),
  feedback: z.string().optional(),
});
