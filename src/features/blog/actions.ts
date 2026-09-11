"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { estimateReadingTime } from "@/lib/reading-time";
import { postInputSchema, updatePostContentSchema, updatePostMetaSchema } from "./schema";
import { slugify } from "./slug";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "admin") throw new Error("Not authorized.");
  return session;
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  let slug = base;
  let suffix = 2;
  while (await db.post.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

export type CreatePostState = { error?: string } | undefined;

export async function createPost(_prevState: CreatePostState, formData: FormData): Promise<CreatePostState> {
  const session = await requireAdmin();

  const parsed = postInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const post = await db.post.create({
    data: {
      ...parsed.data,
      slug: await uniqueSlug(parsed.data.title),
      authorId: session.user.id,
    },
  });

  redirect(`/admin/posts/${post.id}/edit`);
}

export async function updatePostMeta(input: unknown) {
  await requireAdmin();
  const { postId, ...data } = updatePostMetaSchema.parse(input);
  await db.post.update({ where: { id: postId }, data });
  revalidatePath(`/admin/posts/${postId}/edit`);
  revalidatePath("/blog");
}

/** Fires on a debounce while typing and on blur — the raw Markdown body is
 * the single source of truth for a post's content, so this is the only save
 * path the compose textarea needs. Read time is recomputed here rather than
 * left as a manually-typed field, so it can never drift from the actual
 * word count. */
export async function updatePostContent(input: unknown) {
  await requireAdmin();
  const { postId, content } = updatePostContentSchema.parse(input);
  await db.post.update({
    where: { id: postId },
    data: { content, readTimeMinutes: estimateReadingTime(content) },
  });
  revalidatePath(`/admin/posts/${postId}/edit`);
  revalidatePath("/blog");
}

export async function setPostStatus(postId: string, status: "draft" | "live") {
  await requireAdmin();
  await db.post.update({
    where: { id: postId },
    data: { status, publishedAt: status === "live" ? new Date() : null },
  });
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${postId}/edit`);
}

export async function deletePost(postId: string) {
  await requireAdmin();
  await db.post.delete({ where: { id: postId } });
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
