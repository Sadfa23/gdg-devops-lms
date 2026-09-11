import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/lib/env";

/**
 * Two different adapters for two different runtimes:
 *
 * - On Vercel (`process.env.VERCEL` is set automatically there), use Neon's
 *   HTTP/WebSocket driver — the thing that actually matters for serverless
 *   functions, where a pooled TCP connection per invocation doesn't work.
 * - Everywhere else (local dev, `next start` on a normal machine), use a
 *   plain TCP connection via `pg`. The Neon WebSocket driver was repeatedly
 *   unreliable in local dev specifically — intermittent hangs and thrown
 *   `ErrorEvent`s traced back to it more than once — while a boring TCP
 *   connection to the same Neon database (its pooled connection string works
 *   fine for either driver) has been solid. Use the simpler, more reliable
 *   option wherever the serverless constraint doesn't actually apply.
 *
 * `prisma migrate` / `prisma studio` connect directly instead, via
 * prisma.config.ts — this file only affects the app's own runtime queries.
 */
const adapter = process.env.VERCEL ? new PrismaNeon({ connectionString: env.DATABASE_URL }) : new PrismaPg({ connectionString: env.DATABASE_URL });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
