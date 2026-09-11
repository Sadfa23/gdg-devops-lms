import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { signInSchema } from "@/features/auth/schema";
import type { Role, UserStatus } from "@/generated/prisma/client";

/**
 * Google + GitHub OAuth, plus Credentials for dev/testing while OAuth is
 * being sorted out (product decision — no email verification either way,
 * since this app has no email infrastructure).
 *
 * This forces JWT sessions app-wide, not just for Credentials — a real,
 * code-level Auth.js constraint, not a config preference: signing in via
 * Credentials always issues a JWT-encoded cookie regardless of the
 * configured strategy (confirmed directly in @auth/core's callback
 * handler), so a "database" strategy would silently fail to recognize
 * anyone who signed in that way — Credentials users would appear logged out
 * because the app would try to look up their JWT as if it were an opaque
 * database session token.
 *
 * The real cost: session revocation is no longer instant. Suspending or
 * promoting a user updates the database immediately, but an already-issued
 * JWT keeps whatever role/status it was minted with until the next sign-in.
 * An earlier version of this re-fetched the user from the database on every
 * single request to close that gap — cute in theory, but it meant every
 * authenticated page load paid a Neon round-trip, and on Neon's free tier
 * (which auto-suspends the database after a few minutes idle) that
 * round-trip can cold-start and take 10+ seconds, which is what was showing
 * up as pages hanging/"crashing". Not worth it: role changes now require a
 * sign-out/in, same as any plain JWT-session app.
 */
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  secret: env.AUTH_SECRET,
  session: { strategy: "jwt" },
  // Without this, Auth.js rejects every callback with "UntrustedHost" unless
  // AUTH_URL is set to one fixed, known origin — impractical here since this
  // runs on localhost during dev/testing and on Vercel's dynamic domain in
  // production. Safe to trust broadly in both of those cases; would matter
  // more behind a reverse proxy that isn't fully under our control.
  trustHost: true,
  providers: [
    Google({ clientId: env.AUTH_GOOGLE_ID, clientSecret: env.AUTH_GOOGLE_SECRET }),
    GitHub({ clientId: env.AUTH_GITHUB_ID, clientSecret: env.AUTH_GITHUB_SECRET }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({ where: { email: parsed.data.email } });
        if (!user?.password) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // `user` is only present on sign-in — it's the full row `authorize()`
      // (Credentials) or the adapter (OAuth) already fetched, so this reads
      // straight from it instead of hitting the database again.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      session.user.status = token.status as UserStatus;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
});
