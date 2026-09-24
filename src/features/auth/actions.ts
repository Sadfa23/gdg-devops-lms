"use server";

import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { originUrl } from "@/lib/origin";
import { signInSchema, signUpSchema, forgotPasswordSchema, resetPasswordSchema } from "./schema";

export type SignInState = { error?: string } | undefined;

export async function signInWithCredentials(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email and password." };

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/dashboard?welcome=1" });
  } catch (err) {
    // AuthError covers "wrong password" etc.; anything else (notably the
    // internal redirect signIn() throws on success) must propagate as-is.
    if (err instanceof AuthError) {
      return { error: "Incorrect email or password." };
    }
    throw err;
  }
}

export type SignUpState = { error?: string } | undefined;

/**
 * Credentials sign-up exists for dev/testing while OAuth is being sorted out
 * (product decision) — no email verification (no email infra in this app),
 * so a new account goes straight to `active`. That also means anyone can
 * claim any email address here; this path is not a substitute for OAuth's
 * identity guarantee and should be reconsidered before real club members
 * rely on it for anything that assumes a verified university email.
 */
export async function signUp(_prevState: SignUpState, formData: FormData): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { name, registrationNumber, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists — sign in instead." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.create({
    data: { name, registrationNumber, email, password: passwordHash, status: "active" },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard?welcome=1" });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created — sign in with your new password." };
    }
    throw err;
  }
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard?welcome=1" });
}

export async function signInWithGithub() {
  await signIn("github", { redirectTo: "/dashboard?welcome=1" });
}

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export type ForgotPasswordState = { message: string } | undefined;

/**
 * Always returns the same message whether or not the email is registered —
 * telling the caller "no account with that email" would let anyone check
 * who's signed up, one email at a time.
 */
export async function requestPasswordReset(_prevState: ForgotPasswordState, formData: FormData): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  const genericMessage = "If that email has an account, we've sent a reset link — check your inbox.";
  if (!parsed.success) return { message: genericMessage };

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const rawToken = randomBytes(32).toString("hex");
    await db.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashToken(rawToken), expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
    });

    const origin = await originUrl();
    await sendPasswordResetEmail(user.email, `${origin}/reset-password/${rawToken}`);
  }

  return { message: genericMessage };
}

export type ResetPasswordState = { error?: string } | undefined;

export async function resetPassword(_prevState: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const record = await db.passwordResetToken.findUnique({ where: { tokenHash: hashToken(parsed.data.token) } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { error: "That reset link is invalid or has expired — request a new one." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { password: passwordHash } }),
    db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  redirect("/sign-in?reset=1");
}
