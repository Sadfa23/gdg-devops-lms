import { z } from "zod";

/**
 * Validated at import time so a missing/misconfigured var fails loudly at
 * boot — not three requests deep as a cryptic Prisma/OAuth error.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  BUNNY_STREAM_LIBRARY_ID: z.string().min(1),
  BUNNY_STREAM_API_KEY: z.string().min(1),
  BUNNY_STREAM_CDN_HOSTNAME: z.string().min(1),
  NEXT_PUBLIC_TOPOGRAPH_URL: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
