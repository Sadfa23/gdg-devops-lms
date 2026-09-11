import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

/**
 * Signs upload requests for the Cloudinary upload widget (next-cloudinary's
 * `CldUploadWidget`, used by CloudinaryUploadButton). Signed rather than an
 * unsigned upload preset — signed needs no dashboard configuration at all
 * (an unsigned preset would have to be created manually in the Cloudinary
 * console first), and keeps the API secret server-side, which an unsigned
 * preset can't guarantee against abuse from anyone who finds the preset name.
 *
 * Admin-gated: this is only reachable from the lesson/blog editors, both
 * already behind (app)/admin's layout gate, but the route itself checks too
 * since a route handler doesn't inherit a page layout's protection.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { paramsToSign } = await request.json();
  const signature = cloudinary.utils.api_sign_request(paramsToSign, env.CLOUDINARY_API_SECRET);

  return NextResponse.json({ signature });
}
