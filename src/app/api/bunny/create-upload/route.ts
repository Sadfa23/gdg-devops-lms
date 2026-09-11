import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

/**
 * Two-step handshake the client needs before it can start a TUS upload
 * straight to Bunny: (1) create the video object server-side (Bunny requires
 * a GUID to exist before any bytes land), (2) sign that GUID so the browser
 * can authenticate directly to Bunny's TUS endpoint without ever seeing the
 * API key. Same shape as /api/cloudinary/sign, same reason — admin-gated
 * here too since a route handler doesn't inherit a page layout's guard.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { title } = await request.json();

  // Outbound fetches from `next dev`'s process have been intermittently
  // flaky in this environment before (see instrumentation.ts's DNS-order
  // fix for the same class of issue) — a couple of quick retries absorbs a
  // transient connect timeout instead of failing a real upload over it.
  let createRes: Response | undefined;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      createRes = await fetch(`https://video.bunnycdn.com/library/${env.BUNNY_STREAM_LIBRARY_ID}/videos`, {
        method: "POST",
        headers: {
          AccessKey: env.BUNNY_STREAM_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ title: typeof title === "string" && title.trim() ? title : "Untitled lesson recording" }),
      });
      break;
    } catch {
      if (attempt === 2) break;
    }
  }

  if (!createRes || !createRes.ok) {
    return NextResponse.json({ error: "Couldn't create the video on Bunny Stream." }, { status: 502 });
  }

  const { guid: videoId } = await createRes.json();

  const expiration = Math.floor(Date.now() / 1000) + 3600; // 1 hour to complete the upload
  const signature = createHash("sha256")
    .update(`${env.BUNNY_STREAM_LIBRARY_ID}${env.BUNNY_STREAM_API_KEY}${expiration}${videoId}`)
    .digest("hex");

  return NextResponse.json({ videoId, libraryId: env.BUNNY_STREAM_LIBRARY_ID, signature, expiration });
}
