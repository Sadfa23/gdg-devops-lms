import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "Tell us who you are."),
  registrationNumber: z.string().optional(),
  email: z.string().email("That doesn't look like a valid email."),
  password: z.string().min(8, "At least 8 characters."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "At least 8 characters."),
});
