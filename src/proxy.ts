import { NextResponse, type NextRequest } from "next/server";

/**
 * Deliberately does NOT import "@/lib/auth" here. That file pulls in the
 * Prisma adapter, and Next 16's proxy bundler (unlike Server Components/
 * Route Handlers, which respect `serverExternalPackages`) tries to bundle
 * everything it imports — which breaks on Prisma 7's WASM query-compiler
 * runtime files. This is also the officially recommended shape anyway: per
 * Next's own proxy docs, this layer should be an OPTIMISTIC check only (does
 * a session cookie exist?), never a DB call. The real check — is this
 * session actually valid, does this role still hold — happens in
 * `(app)/layout.tsx` and inside each Server Action, both of which call
 * `auth()` with full, unrestricted Prisma access.
 */
const SESSION_COOKIE_NAMES = ["authjs.session-token", "__Secure-authjs.session-token"];

const PUBLIC_PATHS = ["/", "/pipeline", "/tools", "/blog", "/sign-in", "/sign-up"];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isPublic) return NextResponse.next();

  const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) => req.cookies.has(name));
  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Excludes _next internals, api/auth, and — critically — anything with a
  // file extension (the standard idiom for "every static asset under
  // public/"). Without that last exclusion, requests like /images/*.png get
  // redirected to /sign-in, and next/image's optimizer then fails with "not
  // a valid image" because it fetched the sign-in HTML instead of a PNG.
  matcher: ["/((?!_next/static|_next/image|api/auth|.*\\.).*)"],
};
