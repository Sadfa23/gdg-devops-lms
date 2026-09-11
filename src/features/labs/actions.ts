"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { gradeSubmissionSchema, submissionInputSchema } from "./schema";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "admin") throw new Error("Not authorized.");
  return session;
}

export type SubmitLabState = { error?: string } | undefined;

export async function submitLab(_prevState: SubmitLabState, formData: FormData): Promise<SubmitLabState> {
  const session = await auth();
  if (!session) return { error: "Not signed in." };

  const parsed = submissionInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db.labSubmission.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  revalidatePath("/submissions");
}

export type GradeSubmissionState = { error?: string } | undefined;

export async function gradeSubmission(_prevState: GradeSubmissionState, formData: FormData): Promise<GradeSubmissionState> {
  const session = await requireAdmin();

  const parsed = gradeSubmissionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { submissionId, ...data } = parsed.data;
  await db.labSubmission.update({
    where: { id: submissionId },
    data: { ...data, gradedAt: new Date(), gradedById: session.user.id },
  });

  revalidatePath("/admin/labs");
  revalidatePath("/submissions");
}
