"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { signInSchema, signUpSchema } from "./schema";

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
